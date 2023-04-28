import { MICRO_APP_PATH_MARK } from '@lanshu/micro';

const mergePathMark = (key) => `${key}${MICRO_APP_PATH_MARK}`;

export const MICRO_CONTAINER = `Main${MICRO_APP_PATH_MARK}`;

export const MICRO_KEY_MAP = {
  IS_SYSTEM: mergePathMark('System'),
  IS_KNOWLEDGE_BASE: mergePathMark('KnowledgeBase'),
};
