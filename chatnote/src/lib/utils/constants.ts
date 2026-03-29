export const PLAN_LIMITS = {
  free: {
    dailyChats: 20,
    maxSubjects: 3,
    maxUnitsPerSubject: 10,
    maxChatsPerUnit: 20,
  },
  premium: {
    dailyChats: 100,
    maxSubjects: Infinity,
    maxUnitsPerSubject: Infinity,
    maxChatsPerUnit: Infinity,
  },
} as const;

export const AI_MODEL = 'gemini-2.0-flash';
