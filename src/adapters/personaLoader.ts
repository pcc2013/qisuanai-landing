// D:\nira-app\src\adapters\personaLoader.ts

/**
 * 人格 & AI 形象 加载适配器
 * 负责：加载官方预置人格、AI形象、虚拟世界（场景）背景。
 * 数据源：D:\nira-app\personas\ 目录下的静态资源。
 * 
 * Nira 8 大人格体系：
 *   heal, casual, eastern_philosophy, business, sport, art, tutor, fashion
 */

export interface Persona {
  id: string;
  name: string;
  avatar: string;
  desc: string;
  type: string;
}

const OFFICIAL_PERSONAS: Persona[] = [
  { id: 'heal', name: 'Emotional Healer', avatar: '/personas/heal/avatar/anwen.jpg', desc: 'Gentle, empathic, slow-paced', type: 'official' },
  { id: 'casual', name: 'Casual Companion', avatar: '/personas/casual/avatar/xiao_c.jpg', desc: 'Relaxed, humorous, daily chat', type: 'official' },
  { id: 'eastern_philosophy', name: 'Eastern Sage', avatar: '/personas/eastern_philosophy/avatar/taibai.jpg', desc: 'Wise, composed, philosophical', type: 'official' },
  { id: 'business', name: 'Business Elite', avatar: '/personas/business/avatar/elena_nb.jpg', desc: 'Professional, efficient, career-focused', type: 'official' },
  { id: 'sport', name: 'Sports Coach', avatar: '/personas/sport/avatar/kai_male.jpg', desc: 'Energetic, motivational, health-focused', type: 'official' },
  { id: 'art', name: 'Creative Artist', avatar: '/personas/art/avatar/muse_yellow.jpg', desc: 'Sensitive, aesthetic, artistic', type: 'official' },
  { id: 'tutor', name: 'Knowledge Tutor', avatar: '/personas/tutor/avatar/prof_lee.jpg', desc: 'Knowledgeable, patient, educational', type: 'official' },
  { id: 'fashion', name: 'Trend Entertainer', avatar: '/personas/fashion/avatar/z.jpg', desc: 'Trendy, witty, entertainment-focused', type: 'official' },
];

export const personaLoaderAdapter = {
  /**
   * 加载全部8个官方人格
   */
  async loadOfficialPersonas(): Promise<Persona[]> {
    return OFFICIAL_PERSONAS;
  },

  /**
   * 加载用户创建的 AI 分身列表
   */
  async loadUserPersonas(userId: string): Promise<Persona[]> {
    try {
      const cached = localStorage.getItem(`nira-user-clones-${userId}`);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  },

  /**
   * 切换当前使用的官方人格
   */
  async switchPersona(userId: string, personaId: string): Promise<boolean> {
    try {
      localStorage.setItem(`nira-active-persona-${userId}`, personaId);
    } catch {}
    return true;
  },

  /**
   * 删除一个 AI 分身
   */
  async deletePersona(userId: string, personaId: string): Promise<boolean> {
    try {
      const list = await this.loadUserPersonas(userId);
      const filtered = list.filter((p) => p.id !== personaId);
      localStorage.setItem(`nira-user-clones-${userId}`, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * 按关键词搜索人格或分身
   */
  searchPersona(keyword: string, personas: Persona[]): Persona[] {
    const lower = keyword.toLowerCase();
    return personas.filter(
      (p) => p.name.toLowerCase().includes(lower) || p.desc.toLowerCase().includes(lower)
    );
  },

  // ========== 虚拟世界（场景）背景与 AI 形象资源路径辅助 ==========

  /**
   * 获取指定人格的所有可用 AI 形象（头像）路径
   * 实际场景中需根据 D:\nira-app\personas\{id}\avatar\ 目录动态生成，此处为静态映射示例。
   */
  getAvatarList(personaId: string): string[] {
    const avatarMap: Record<string, string[]> = {
      heal: ['/personas/heal/avatar/anwen.jpg', '/personas/heal/avatar/wenyan.jpg', '/personas/heal/avatar/jingyu.jpg'],
      casual: ['/personas/casual/avatar/xiao_c.jpg', '/personas/casual/avatar/aluo.jpg'],
      eastern_philosophy: ['/personas/eastern_philosophy/avatar/taibai.jpg', '/personas/eastern_philosophy/avatar/baizhi.jpg'],
      business: ['/personas/business/avatar/elena_male.jpg', '/personas/business/avatar/elena_nb.jpg'],
      sport: ['/personas/sport/avatar/kai_male.jpg', '/personas/sport/avatar/kai_female.jpg', '/personas/sport/avatar/ryo.jpg'],
      art: ['/personas/art/avatar/muse_yellow.jpg', '/personas/art/avatar/muse_black.jpg', '/personas/art/avatar/leon_white.jpg', '/personas/art/avatar/leon_yellow.jpg'],
      tutor: ['/personas/tutor/avatar/prof_lee.jpg', '/personas/tutor/avatar/prof_lin.jpg', '/personas/tutor/avatar/prof_chen.jpg'],
      fashion: ['/personas/fashion/avatar/z.jpg', '/personas/fashion/avatar/jax.jpg', '/personas/fashion/avatar/rei.jpg'],
    };
    return avatarMap[personaId] || [];
  },

  /**
   * 获取指定人格的虚拟世界（场景）背景路径
   */
  getSceneList(personaId: string): string[] {
    return Array.from({ length: 5 }, (_, i) => `/personas/${personaId}/scenes/scene_${String(i + 1).padStart(2, '0')}.jpg`);
  },
};