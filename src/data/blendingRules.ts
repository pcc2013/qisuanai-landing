// D:\nira-app\src\data\blendingRules.ts

import { TimePeriod } from './timeMapping';

const PERSONA_IDS = ['heal', 'casual', 'eastern_philosophy', 'business', 'sport', 'art', 'tutor', 'fashion'];

const FORBIDDEN_BLENDS: [string, string][] = [
  ['business', 'fashion'],
  ['sport', 'art'],
  ['tutor', 'fashion'],
  ['eastern_philosophy', 'fashion'],
];

export function calcPersonalityWeight(
  basePersona: string,
  timePeriod: TimePeriod,
  emotionTag: string | null
): Record<string, number> {
  if (!PERSONA_IDS.includes(basePersona)) {
    return { heal: 0.60 };
  }

  let mainWeight = 0.65;
  let subWeight = 0.20;
  const healWeight = 0.15;
  let subPersona: string | null = emotionTag;

  if (!subPersona) {
    const timePersonaMap: Record<TimePeriod, string[]> = {
      morning: ['business', 'sport'],
      day: ['casual', 'tutor'],
      evening: ['art', 'fashion'],
      night: ['eastern_philosophy', 'heal'],
    };
    const periodList = timePersonaMap[timePeriod] || ['casual', 'tutor'];
    const candidate = periodList[0] === basePersona
      ? (periodList[1] ?? periodList[0])
      : periodList[0];
    subPersona = candidate;
  }

  if (subPersona && subPersona !== basePersona) {
    const isForbidden = FORBIDDEN_BLENDS.some(
      ([a, b]) => (a === basePersona && b === subPersona) || (a === subPersona && b === basePersona)
    );
    if (isForbidden) subPersona = 'casual';
  }

  if (emotionTag && emotionTag !== basePersona) {
    mainWeight = 0.60;
    subWeight = 0.25;
  }

  const result: Record<string, number> = {
    [basePersona]: mainWeight,
    heal: healWeight,
  };

  if (subPersona && subPersona !== basePersona && subPersona !== 'heal') {
    result[subPersona] = subWeight;
  } else {
    result[basePersona] = mainWeight + subWeight;
  }

  const total = Object.values(result).reduce((sum, val) => sum + val, 0);
  if (total > 0 && Math.abs(total - 1) > 0.01) {
    Object.keys(result).forEach(key => {
      result[key] = parseFloat((result[key] / total).toFixed(2));
    });
  }

  return result;
}