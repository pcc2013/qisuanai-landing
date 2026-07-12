// D:\nira-app\src\data\timeMapping.ts

export type TimePeriod = 'morning' | 'day' | 'evening' | 'night';

const timePersonaMap: Record<TimePeriod, string[]> = {
  morning: ['business', 'sport'],
  day: ['casual', 'tutor'],
  evening: ['art', 'fashion'],
  night: ['eastern_philosophy', 'heal'],
};

export function getTimePeriod(timestamp?: number): string {
  const hour = timestamp ? new Date(timestamp).getHours() : new Date().getHours();
  
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'day';
  if (hour >= 18 && hour < 22) return 'evening';
  // 22:00-6:00
  return 'night';
}

export default timePersonaMap;