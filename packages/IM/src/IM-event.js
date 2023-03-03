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
  },
};

export const IMSDKGroupProvider = {
  provider: 'getGroupProvider',
  events: {},
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
  AddReceiveNewMessage(msgInfo) {
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

export const IMSDK_Init = async (loginParams) => {
  const { userId } = loginParams;
  await renderProcess
    .IMSDKIPC(
      IMSDKMainProvide.provider,
      IMSDKMainProvide.events.login,
      loginParams,
    )
    .then((res) => {
      console.log('IM_Login Success', res);
    })
    .catch((err) => {
      console.log('IM_Login Error', err);
    });

  await renderProcess
    .IMSDKIPC(
      IMSDKUserProvider.provider,
      IMSDKUserProvider.events.getUserAttribute,
      userId,
    )
    .then((res) => {
      console.log('IM_User Success', res);
      stareInstance.commit('IMStore/setUserInfo', res.data);
    })
    .catch((err) => {
      console.log('IM_User Error', err);
    });

  await renderProcess
    .IMSDKIPC(
      IMSDKConvProvider.provider,
      IMSDKConvProvider.events.getConvList,
      userId,
    )
    .then((res) => {
      console.log('IM_Conv Success', res);
      if (res.data.length > 0) {
        stareInstance.commit('IMStore/setAllSession', res.data);
      }
    })
    .catch((err) => {
      console.log('IM_Conv Error', err);
    });

  await renderProcess
    .IMSDKIPC(
      IMSDKConvProvider.provider,
      IMSDKConvProvider.events.getTotalUnreadMessageCount,
    )
    .then((res) => {
      stareInstance.commit('IMStore/setAllUnreadCount', res.data);
    })
    .catch((err) => {
      console.log('IM_TotalUnread Error', err);
    });
};

export const IMGetMessageList = (sessId, nextMsgId) => {
  return renderProcess.IMSDKIPC(
    IMSDKMessageProvider.provider,
    IMSDKMessageProvider.events.getMessageList,
    sessId,
    nextMsgId,
  );
};

export const IMClearUnreadCount = async (sessId) => {
  await renderProcess
    .IMSDKIPC(
      IMSDKConvProvider.provider,
      IMSDKConvProvider.events.clearUnreadCount,
      sessId,
    )
    .then((res) => {
      console.log('IM_ClearUnreadCount Success', res);
      const sessionList = stareInstance.getters['IMStore/sessionList'];
      stareInstance.commit(
        'IMStore/setAllSession',
        sessionList.map((d) => {
          return {
            ...d,
            unreadCount: d.sessId === sessId ? 0 : d.unreadCount,
          };
        }),
      );
    })
    .catch((err) => {
      console.log('IM_ClearUnreadCount Error', err);
    });
};

export const IMLogout = async () => {
  await renderProcess.IMSDKIPC(
    IMSDKMainProvide.provider,
    IMSDKMainProvide.events.logout,
  );
};

export const ClientLogOut = async () => {
  await IMLogout();
  tokenUtils.removeToken();
  window.location.reload();
  renderProcess.showLoginWindow(500);
};
