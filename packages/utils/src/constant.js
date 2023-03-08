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
};

export const msgTypeMap = {
  1: {
    label: '文本',
    type: checkMsgType.isText,
  },
  2: {
    label: '图片',
    type: checkMsgType.isImage,
  },
  3: {
    label: '文件',
    type: checkMsgType.isFile,
  },
  4: {
    label: '视频',
    type: checkMsgType.isVideo,
  },
  5: {
    label: '语音',
    type: checkMsgType.isAudio,
  },
  6: {
    label: '位置',
    type: checkMsgType.isPosition,
  },
};

const ctrlCharacter = 'Ctrl';

export const keyCode = {
  isEnter: 'Enter',
  isCtrlEnter: `${ctrlCharacter}+Enter`,
  viewCharacter: '⌘',
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
