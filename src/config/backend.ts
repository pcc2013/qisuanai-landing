// D:\nira-app\src\config\backend.ts

export const BACKEND_CONFIG = {
  ONLINE: false,
  BASE_URL: 'https://api.qisuanai.com',
  WS_URL: 'wss://signal.qisuanai.com',
  HEALTH_CHECK_URL: '/api/v1/health',

  // 全球统一汇率
  QS_PER_USD: 100,

  // 新用户试用期
  TRIAL: {
    DURATION_DAYS: 3,
    DAILY_FREE_TEXT: 30,
    DAILY_FREE_VOICE_MINUTES: 3,
    FREE_SCENES: 5,
    FREE_PERSONAS: 1,
    MEMORY_HOURS: 72,
  },

  // 消费型服务定价 (QS)
  PRICING: {
    TEXT_CHAT_PER_MSG: 1,
    VOICE_CALL_PER_MIN: 5,
    DIGITAL_HUMAN_VIDEO_PER_MIN: 20,
  },

  // 内容解锁定价 (QS)
  UNLOCK_PRICING: {
    PERSONA: 500,
    IMAGE: 200,
    SCENE: 100,
  },

  // 离线模式开关
  OFFLINE_MODE: {
    chatEnabled: true,
    voiceEnabled: true,
    qsLocalMock: true,
    seedLocalMock: true,
    videoEnabled: false,
    digitalHumanEnabled: false,
    exclusiveAvatarEnabled: false,
  },
};