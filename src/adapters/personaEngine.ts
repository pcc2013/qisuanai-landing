// D:\nira-app\src\adapters\personaEngine.ts

import { useQSStore } from '../store/useQSStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { usePersonaStore, PERSONA_CHARACTERS, PERSONA_CONFIGS } from '../store/usePersonaStore';

export interface DistillRequest {
  personaId: string;
  cleaningLevel: 'heavy' | 'medium' | 'light' | 'enterprise';
  materials: {
    chatRecords?: File[];
    voiceSamples?: File[];
    facePhotos?: File[];
  };
}

export interface DistillResult {
  success: boolean;
  localPath?: string;
  serverId?: string;
  error?: string;
}

const DISTILL_PRICES: Record<string, number> = {
  heavy: 1999,
  medium: 3999,
  light: 9999,
  enterprise: 0,
};

// ===== YAML 简版解析 =====
function parseYamlSimple(yamlText: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = yamlText.split('\n');
  let currentKey = '';
  let currentArray: string[] = [];
  let inArray = false;

  for (const line of lines) {
    if (line.trim() === '' || line.startsWith('#')) continue;

    const topMatch = line.match(/^(\w[\w_]*):\s*(.*)/);
    if (topMatch && !line.startsWith(' ') && !line.startsWith('-')) {
      if (inArray && currentKey) {
        result[currentKey] = currentArray;
        currentArray = [];
        inArray = false;
      }
      currentKey = topMatch[1];
      const value = topMatch[2]?.trim().replace(/^["']|["']$/g, '');
      if (value && value !== '') {
        result[currentKey] = value;
      }
      continue;
    }

    const arrMatch = line.match(/^\s+-\s+(.*)/);
    if (arrMatch && currentKey) {
      inArray = true;
      currentArray.push(arrMatch[1].trim().replace(/^["']|["']$/g, ''));
      continue;
    }

    if (line.match(/^\s+\w/) && currentKey && !line.startsWith('-')) {
      const existing = result[currentKey];
      if (typeof existing === 'string') {
        result[currentKey] = existing + '\n' + line.trim();
      }
    }
  }

  if (inArray && currentKey) {
    result[currentKey] = currentArray;
  }

  return result;
}

// ===== 获取当前角色 System Prompt =====
export async function getCurrentCharacterPrompt(): Promise<string> {
  const char = usePersonaStore.getState().getCurrentCharacter();
  if (!char) return '';

  const personaId = char.personaId;
  const charId = char.id;
  const path = `/personas/${personaId}/characters/${charId}.yaml`;

  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`[personaEngine] 无法加载角色人设: ${path}`);
      return '';
    }
    const yamlText = await response.text();
    const parsed = parseYamlSimple(yamlText);
    return buildSystemPrompt(parsed, char);
  } catch (error) {
    console.error(`[personaEngine] 加载角色人设失败: ${path}`, error);
    return '';
  }
}

function buildSystemPrompt(parsed: Record<string, any>, char: any): string {
  const lines: string[] = [];

  lines.push(`[系统指令]`);
  lines.push(`你现在以 ${parsed.name || char.name} 的身份进行对话。`);
  lines.push(`角色设定如下：`);
  lines.push(`- 称呼：${parsed.name || char.name}`);
  lines.push(`- 性别：${parsed.gender || char.gender}`);
  lines.push(`- 年龄：${parsed.age || char.age}岁`);
  lines.push(`- 风格：${parsed.archetype || ''}`);
  lines.push('');

  if (parsed.catchphrases && Array.isArray(parsed.catchphrases)) {
    lines.push('[口头禅参考]');
    lines.push('以下是你偶尔会使用的口头禅，请不要在每次回复中都使用：');
    parsed.catchphrases.forEach((phrase: string) => {
      lines.push(`- 偶尔使用: "${phrase}"`);
    });
    lines.push('');
  }

  if (parsed.first_meeting_monologue) {
    lines.push('[首次见面]');
    lines.push(parsed.first_meeting_monologue);
    lines.push('');
  }

  if (parsed.forbidden_topics && Array.isArray(parsed.forbidden_topics)) {
    lines.push('[绝对禁止]');
    parsed.forbidden_topics.forEach((topic: string, index: number) => {
      lines.push(`${index + 1}. ${topic}`);
    });
    lines.push('');
  }

  lines.push('[安全边界]');
  lines.push('1. 用户提到自杀、自伤、暴力等内容时，立刻切换为安全关怀模式。');
  lines.push('2. 不提供医疗、法律、投资建议。');
  lines.push('3. 不输出色情内容。');
  lines.push('4. 保持角色一致性，不跳出角色设定。');
  lines.push('5. 用户说什么语言，你就用什么语言回复。');

  return lines.join('\n');
}

export async function getPersonaGeneralPrompt(personaId: string, lang: string = 'zh'): Promise<string> {
  const path = `/personas/${personaId}/prompts/system_prompt_${lang}.md`;

  try {
    const response = await fetch(path);
    if (!response.ok) return '';
    return await response.text();
  } catch {
    return '';
  }
}

export async function getActiveSystemPrompt(lang: string = 'zh'): Promise<string> {
  const charPrompt = await getCurrentCharacterPrompt();
  if (charPrompt) return charPrompt;

  const personaId = usePersonaStore.getState().currentPersonaId;
  if (personaId) {
    const generalPrompt = await getPersonaGeneralPrompt(personaId, lang);
    if (generalPrompt) return generalPrompt;
  }

  return '你是一个名为Nira的AI陪伴助手。请用温和、共情的语气回复用户。';
}

// ===== 蒸馏功能 =====
export async function triggerDistill(request: DistillRequest): Promise<DistillResult> {
  const { currentTier, distillCount, decrementDistillCount } = useSubscriptionStore.getState();
  const { qsBalance, deductQS } = useQSStore.getState();

  const price = DISTILL_PRICES[request.cleaningLevel] || 0;

  if (currentTier === 'free') {
    return { success: false, error: '蒸馏功能需要月卡及以上订阅' };
  }

  if (request.cleaningLevel === 'light' && currentTier !== 'annual' && currentTier !== 'enterprise') {
    return { success: false, error: '轻度清洗需要年卡订阅' };
  }

  if (request.cleaningLevel === 'enterprise' && currentTier !== 'enterprise') {
    return { success: false, error: '企业清洗仅限企业签约用户' };
  }

  if (price > 0 && qsBalance < price) {
    return { success: false, error: `QS 余额不足，需要 ${price} QS` };
  }

  if (currentTier === 'monthly' && distillCount <= 0) {
    return { success: false, error: '本月蒸馏次数已用完' };
  }

  if (currentTier === 'semi-annual' && distillCount <= 0) {
    return { success: false, error: '本期蒸馏次数已用完' };
  }

  if (price > 0) {
    const deducted = deductQS(price, `蒸馏-${request.cleaningLevel}-${request.personaId}`);
    if (!deducted) return { success: false, error: '扣费失败' };
  }

  if (currentTier !== 'annual' && currentTier !== 'enterprise') {
    decrementDistillCount();
  }

  return new Promise<DistillResult>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        localPath: `private/${request.personaId}_${request.cleaningLevel}.nira`,
        serverId: `avatar_${Date.now()}`,
      });
    }, 3000);
  });
}

export function getDistillStatus() {
  const { currentTier, distillCount } = useSubscriptionStore.getState();
  const { qsBalance } = useQSStore.getState();

  return {
    canDistill: currentTier !== 'free',
    remainingCount: currentTier === 'annual' || currentTier === 'enterprise' ? Infinity : distillCount,
    qsBalance,
    availableLevels: {
      heavy: currentTier !== 'free',
      medium: currentTier !== 'free',
      light: currentTier === 'annual' || currentTier === 'enterprise',
      enterprise: currentTier === 'enterprise',
    },
  };
}