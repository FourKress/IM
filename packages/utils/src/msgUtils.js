import { formatAtTag, getAtTagList } from './atUtils';
import { storeInstance } from './store';
import { CLIENT_TYPE, NETWORK_CALL_TYPE } from './constant';
import { renderProcess } from '@lanshu/render-process';

export const CHECK_MSG_TYPE = {
  IS_TEXT: 'text',
  IS_IMAGE: 'image',
  IS_VIDEO: 'video',
  IS_AUDIO: 'audio',
  IS_FILE: 'application',
  IS_POSITION: 'position',
  IS_CUSTOM: 'custom',
  IS_SEND_FILE: 'File',
  IS_SEND_BUSINESS_CARD: 'businessCard',
  IS_TRTC: 'TRTC',
  IS_SYSTEM_NOTIFY: 'systemNotify',
  IS_AT: 'at',
  IS_REVOKE: 'revoke',
  IS_CARD: 'card',
};

const formatMsgType = (val, isBaseType = true) => {
  return isBaseType ? `[${val}]` : val;
};

const getNetworkCallLabel = (data) => {
  const { type } = data;
  return formatMsgType(
    `${type === NETWORK_CALL_TYPE.IS_VIDEO ? '视频' : '语音'}通话`,
  );
};

export const BASE_MSG_TYPES = [-1, 1, 2, 3, 4, 5, 6, 8, 9, 671, 672, 673, 674];

export const MSG_FORMAT_MAP = {
  '-1': {
    label: (data) => {
      return formatMsgType(data?.content);
    },
    type: CHECK_MSG_TYPE.IS_REVOKE,
  },
  1: {
    label: (data) => {
      return data?.content;
    },
    type: CHECK_MSG_TYPE.IS_TEXT,
  },
  2: {
    label: () => formatMsgType('图片'),
    type: CHECK_MSG_TYPE.IS_IMAGE,
  },
  3: {
    label: () => formatMsgType('文件'),
    type: CHECK_MSG_TYPE.IS_FILE,
  },
  4: {
    label: () => formatMsgType('视频'),
    type: CHECK_MSG_TYPE.IS_VIDEO,
  },
  5: {
    label: () => formatMsgType('语音'),
    type: CHECK_MSG_TYPE.IS_AUDIO,
  },
  6: {
    label: () => formatMsgType('位置'),
    type: CHECK_MSG_TYPE.IS_POSITION,
  },
  8: {
    label: (data) => {
      const msg = data?.content;
      if (!msg) return msg;
      const atTagList = getAtTagList(msg);
      return formatAtTag(
        {
          data: {
            content: msg,
          },
        },
        atTagList,
        true,
      );
    },
    type: CHECK_MSG_TYPE.IS_AT,
  },
  9: {
    label: () => formatMsgType('消息卡片'),
    type: CHECK_MSG_TYPE.IS_CARD,
  },
  400: {
    label: (data) => {
      const { members, inviterUserId, inviterNickname } = data;
      const userInfo = storeInstance.getters['IMStore/userInfo'];
      return formatMsgType(
        `${
          userInfo.userId === inviterUserId ? '你' : inviterNickname
        } 邀请 ${members.map((d) => d.nickname).join('、')} 加入了群聊`,
        false,
      );
    },
    type: CHECK_MSG_TYPE.IS_SYSTEM_NOTIFY,
  },
  671: {
    label: (data) => getNetworkCallLabel(data),
    type: CHECK_MSG_TYPE.IS_TRTC,
  },
  672: {
    label: (data) => getNetworkCallLabel(data),
    type: CHECK_MSG_TYPE.IS_TRTC,
  },
  673: {
    label: (data) => getNetworkCallLabel(data),
    type: CHECK_MSG_TYPE.IS_TRTC,
  },
  674: {
    label: (data) => getNetworkCallLabel(data),
    type: CHECK_MSG_TYPE.IS_TRTC,
  },
  1000: {
    label: (data) => data.content,
    type: CHECK_MSG_TYPE.IS_SYSTEM_NOTIFY,
  },
};

export const startTrtc = async (session, NETWORK_CALL_TYPE) => {
  const hasWindow = await renderProcess.hasWindow('TRTCWindow');
  if (hasWindow) {
    window.ClientMessage.warning('请先结束当前通话');
    return;
  }

  const platform = CLIENT_TYPE.IS_MOBILE;
  await renderProcess.setStore('TRTC_SESSION', session);
  await renderProcess.setStore('TRTC_CALL_INFO', {
    type: NETWORK_CALL_TYPE,
    roomId: Number(Date.now().toString().substring(4, 13)),
    isBeInvited: false,
    platform,
  });

  renderProcess.openTRTCWindow(platform);
};
