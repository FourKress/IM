import { renderProcess } from '@lanshu/render-process';
import { tokenUtils } from '@lanshu/utils';

import { stareInstance } from '@lanshu/utils';

export const IMSDKMainProvide = {
  provider: 'getMainProvider',
  events: {
    login: 'login',
    logout: 'logout',
  },
};

export const IMSDKUserProvider = {
  provider: 'getUserProvider',
  events: {
    getUserAttribute: 'getUserAttrbute',
  },
};

export const IMSDKConvProvider = {
  provider: 'getConvProvider',
  events: {
    getConvList: 'getConvList',
    getTotalUnreadMessageCount: 'getTotalUnreadMessageCount',
    clearUnreadCount: 'clearUnreadCount',
    getByUserId: 'getByUserId',
    getBySessId: 'getBySessId',
    setTopBySessId: 'setTopBySessId',
  },
};

export const IMSDKMessageProvider = {
  provider: 'getMessageProvider',
  events: {
    getMessageList: 'getMessageList',
    sendMessage: 'sendMessage',
    createTextMessage: 'createTextMessage',
    createImgMessage: 'createImgMessage',
    createVideoMessage: 'createVideoMessage',
    createVoiceMessage: 'createVoiceMessage',
    createFileMessage: 'createFileMessage',
    createCustomMessage: 'createCustomMessage',
    clearMessage: 'clearMessage',
  },
};

export const IMSDKGroupProvider = {
  provider: 'getGroupProvider',
  events: {
    createGroup: 'createGroup',
    getGroupMemberList: 'getGroupMemberList',
  },
};

export const IMSDKFileProvider = {
  provider: 'getFileProvider',
  events: {
    uploadFile: 'uploadFile',
  },
};

export const IMSDKCallBackEvents = {
  Network: (state) => {
    console.log('@@@@@ Network');
    stareInstance.commit('IMStore/setIMNetworkStatus', state);
  },
  DataSync: (state) => {
    console.log('@@@@@ DataSync');
    stareInstance.commit('IMStore/setIMDataSyncStatus', state);
  },
  UpdateConvList: (convList) => {
    console.log('@@@@@ UpdateConvList');
    stareInstance.commit('IMStore/setAllSession', convList);
  },
  ConvTotalUnreadMessageCount: (AllUnreadCount) => {
    console.log('@@@@@ ConvTotalUnreadMessageCount');
    stareInstance.commit('IMStore/setAllUnreadCount', AllUnreadCount);
  },
  AddReceiveNewMessage: async (msgInfo) => {
    const { message, silence } = msgInfo;

    const NOTIFICATION_TITLE = '客户端通知';
    const NOTIFICATION_BODY = message?.data?.content;
    const CLICK_MESSAGE = message;
    new Notification(NOTIFICATION_TITLE, {
      body: NOTIFICATION_BODY,
    }).onclick = () => {
      console.log(CLICK_MESSAGE);
    };

    console.log('@@@@@ AddReceiveNewMessage');
    stareInstance.commit('IMStore/setCurrentMsg', message);

    const mainSessionWindow =
      stareInstance.getters['IMStore/mainSessionWindow'];
    const sessionWindowList =
      stareInstance.getters['IMStore/sessionWindowList'];

    if (!mainSessionWindow?.sessId && !sessionWindowList?.length) return;

    await IMClearUnreadCount(message.sessId, [
      mainSessionWindow,
      ...sessionWindowList,
    ]);
  },
  KickOutedOffline() {
    console.log('@@@@@ KickOutedOffline');
    // TODO
    stareInstance.commit('IMStore/setAllSession');
  },
  LogOutCallBack(info) {
    console.info('日志', info);
  },
};

const handlePromiseResult = async (fnc) => {
  try {
    await fnc();
  } catch (e) {
    console.log(e);
    window.ClientMessage.error(e.message);
    return Promise.reject(e);
  }
};
const handleIMSDKIPCResult = async (res) => {
  const { code } = res;
  if (code !== 0) return Promise.reject(res);
  return Promise.resolve(res);
};

export const IMSDK_Init = async (loginParams) => {
  const { userId } = loginParams;
  await handlePromiseResult(async () => {
    await IMLogin(loginParams);
    await IMGetUserAttribute(userId);
    await IMGetConvList(userId);
    await IMGetTotalUnreadMessageCount();
  });
};

export const IMLogin = async (loginParams) => {
  const res = await renderProcess.IMSDKIPC(
    IMSDKMainProvide.provider,
    IMSDKMainProvide.events.login,
    loginParams,
  );
  console.log('IM_Login Result', res);
  await handleIMSDKIPCResult(res);
};
export const IMGetUserAttribute = async (userId) => {
  const res = await renderProcess.IMSDKIPC(
    IMSDKUserProvider.provider,
    IMSDKUserProvider.events.getUserAttribute,
    userId,
  );
  await handleIMSDKIPCResult(res);
  stareInstance.commit('IMStore/setUserInfo', res.data);
};
export const IMGetConvList = async (userId) => {
  const res = await renderProcess.IMSDKIPC(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.getConvList,
    userId,
  );
  await handleIMSDKIPCResult(res);
  if (res.data.length > 0) {
    stareInstance.commit('IMStore/setAllSession', res.data);
  }
};
export const IMGetTotalUnreadMessageCount = async () => {
  const res = await renderProcess.IMSDKIPC(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.getTotalUnreadMessageCount,
  );
  await handleIMSDKIPCResult(res);
  stareInstance.commit('IMStore/setAllUnreadCount', res.data);
};

export const IMGetMessageList = async (sessId, nextMsgId) => {
  const res = await renderProcess.IMSDKIPC(
    IMSDKMessageProvider.provider,
    IMSDKMessageProvider.events.getMessageList,
    sessId,
    nextMsgId,
  );
  await handleIMSDKIPCResult(res);
};

export const IMClearUnreadCount = async (sessId, sessionWindowList) => {
  const res = await renderProcess.IMSDKIPC(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.clearUnreadCount,
    sessId,
  );
  await handleIMSDKIPCResult(res);
  console.log('IM_ClearUnreadCount Success', res);
  const sessionList = stareInstance.getters['IMStore/sessionList'];
  stareInstance.commit(
    'IMStore/setAllSession',
    sessionList.map((d) => {
      let unreadCount;
      if (sessionWindowList?.length) {
        unreadCount = sessionWindowList.some((s) => s.sessId === sessId)
          ? 0
          : d.unreadCount;
      } else {
        unreadCount = d.sessId === sessId ? 0 : d.unreadCount;
      }

      return {
        ...d,
        unreadCount,
      };
    }),
  );
};

export const IMSetTopStatus = async (sessId, top) => {
  const res = await renderProcess.IMSDKIPC(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.setTopBySessId,
    sessId,
    top,
  );
  await handleIMSDKIPCResult(res);
};

export const IMLogout = async () => {
  const res = await renderProcess.IMSDKIPC(
    IMSDKMainProvide.provider,
    IMSDKMainProvide.events.logout,
  );
  await handleIMSDKIPCResult(res);
};

export const ClientLogOut = async () => {
  await handlePromiseResult(async () => {
    await IMLogout();
    tokenUtils.removeToken();
    renderProcess.showLoginWindow(500);
    window.location.reload();
  });
};
