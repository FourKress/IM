import { renderProcess } from '@lanshu/render-process';
import { stareInstance, removeToken } from '@lanshu/utils';
import {
  IMSDKConvProvider,
  IMSDKFileProvider,
  IMSDKFriendProvider,
  IMSDKGroupProvider,
  IMSDKMainProvide,
  IMSDKMessageProvider,
  IMSDKNetworkPhoneProvider,
  IMSDKUserProvider,
} from './provide';

const handlePromiseResult = async (fnc) => {
  try {
    const res = await fnc();
    return res;
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

const eventHOCFnc = async (...params) =>
  await handlePromiseResult(async () => {
    const res = await renderProcess.IMSDKIPC(...params);
    return await handleIMSDKIPCResult(res);
  });

export const IMSDK_Init = async (loginParams) => {
  const { userId } = loginParams;
  await IMLogin(loginParams);
  const res = await IMGetUserAttribute(userId);
  stareInstance.commit('IMStore/setUserInfo', res.data);
  renderProcess.setStore('trtcUserInfo', res.data);
  await IMGetUserProfile(userId);
  await IMGetConvList(userId);
  await IMGetTotalUnreadMessageCount();
  await IMGetFriendRequestNoticeUnreadCount();
};

export const IMLogin = async (loginParams) =>
  await eventHOCFnc(
    IMSDKMainProvide.provider,
    IMSDKMainProvide.events.login,
    loginParams,
  );

export const IMGetUserAttribute = async (userId) =>
  await eventHOCFnc(
    IMSDKUserProvider.provider,
    IMSDKUserProvider.events.getUserAttribute,
    userId,
  );

export const IMGetUserProfile = async (userId) => {
  const res = await eventHOCFnc(
    IMSDKUserProvider.provider,
    IMSDKUserProvider.events.getUserProfile,
    userId,
  );
  stareInstance.commit('IMStore/setUserProfile', res.data);
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
  await IMLogout();
  removeToken();
  renderProcess.showLoginWindow(1000);
  window.location.reload();
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
export const IMGetGroupMemberList = async (groupId, nextSeq) => {
  return new Promise(async (resolve, reject) => {
    let _nextSeq = nextSeq;
    const totalMembers = [];
    while (_nextSeq !== -1) {
      try {
        const res = await eventHOCFnc(
          IMSDKGroupProvider.provider,
          IMSDKGroupProvider.events.getGroupMemberList,
          groupId,
          nextSeq,
        );
        const { nextSeq: currentNextSeq, members = [] } = res.data;
        totalMembers.push(...members);
        _nextSeq = currentNextSeq;
      } catch (e) {
        reject(e);
      }
    }
    resolve({
      members: totalMembers,
      nextSeq: _nextSeq,
    });
  });
};

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
  await renderProcess.IMSDKIPC(
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
export const IMUploadFile = async (filePath) =>
  await eventHOCFnc(
    IMSDKFileProvider.provider,
    IMSDKFileProvider.events.uploadFile,
    filePath,
  );

export const IMGetByUserId = async (userId) =>
  await eventHOCFnc(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.getByUserId,
    userId,
  );

export const IMInviteMember = async (groupId, members) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.inviteMember,
    groupId,
    members,
  );

export const IMSetUserProfile = async (
  description,
  sex,
  birthday,
  location,
  phone,
) => {
  await eventHOCFnc(
    IMSDKUserProvider.provider,
    IMSDKUserProvider.events.setUserProfile,
    description,
    sex,
    birthday,
    location,
    phone,
  );
  const userProfile = stareInstance.getters['IMStore/userProfile'];
  await IMGetUserProfile(userProfile.userId);
};

export const IMSearchUserProfileOfPhone = async (phone) =>
  await eventHOCFnc(
    IMSDKUserProvider.provider,
    IMSDKUserProvider.events.searchUserProfileOfPhone,
    phone,
  );

export const IMStartNetworkCall = async (toUserId, toUserType, type, data) =>
  await renderProcess.IMSDKNetworkCall(
    IMSDKNetworkPhoneProvider.events.startNetworkCall,
    toUserId,
    toUserType,
    type,
    data,
  );

export const IMStopNetworkCall = async (
  uuid,
  type,
  toUserId,
  toUserType,
  time,
) =>
  await renderProcess.IMSDKNetworkCall(
    IMSDKNetworkPhoneProvider.events.stopNetworkCall,
    uuid,
    type,
    toUserId,
    toUserType,
    time,
  );

export const IMAnswerNetworkCall = async (uuid, type, userId, userType) =>
  await renderProcess.IMSDKNetworkCall(
    IMSDKNetworkPhoneProvider.events.stopNetworkCall,
    uuid,
    type,
    userId,
    userType,
  );

export const IMGetAllFriendList = async () =>
  await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.getAllFriendList,
  );

export const IMGetOneFriend = async (toUser) =>
  await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.getOneFriend,
    toUser,
  );

export const IMFriendAddRequest = async (
  toUser,
  remark,
  desc,
  message,
  origin,
) =>
  await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.friendAddRequest,
    toUser,
    remark,
    desc,
    message,
    origin,
  );

export const IMQueryFriendRequestNotice = async (nextSeq) =>
  await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.queryFriendRequestNotice,
    nextSeq,
  );

export const IMGetFriendRequestNoticeUnreadCount = async () => {
  const res = await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.getFriendRequestNoticeUnreadCount,
  );
  stareInstance.commit('IMStore/setNewFriendCount', Number(res?.data || 0));
};

export const IMAgreeFriendAddRequest = async (noticeId, remark, desc) =>
  await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.agreeFriendAddRequest,
    noticeId,
    remark,
    desc,
  );

export const IMClearFriendRequestNoticeUnreadCount = async (
  noticeId,
  remark,
  desc,
) =>
  await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.clearFriendRequestNoticeUnreadCount,
    noticeId,
    remark,
    desc,
  );

export const IMDelFriendOneWay = async (toUser) =>
  await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.delFriendOneWay,
    toUser,
  );
