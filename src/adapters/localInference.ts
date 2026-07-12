// D:\nira-app\src\adapters\localInference.ts

/**
 * 端侧 MeloTTS 推理引擎
 * 使用 ONNX Runtime Web 在浏览器/WebView 中运行 MeloTTS 模型
 * 
 * 模型来源: https://github.com/myshell-ai/MeloTTS
 * 模型文件: melotts.onnx (约 45MB)
 * 字典文件: melotts.dict.txt (约 200KB)
 */

import { InferenceSession, Tensor } from 'onnxruntime-web';

const MODEL_CONFIG = {
  modelUrl: '/models/melotts/melotts.onnx',
  dictUrl: '/models/melotts/melotts.dict.txt',
  modelSize: 45 * 1024 * 1024,
  dictSize: 200 * 1024,
};

let session: InferenceSession | null = null;
let dictLoaded = false;
let charToId: Map<string, number> = new Map();

// ===== 下载模型文件 =====
export async function downloadMeloTTS(onProgress: (pct: number) => void): Promise<void> {
  const { modelUrl, dictUrl, modelSize, dictSize } = MODEL_CONFIG;
  const totalSize = modelSize + dictSize;
  let downloaded = 0;

  // 下载字典
  const dictResp = await fetch(dictUrl);
  if (!dictResp.ok) throw new Error('字典文件下载失败');
  const dictText = await dictResp.text();
  dictText.split('\n').forEach((line, index) => {
    const char = line.trim();
    if (char) charToId.set(char, index);
  });
  dictLoaded = true;
  downloaded += dictSize;
  onProgress(Math.round((downloaded / totalSize) * 100));

  // 下载模型
  const modelResp = await fetch(modelUrl);
  if (!modelResp.ok) throw new Error('模型文件下载失败');

  const reader = modelResp.body!.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress(Math.round(((downloaded + received) / totalSize) * 100));
  }

  // 合并数据块并加载 ONNX 模型
  const modelData = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    modelData.set(chunk, offset);
    offset += chunk.length;
  }

  session = await InferenceSession.create(modelData.buffer);
}

// ===== 文本 → 音素序列 =====
function textToPhonemes(text: string): number[] {
  const ids: number[] = [];
  for (const char of text) {
    const id = charToId.get(char);
    if (id !== undefined) ids.push(id);
  }
  return ids;
}

// ===== TTS 推理 =====
export async function meloTTS(text: string): Promise<Float32Array | null> {
  if (!session || !dictLoaded) {
    console.warn('[localInference] MeloTTS 模型未加载');
    return null;
  }

  const phonemeIds = textToPhonemes(text);
  if (phonemeIds.length === 0) return null;

  const inputTensor = new Tensor('int64', new BigInt64Array(phonemeIds.map(id => BigInt(id))), [1, phonemeIds.length]);

  const outputs = await session.run({ input: inputTensor });
  const audioData = outputs['output']?.data as Float32Array;

  return audioData || null;
}

// ===== 检查模型是否就绪 =====
export function isMeloTTSReady(): boolean {
  return session !== null && dictLoaded;
}

// ===== 获取模型大小 =====
export function getMeloTTSModelSize(): number {
  return MODEL_CONFIG.modelSize + MODEL_CONFIG.dictSize;
}