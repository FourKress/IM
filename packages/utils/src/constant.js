export * from './micro';

export const GROUP_MEMBER_TYPE_MAP = {
  0: '非群成员',
  1: '群成员',
  2: '管理员',
  3: '群主',
};

const CTRL_CHARACTER = 'Ctrl';

export const IS_MAC_PLATFORM = /macintosh|mac os x/i.test(navigator.userAgent);

export const KEY_CODE = {
  IS_ENTER: 'Enter',
  IS_CTRL_ENTER: `${CTRL_CHARACTER}+Enter`,
  VIEW_CHARACTER: IS_MAC_PLATFORM ? '⌘' : CTRL_CHARACTER,
  REAL_CHARACTER: CTRL_CHARACTER,
};

export const IM_HEADER_MORE_BTN_KEY = {
  IS_OPEN_SET: 'OpenSettings',
  IS_CREATE_GROUP: 'CreateGroup',
  IS_OPEN_GROUP_SET: 'OpenGroupSet',
  IS_OPEN_GROUP_MEMBER: 'OpenGroupMember',
};

export const IM_NETWORK_STATUS = {
  IS_CONNECT: 1,
  IS_CONNECTING: 0,
  IS_BREAK: -1,
};

export const IM_GROUP_MEMBER_PANEL_TYPE = {
  IS_CREATE: 'Create',
  IS_ADD: 'Add',
  IS_DEL: 'Del',
  IS_ADD_ADMIN: 'Add_Admin',
  IS_DEL_ADMIN: 'Del_Admin',
  IS_SYNERGY: 'Synergy',
};

export const WIN_ACTION_TYPE = {
  IS_MIN: 'min',
  IS_MAX: 'max',
  IS_CLOSE: 'close',
  IS_SHOW: 'show',
  IS_HIDE: 'hide',
};

export const WINDOW_TYPE = {
  IS_MAIN: 1,
  IS_TRTC: 2,
};

export const GROUP_ROLE_TYPE_LOCAL = {
  IS_DEFAULT: -99,
  IS_NOT_AUTH: -1,
};
export const GROUP_ROLE_TYPE = {
  IS_OWNER: 3,
  IS_MANAGE: 2,
};

// 普通用户为0，群为15，机器人9
export const SESSION_USER_TYPE = {
  IS_BASIC: 0,
  IS_GROUP: 15,
  IS_BOT: 9,
};

export const CLIENT_TYPE = {
  IS_PC: 1,
  IS_MOBILE: 2,
};

export const NETWORK_CALL_TYPE = {
  IS_AUDIO: 1,
  IS_VIDEO: 2,
};

// type – 回调类型：0、超时未接听，1、对方已接听，此时data中有对方传过来的数据（rtc地址等自定义消息）, 2 对方已拒绝
export const NETWORK_CALLBACK_TYPE = {
  IS_TIMEOUT: 0,
  IS_ANSWERED: 1,
  IS_REJECT: 2,
};

export const ADD_FRIEND_TYPE = {
  IS_SEARCH: 1,
  IS_SEAN: 2,
  IS_SHARED: 3,
};

export const FRIEND_AUTH_STATE = {
  IS_AWAIT: 1,
  IS_AGREE: 2,
  IS_EXPIRE: 7,
};

export const SESSION_BUBBLE_MODEL = {
  IS_LEFT: 1,
  IS_BETWEEN: 2,
};

export const CLIENT_TERMINAL = {
  IS_PERSONAL: 'personal',
  IS_ENTERPRISE: 'enterprise',
  IS_GOVERNMENT: 'government',
};

export const TOKEN_TYPE = {
  IS_IM: 'IM_TOKEN',
  IS_SYS: 'SYS_TOKEN',
};

export const SEX_TYPE = {
  IS_MAN: 1,
  IS_WOMAN: 2,
  IS_UNKNOWN: 3,
};

export const SCENE_TYPE = {
  IS_LOGIN: 'login',
  IS_SET_PWD: 'setPassword',
  IS_UPDATE_PHONE: 'updatePhone',
};

export const REST_STORE_STATE = 'REST_STORE_STATE';

export const PLACEHOLDER_CONFIG = {
  CUSTOM_PROTOCOL: 'web ',
  FILE_NAME_SEPARATOR: '_file_',
  RAW_NAME_SEPARATOR: '_rawname_',
  MSG_TAG_SEPARATOR: '#_&_#',
  LINK_SEPARATOR: 'LINK',
  AT_SEPARATOR: 'AT',
  IMAGE_BR: 'IMAGE_BR',
};

export const IS_NEVER = 'NEVER';

export const BASE_PLUGIN_TYPE = {
  PLUGIN_APP_NAV: 'PluginAppNav',
};

export const USER_ERROR_MSG_TYPE = {
  DIALOG: 'dialog',
  TIPS: 'tips',
};
