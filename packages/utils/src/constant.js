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

export const baseMsgTypes = [1, 2, 3, 4, 5, 6, 100];

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
};

export const groupMemberTypeMap = {
  0: '非群成员',
  1: '群成员',
  2: '管理员',
  3: '群主',
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
