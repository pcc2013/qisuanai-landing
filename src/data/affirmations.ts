// D:\nira-app\src\data\affirmations.ts

export type Lang = 'en' | 'zh' | 'zh-TW' | 'id' | 'vi';

const affirmations: Record<Lang, string[]> = {
  en: [
    "Every moment deserves to be cherished.",
    "You are enough, just as you are.",
    "The stars shine brightest in the darkest nights.",
    "Your story is still being written.",
    "Breathe deeply. Everything is unfolding as it should.",
    "You are not alone on this journey.",
    "Small steps lead to big changes.",
    "Today is a gift — that's why it's called the present.",
    "Kindness is a language the deaf can hear and the blind can see.",
    "The best time for new beginnings is now.",
    "Your smile can change the world.",
    "Peace begins with a smile.",
    "Happiness is not by chance, but by choice.",
    "Every day is a fresh start.",
    "You are stronger than you think.",
  ],
  zh: [
    "每一刻都值得被温柔对待。",
    "你现在的样子，就已经足够好。",
    "最暗的夜，才能看见最亮的星。",
    "你的故事，还在继续书写。",
    "深呼吸。一切都在按它应有的方式展开。",
    "这段旅程，你并不孤单。",
    "小小的步伐，也能走向大大的改变。",
    "今天是份礼物——好好珍惜。",
    "温柔是最强大的力量。",
    "新的一天，新的开始。",
    "你的微笑可以改变世界。",
    "宁静从微笑开始。",
    "幸福不是偶然，而是选择。",
    "每一天都是崭新的起点。",
    "你比自己想象的更坚强。",
  ],
  'zh-TW': [
    "每一刻都值得被溫柔對待。",
    "你現在的樣子，就已經足夠好。",
    "最暗的夜，才能看見最亮的星。",
    "你的故事，還在繼續書寫。",
    "深呼吸。一切都在按它應有的方式展開。",
    "這段旅程，你並不孤單。",
    "小小的步伐，也能走向大大的改變。",
    "今天是份禮物——好好珍惜。",
    "溫柔是最強大的力量。",
    "新的一天，新的開始。",
    "你的微笑可以改變世界。",
    "寧靜從微笑開始。",
    "幸福不是偶然，而是選擇。",
    "每一天都是嶄新的起點。",
    "你比自己想像的更堅強。",
  ],
  id: [
    "Setiap momen layak untuk dihargai.",
    "Kamu sudah cukup, apa adanya.",
    "Bintang paling terang muncul di malam paling gelap.",
    "Ceritamu masih terus ditulis.",
    "Tarik napas dalam-dalam. Semuanya berjalan sebagaimana mestinya.",
    "Kamu tidak sendiri dalam perjalanan ini.",
    "Langkah kecil membawa perubahan besar.",
    "Hari ini adalah hadiah — hargailah.",
    "Kebaikan adalah bahasa universal.",
    "Waktu terbaik untuk memulai adalah sekarang.",
    "Senyummu bisa mengubah dunia.",
    "Kedamaian dimulai dari senyuman.",
    "Kebahagiaan bukan kebetulan, tapi pilihan.",
    "Setiap hari adalah awal yang baru.",
    "Kamu lebih kuat dari yang kamu kira.",
  ],
  vi: [
    "Mỗi khoảnh khắc đều xứng đáng được trân trọng.",
    "Bạn đã đủ tốt, đúng như bạn vốn có.",
    "Những vì sao sáng nhất trong đêm tối nhất.",
    "Câu chuyện của bạn vẫn đang được viết tiếp.",
    "Hít thở sâu. Mọi thứ đang diễn ra như nó nên thế.",
    "Bạn không đơn độc trên hành trình này.",
    "Những bước nhỏ dẫn đến thay đổi lớn.",
    "Hôm nay là một món quà — hãy trân trọng.",
    "Lòng tốt là ngôn ngữ phổ quát.",
    "Thời điểm tốt nhất để bắt đầu là bây giờ.",
    "Nụ cười của bạn có thể thay đổi thế giới.",
    "Bình yên bắt đầu từ nụ cười.",
    "Hạnh phúc không phải ngẫu nhiên, mà là lựa chọn.",
    "Mỗi ngày là một khởi đầu mới.",
    "Bạn mạnh mẽ hơn bạn nghĩ.",
  ],
};

export function getRandomAffirmation(lang: Lang, personaId: string): string {
  const list = affirmations[lang] || affirmations['en'];
  const index = personaId ? personaId.charCodeAt(0) % list.length : Math.floor(Math.random() * list.length);
  return list[index];
}

export default affirmations;