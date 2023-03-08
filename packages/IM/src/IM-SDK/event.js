import { renderProcess } from '@lanshu/render-process';
import { stareInstance, removeToken } from '@lanshu/utils';
import {
  IMSDKConvProvider,
  IMSDKFileProvider,
  IMSDKGroupProvider,
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

const eventHOCFnc = async (...params) => {
  await handlePromiseResult(async () => {
    const res = renderProcess.IMSDKIPC(params);
    await handleIMSDKIPCResult(res);
  });
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

export const IMLogin = async (loginParams) =>
  await eventHOCFnc(
    IMSDKMainProvide.provider,
    IMSDKMainProvide.events.login,
    loginParams,
  );

export const IMGetUserAttribute = async (userId) => {
  const res = await eventHOCFnc(
    IMSDKUserProvider.provider,
    IMSDKUserProvider.events.getUserAttribute,
    userId,
  );
  stareInstance.commit('IMStore/setUserInfo', res.data);
  return res;
};
export const IMGetConvList = async (userId) => {
  const res = await eventHOCFnc(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.getConvList,
    userId,
  );
  if (res.data.length > 0) {
    stareInstance.commit('IMStore/setAllSession', res.data);
  }
  return res;
};
export const IMGetTotalUnreadMessageCount = async () => {
  const res = await eventHOCFnc(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.getTotalUnreadMessageCount,
  );
  stareInstance.commit('IMStore/setAllUnreadCount', res.data);
  return res;
};

export const IMLogout = async () =>
  await eventHOCFnc(IMSDKMainProvide.provider, IMSDKMainProvide.events.logout);

export const ClientLogOut = async () => {
  await handlePromiseResult(async () => {
    await IMLogout();
    removeToken();
    renderProcess.showLoginWindow(500);
    window.location.reload();
  });
};
export const IMClearUnreadCount = async (sessId, sessionWindowList) => {
  const res = await eventHOCFnc(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.clearUnreadCount,
    sessId,
  );
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
  return res;
};
export const IMGetMessageList = async (sessId, nextMsgId) =>
  await eventHOCFnc(
    IMSDKMessageProvider.provider,
    IMSDKMessageProvider.events.getMessageList,
    sessId,
    nextMsgId,
  );
export const IMSetTopStatus = async (sessId, top) =>
  await eventHOCFnc(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.setTopBySessId,
    sessId,
    top,
  );
export const IMClearMessage = async (sessId) =>
  await eventHOCFnc(
    IMSDKMessageProvider.provider,
    IMSDKMessageProvider.events.clearMessage,
    sessId,
  );
export const IMGetGroupMemberList = async (groupId, nextSeq) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.getGroupMemberList,
    groupId,
    nextSeq,
  );
export const IMCreateGroup = async (groupName, avatar, groupAddType, members) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.createGroup,
    groupName,
    avatar,
    groupAddType,
    members,
  );

export const IMCreateMsg = async (msgEvent, msgData) =>
  await eventHOCFnc(
    IMSDKMessageProvider.provider,
    IMSDKMessageProvider.events[msgEvent],
    ...msgData,
  );
export const IMSendMessage = async (msg) =>
  await eventHOCFnc(
    IMSDKMessageProvider.provider,
    IMSDKMessageProvider.events.sendMessage,
    msg,
  );
export const IMUploadFile = async (file) =>
  await eventHOCFnc(
    IMSDKFileProvider.provider,
    IMSDKFileProvider.events.uploadFile,
    file,
  );
