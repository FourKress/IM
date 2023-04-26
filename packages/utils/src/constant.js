export * from './micro';

export const checkMsgType = {
  isText: 'text',
  isImage: 'image',
  isVideo: 'video',
  isAudio: 'audio',
  isFile: 'application',
  isPosition: 'position',
  isCustom: 'custom',
  isSendFile: 'File',
  isSendBusinessCard: 'BusinessCard',
  isCreateGroup: 'createGroup',
  isTRTC: 'TRTC',
};

const formatMsgType = (val, isBaseType = true) => {
  return isBaseType ? `[${val}]` : val;
};

export const baseMsgTypes = [1, 2, 3, 4, 5, 6, 100, 200];

export const msgFormatMap = {
  1: {
    label: () => formatMsgType('文本'),
    type: checkMsgType.isText,
  },
  2: {
    label: () => formatMsgType('图片'),
    type: checkMsgType.isImage,
  },
  3: {
    label: () => formatMsgType('文件'),
    type: checkMsgType.isFile,
  },
  4: {
    label: () => formatMsgType('视频'),
    type: checkMsgType.isVideo,
  },
  5: {
    label: () => formatMsgType('语音'),
    type: checkMsgType.isAudio,
  },
  6: {
    label: () => formatMsgType('位置'),
    type: checkMsgType.isPosition,
  },
  400: {
    label: (data) => {
      const { members } = data;
      return formatMsgType(
        `你邀请${members.map((d) => d.nickname).join('、')}加入了群聊`,
        false,
      );
    },
    type: checkMsgType.isCreateGroup,
  },
  100: {
    label: () => formatMsgType('视频'),
    type: checkMsgType.isTRTC,
  },
  200: {
    label: () => formatMsgType('语音'),
    type: checkMsgType.isTRTC,
  },
};

export const groupMemberTypeMap = {
  0: '非群成员',
  1: '群成员',
  2: '管理员',
  3: '群主',
};

const ctrlCharacter = 'Ctrl';

export const isMacPlatform = /macintosh|mac os x/i.test(navigator.userAgent);

export const keyCode = {
  isEnter: 'Enter',
  isCtrlEnter: `${ctrlCharacter}+Enter`,
  viewCharacter: isMacPlatform ? '⌘' : ctrlCharacter,
  realCharacter: ctrlCharacter,
};

export const IMHeaderMoreBtnKey = {
  isOpenSet: 'OpenSettings',
  isCreateGroup: 'CreateGroup',
  isOpenGroupSet: 'OpenGroupSet',
  isOpenGroupMember: 'OpenGroupMember',
};

export const IMGroupMemberPanelType = {
  isCreate: 'Create',
  isAdd: 'Add',
  isDel: 'Del',
};

export const winActionType = {
  isMin: 'min',
  isMax: 'max',
  isClose: 'close',
};

export const windowType = {
  isMain: 'main',
  isTrtc: 'trtc',
};

export const groupRoleType = {
  isOwner: 3,
  isManage: 2,
};

// 普通用户为0，群为15，机器人9
export const sessionUserType = {
  isBasic: 0,
  isGroup: 15,
  isBot: 9,
};

export const clientType = {
  isPc: 'isPc',
  isMobile: 'isMobile',
};

export const networkCallType = {
  isAudio: 1,
  isVideo: 2,
};

// type – 回调类型：0、超时未接听，1、对方已接听，此时data中有对方传过来的数据（rtc地址等自定义消息）, 2 对方已拒绝
export const networkCallbackType = {
  isTimeout: 0,
  isAnswered: 1,
  isReject: 2,
};

export const addFriendType = {
  isSearch: 1,
  isSean: 2,
  isShared: 3,
};

export const FRIEND_AUTH_STATE = {
  AWAIT: 1,
  AGREE: 2,
  EXPIRE: 7,
};
