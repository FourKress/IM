import { renderProcess } from '@lanshu/render-process';
import { stareInstance, removeToken } from '@lanshu/utils';
import {
  IMSDKConvProvider,
  IMSDKMainProvide,
  IMSDKMessageProvider,
  IMSDKUserProvider,
} from './provide';

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
    removeToken();
    renderProcess.showLoginWindow(500);
    window.location.reload();
  });
};
