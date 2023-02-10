const checkMsgType = {
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

const msgTypeMap = {
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

const ctrlCharacter = 'CommandOrControl';

const keyCode = {
  isEnter: 'Enter',
  isCtrlEnter: `${ctrlCharacter}+Enter`,
  viewCharacter: '⌘',
  realCharacter: ctrlCharacter,
};

export { msgTypeMap, checkMsgType, keyCode };
