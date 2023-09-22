import { MICRO_APP_PATH_MARK } from '@lanshu/micro';
export const mergePathMark = (key) => `${key}${MICRO_APP_PATH_MARK}`;
export const MICRO_CONTAINER = `Main${MICRO_APP_PATH_MARK}`;

export const MICRO_KEY_CONFIG = {
  SMART_ADVOCACY: 'SmartAdvocacyMicroApp',
};

export const MICRO_EVENT_IPC = {
  GET_USER_ID: 'GET_USER_ID',
  CREATE_TEXT_MSG: 'CREATE_TEXT_MSG',
  POSITION_INFO: 'POSITION_INFO',
  UPDATE_USER_ID: 'UPDATE_USER_ID',
  ROUTER_JUMP: 'ROUTER_JUMP',
};
