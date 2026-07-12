// D:\nira-app\src\data\emotionKeywords.ts

type EmotionKeywords = Record<string, string>;

const emotionKeywords: EmotionKeywords = {
  // ===== HAPPY → casual =====
  'happy': 'casual', 'glad': 'casual', 'joy': 'casual', 'excited': 'casual', 'wonderful': 'casual', 'great': 'casual', 'thrilled': 'casual', 'delighted': 'casual', 'cheerful': 'casual', 'elated': 'casual', 'ecstatic': 'casual', 'overjoyed': 'casual', 'blissful': 'casual', 'jubilant': 'casual', 'merry': 'casual',
  '开心': 'casual', '高兴': 'casual', '快乐': 'casual', '太好了': 'casual', '兴奋': 'casual', '幸福': 'casual', '愉快': 'casual', '喜悦': 'casual', '欢乐': 'casual', '欣喜': 'casual', '雀跃': 'casual', '欢笑': 'casual',
  'senang': 'casual', 'gembira': 'casual', 'bahagia': 'casual', 'hebat': 'casual', 'luar biasa': 'casual', 'antusias': 'casual', 'ceria': 'casual', 'riang': 'casual', 'suka': 'casual',
  'vui': 'casual', 'hạnh phúc': 'casual', 'phấn khích': 'casual', 'tuyệt vời': 'casual', 'tuyệt quá': 'casual', 'hân hoan': 'casual', 'sung sướng': 'casual', 'vui vẻ': 'casual',

  // ===== SAD → heal =====
  'sad': 'heal', 'depressed': 'heal', 'lonely': 'heal', 'heartbroken': 'heal', 'crying': 'heal', 'down': 'heal', 'gloomy': 'heal', 'miserable': 'heal', 'sorrow': 'heal', 'grief': 'heal', 'melancholy': 'heal', 'despair': 'heal', 'hopeless': 'heal', 'mourn': 'heal', 'blue': 'heal',
  '难过': 'heal', '伤心': 'heal', '失落': 'heal', '抑郁': 'heal', '孤独': 'heal', '想哭': 'heal', '沮丧': 'heal', '悲哀': 'heal', '痛苦': 'heal', '绝望': 'heal', '无助': 'heal', '凄凉': 'heal', '忧伤': 'heal', '悲痛': 'heal',
  'sedih': 'heal', 'depresi': 'heal', 'kesepian': 'heal', 'patah hati': 'heal', 'menangis': 'heal', 'murung': 'heal', 'putus asa': 'heal', 'sengsara': 'heal', 'duka': 'heal',
  'buồn': 'heal', 'trầm cảm': 'heal', 'cô đơn': 'heal', 'tan vỡ': 'heal', 'khóc': 'heal', 'u sầu': 'heal', 'tuyệt vọng': 'heal', 'đau khổ': 'heal', 'thất vọng': 'heal',

  // ===== ANXIOUS → heal =====
  'anxious': 'heal', 'worried': 'heal', 'stressed': 'heal', 'nervous': 'heal', 'panic': 'heal', 'overwhelmed': 'heal', 'fear': 'heal', 'uneasy': 'heal', 'restless': 'heal', 'tense': 'heal', 'apprehensive': 'heal', 'dread': 'heal', 'fretful': 'heal', 'agitated': 'heal',
  '焦虑': 'heal', '担心': 'heal', '紧张': 'heal', '不安': 'heal', '压力大': 'heal', '失眠': 'heal', '心慌': 'heal', '恐惧': 'heal', '惶恐': 'heal', '烦躁': 'heal', '忐忑': 'heal', '忧心': 'heal', '坐立不安': 'heal',
  'cemas': 'heal', 'khawatir': 'heal', 'stres': 'heal', 'gugup': 'heal', 'panik': 'heal', 'tertekan': 'heal', 'takut': 'heal', 'gelisah': 'heal',
  'lo lắng': 'heal', 'căng thẳng': 'heal', 'bất an': 'heal', 'hoảng sợ': 'heal', 'áp lực': 'heal', 'mất ngủ': 'heal', 'sợ hãi': 'heal', 'bồn chồn': 'heal',

  // ===== ANGRY → eastern_philosophy =====
  'angry': 'eastern_philosophy', 'furious': 'eastern_philosophy', 'annoyed': 'eastern_philosophy', 'irritated': 'eastern_philosophy', 'mad': 'eastern_philosophy', 'fed up': 'eastern_philosophy', 'enraged': 'eastern_philosophy', 'outraged': 'eastern_philosophy', 'livid': 'eastern_philosophy', 'wrath': 'eastern_philosophy', 'resentful': 'eastern_philosophy', 'bitter': 'eastern_philosophy', 'frustrated': 'eastern_philosophy', 'indignant': 'eastern_philosophy', 'cross': 'eastern_philosophy',
  '生气': 'eastern_philosophy', '愤怒': 'eastern_philosophy', '讨厌': 'eastern_philosophy', '受不了': 'eastern_philosophy', '火大': 'eastern_philosophy', '恼怒': 'eastern_philosophy', '恼火': 'eastern_philosophy', '愤慨': 'eastern_philosophy', '怨恨': 'eastern_philosophy', '愤恨': 'eastern_philosophy',
  'marah': 'eastern_philosophy', 'kesal': 'eastern_philosophy', 'jengkel': 'eastern_philosophy', 'terganggu': 'eastern_philosophy', 'muak': 'eastern_philosophy', 'geram': 'eastern_philosophy', 'dendam': 'eastern_philosophy',
  'tức giận': 'eastern_philosophy', 'bực mình': 'eastern_philosophy', 'khó chịu': 'eastern_philosophy', 'phát điên': 'eastern_philosophy', 'chán ngấy': 'eastern_philosophy', 'căm phẫn': 'eastern_philosophy',

  // ===== CALM → tutor =====
  'calm': 'tutor', 'peaceful': 'tutor', 'relaxed': 'tutor', 'serene': 'tutor', 'tranquil': 'tutor', 'composed': 'tutor', 'collected': 'tutor', 'content': 'tutor', 'centered': 'tutor', 'grounded': 'tutor', 'balanced': 'tutor', 'harmonious': 'tutor', 'mindful': 'tutor', 'still': 'tutor', 'placid': 'tutor',
  '平静': 'tutor', '冷静': 'tutor', '安静': 'tutor', '安宁': 'tutor', '平和': 'tutor', '从容': 'tutor', '淡定': 'tutor', '宁静': 'tutor', '沉稳': 'tutor', '镇定': 'tutor', '泰然': 'tutor', '心平气和': 'tutor',
  'tenang': 'tutor', 'damai': 'tutor', 'santai': 'tutor', 'tenteram': 'tutor', 'sejuk': 'tutor', 'relaks': 'tutor', 'teduh': 'tutor',
  'bình tĩnh': 'tutor', 'yên bình': 'tutor', 'thư giãn': 'tutor', 'an nhiên': 'tutor', 'tĩnh lặng': 'tutor', 'thanh thản': 'tutor', 'điềm tĩnh': 'tutor',
};

export function detectEmotion(text: string): string | null {
  if (!text) return null;
  const lower = text.toLowerCase().replace(/[^a-zA-Z\u4e00-\u9fff\u1ea0-\u1ef9]/g, '');
  for (const [keyword, personaId] of Object.entries(emotionKeywords)) {
    if (lower.includes(keyword.toLowerCase())) {
      return personaId;
    }
  }
  return null;
}

export default emotionKeywords;