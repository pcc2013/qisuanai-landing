// D:\nira-app\src\data\voices.ts

const buildVoicePath = (fileName: string): string =>
  `/assets/voices/preset/${fileName}.wav`;

const fiveLang = (base: string): Record<string, string> => ({
  zh: buildVoicePath(`${base}_zh`),
  en: buildVoicePath(`${base}_en`),
  'zh-TW': buildVoicePath(`${base}_zh-TW`),
  id: buildVoicePath(`${base}_id`),
  vi: buildVoicePath(`${base}_vi`),
});

const noLangDefault = (base: string): Record<string, string> => ({
  ...fiveLang(base),
  default: buildVoicePath(base),
});

export const personaVoiceMap: Record<string, Record<string, string>> = {
  // heal — 3 roles
  heal_female_anwen: fiveLang('heal_female_anwen'),
  heal_male_wenyan: fiveLang('heal_male_wenyan'),
  heal_nb_jingyu: fiveLang('heal_nb_jingyu'),

  // casual — 2 roles
  casual_female_xiao_c: fiveLang('casual_female_xiao_c'),
  casual_male_aluo: fiveLang('casual_male_aluo'),

  // eastern_philosophy — 2 roles
  eastern_philosophy_male_taibai: fiveLang('eastern_philosophy_male_taibai'),
  eastern_philosophy_female_baizhi: fiveLang('eastern_philosophy_female_baizhi'),

  // business — 2 roles
  business_male_elena: fiveLang('business_male_elena'),
  business_nb_elena: fiveLang('business_nb_elena'),

  // sport — 3 roles
  sport_male_kai: fiveLang('sport_male_kai'),
  sport_female_kai: fiveLang('sport_female_kai'),
  sport_nb_ryo: fiveLang('sport_nb_ryo'),

  // art — 4 roles
  art_female_muse: fiveLang('art_female_muse'),
  art_female_muse_black: fiveLang('art_female_muse_black'),
  art_male_leon: fiveLang('art_male_leon'),
  art_male_leon_yellow: fiveLang('art_male_leon_yellow'),

  // tutor — 3 roles
  tutor_male_prof_lee: fiveLang('tutor_male_prof_lee'),
  tutor_female_prof_lin: fiveLang('tutor_female_prof_lin'),
  tutor_nb_prof_chen: fiveLang('tutor_nb_prof_chen'),

  // fashion — 3 roles
  fashion_female_z: fiveLang('fashion_female_z'),
  fashion_male_jax: fiveLang('fashion_male_jax'),
  fashion_nb_rei: fiveLang('fashion_nb_rei'),
};

export function getVoicePath(roleKey: string, lang: string): string {
  const voiceMap = personaVoiceMap[roleKey];
  if (!voiceMap) return '';
  return voiceMap[lang] || voiceMap['en'] || '';
}