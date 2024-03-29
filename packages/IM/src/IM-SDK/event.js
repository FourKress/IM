import { renderProcess } from '@lanshu/render-process';
import {
  storeInstance,
  routeInstance,
  removeToken,
  Apis,
  removeAllDialogDom,
  TOKEN_TYPE,
  REST_STORE_STATE,
} from '@lanshu/utils';
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
    if (e && typeof e === 'string' && !e?.includes('reply was never sent')) {
      window.ClientMessage.error(e.message);
    }
    return Promise.reject(e);
  }
};
const handleIMSDKIPCResult = async (res) => {
  const { code } = res;
  if (![0, 112113, 120, 112].includes(code)) return Promise.reject(res);
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
  const userAttribute = await IMGetUserAttribute(userId);
  storeInstance.commit('IMStore/setUserInfo', userAttribute.data);
  renderProcess.setStore('TRTC_USER_INFO', userAttribute.data);
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

export const IMGetUserProfile = async (userId) =>
  await eventHOCFnc(
    IMSDKUserProvider.provider,
    IMSDKUserProvider.events.getUserProfile,
    userId,
  );

export const IMGetConvList = async (userId) => {
  const res = await eventHOCFnc(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.getConvList,
    userId,
  );
  if (res.data.length > 0) {
    storeInstance.commit('IMStore/setAllSession', res.data);
  }
  return res;
};
export const IMGetTotalUnreadMessageCount = async () => {
  const res = await eventHOCFnc(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.getTotalUnreadMessageCount,
  );
  storeInstance.commit('IMStore/setAllUnreadCount', res.data);
  return res;
};

export const IMLogout = async () =>
  await eventHOCFnc(IMSDKMainProvide.provider, IMSDKMainProvide.events.logout);

export const ClientLogOut = async () => {
  await IMLogout();
  await Apis.accountLoginOut();
  await window.$sessionStore.clear();
  await window.$lanshuStore.removeItem('tempMsgOBJ');
  await renderProcess.setStore('AUTO_LOGIN', {
    status: true,
    token: '',
    expirationTime: 0,
  });
  await removeToken(TOKEN_TYPE.IS_IM);
  await removeToken(TOKEN_TYPE.IS_SYS);
  removeAllDialogDom();
  renderProcess.showLoginWindow(1000);
  routeInstance.push('/login');

  Object.keys(storeInstance['_mutations']).forEach((key) => {
    if (key.includes(REST_STORE_STATE)) {
      storeInstance.commit(key);
    }
  });
};
export const IMClearUnreadCount = async (sessId) => {
  const res = await eventHOCFnc(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.clearUnreadCount,
    sessId,
  );
  const sessionList = storeInstance.getters['IMStore/sessionList'];
  storeInstance.commit(
    'IMStore/setAllSession',
    sessionList.map((d) => {
      let unreadCount;
      unreadCount = d.sessId === sessId ? 0 : d.unreadCount;

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
          _nextSeq,
        );
        const { nextSeq: currentNextSeq, members = [] } = res.data;
        totalMembers.push(...members);
        _nextSeq = currentNextSeq;
      } catch (e) {
        _nextSeq = -1;
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
  const userProfile = storeInstance.getters['IMStore/userProfile'];
  return await IMGetUserProfile(userProfile.userId);
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

export const IMAnswerNetworkCall = async (uuid, type, userId, userType, data) =>
  await renderProcess.IMSDKNetworkCall(
    IMSDKNetworkPhoneProvider.events.answerNetworkCall,
    uuid,
    type,
    userId,
    userType,
    data,
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

export const IMQueryFriendRequestNotice = async (nextSeq = 0) => {
  return new Promise(async (resolve, reject) => {
    let _nextSeq = nextSeq;
    const resultData = [];
    while (_nextSeq !== -1) {
      try {
        const res = await eventHOCFnc(
          IMSDKFriendProvider.provider,
          IMSDKFriendProvider.events.queryFriendRequestNotice,
          nextSeq,
        );
        const { nextSeq: currentNextSeq, data = [] } = res.data;
        resultData.push(...data);
        _nextSeq = currentNextSeq;
      } catch (e) {
        reject(e);
      }
    }
    resolve({
      data: resultData,
      nextSeq: _nextSeq,
    });
  });
};

export const IMGetFriendRequestNoticeUnreadCount = async () => {
  const res = await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.getFriendRequestNoticeUnreadCount,
  );
  storeInstance.commit('IMStore/setNewFriendCount', Number(res?.data || 0));
};

export const IMAgreeFriendAddRequest = async (noticeId, remark, desc) =>
  await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.agreeFriendAddRequest,
    noticeId,
    remark,
    desc,
  );

export const IMClearFriendRequestNoticeUnreadCount = async () =>
  await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.clearFriendRequestNoticeUnreadCount,
  );

export const IMDelFriendOneWay = async (toUser) =>
  await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.delFriendOneWay,
    toUser,
  );

export const IMSetRemarkOrDesc = async (toUser, remark, desc) =>
  await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.setRemarkOrDesc,
    toUser,
    remark,
    desc,
  );

export const IMGetGroupList = async () =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.getGroupList,
  );

export const IMGetGroupAttribute = async (groupId) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.getGroupAttribute,
    groupId,
  );

export const IMSetGroupAttribute = async (groupId, nickname, avatar) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.setGroupAttribute,
    groupId,
    nickname,
    avatar,
  );

export const IMSetGroupAlias = async (groupId, alias) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.setGroupAlias,
    groupId,
    alias,
  );

export const IMGetGroupMemberInfo = async (groupId, userId) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.getGroupMemberInfo,
    groupId,
    userId,
  );

export const IMGetMyGroupMemberInfo = async (groupId) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.getMyGroupMemberInfo,
    groupId,
  );

export const IMAdminDelGroupMembers = async (groupId, userIds) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.adminDelGroupMembers,
    groupId,
    userIds,
  );

export const IMGetGroupRoleManagerList = async (groupId) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.getGroupRoleManagerList,
    groupId,
  );

export const IMSetGroupRoleManagerList = async (
  groupId,
  whoCanSetGroupInfo,
  whoCanAddGroupMemberOrShareGroup,
  whoCanStartNetworkCall,
  whoCanSendMessage,
  whoCanSendFile,
  whoCanAtAll,
) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.setGroupRoleManagerList,
    groupId,
    whoCanSetGroupInfo,
    whoCanAddGroupMemberOrShareGroup,
    whoCanStartNetworkCall,
    whoCanSendMessage,
    whoCanSendFile,
    whoCanAtAll,
  );

export const IMOwnerTransfer = async (groupId, userId) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.ownerTransfer,
    groupId,
    userId,
  );

export const IMExitGroupChat = async (groupId) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.exitGroupChat,
    groupId,
  );

export const IMDissolveGroupChat = async (groupId) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.dissolveGroupChat,
    groupId,
  );

export const IMSetGroupMemberAddType = async (groupId, groupAddType) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.setGroupMemberAddType,
    groupId,
    groupAddType,
  );

export const IMSetGroupMemberAdminRole = async (groupId, userId, role) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.setGroupMemberAdminRole,
    groupId,
    userId,
    role,
  );

export const IMGetAllAdminList = async (groupId) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.getAllAdminList,
    groupId,
  );

export const IMSetGroupRemark = async (groupId, remark) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.setGroupRemark,
    groupId,
    remark,
  );

export const IMSearchMessageOfText = async (sessId, keyword, nextSeq) =>
  await eventHOCFnc(
    IMSDKMessageProvider.provider,
    IMSDKMessageProvider.events.searchMessageOfText,
    sessId,
    keyword,
    nextSeq,
  );

export const IMSearchMessageByMsgType = async (sessId, msgType, nextSeq) =>
  await eventHOCFnc(
    IMSDKMessageProvider.provider,
    IMSDKMessageProvider.events.searchMessageByMsgType,
    sessId,
    msgType,
    nextSeq,
  );

export const IMSearchFriends = async (keywords) =>
  await eventHOCFnc(
    IMSDKFriendProvider.provider,
    IMSDKFriendProvider.events.searchFriends,
    keywords,
  );

export const IMDelBySessId = async (sessId) =>
  await eventHOCFnc(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.delBySessId,
    sessId,
  );

export const IMGetGroupCurrentMemberCount = async (groupId) =>
  await eventHOCFnc(
    IMSDKGroupProvider.provider,
    IMSDKGroupProvider.events.getGroupCurrentMemberCount,
    groupId,
  );

export const IMRevokeMessage = async (messId) => {
  await eventHOCFnc(
    IMSDKMessageProvider.provider,
    IMSDKMessageProvider.events.revokeMessage,
    messId,
  );
};

export const IMReceiptMessage = async (msgIdList) => {
  await eventHOCFnc(
    IMSDKMessageProvider.provider,
    IMSDKMessageProvider.events.receiptMessage,
    msgIdList,
  );
};

export const IMSetSynergyStatus = async (sessId, help) =>
  await eventHOCFnc(
    IMSDKConvProvider.provider,
    IMSDKConvProvider.events.setHelpConvBySessId,
    sessId,
    help,
  );
