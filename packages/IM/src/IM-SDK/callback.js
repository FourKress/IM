import {
  storeInstance,
  WINDOW_TYPE,
  MSG_FORMAT_MAP,
  CHECK_MSG_TYPE,
  SESSION_USER_TYPE,
  lodash,
  WIN_ACTION_TYPE,
} from '@lanshu/utils';
import { IMClearUnreadCount, ClientLogOut, IMGetGroupAttribute } from './event';
import { renderProcess } from '@lanshu/render-process';

const startNotification = lodash.debounce(async function (message) {
  const audio = new Audio(require('./new-msg-audio.mp3'));
  await audio.play();

  const {
    toUserType,
    toUser,
    fromNickname,
    fromAvatar,
    msgType,
    data,
    sessId,
  } = message;

  const isGroup = toUserType === SESSION_USER_TYPE.IS_GROUP;
  let NOTIFICATION_TITLE = fromNickname,
    NOTIFICATION_ICON = fromAvatar;
  let NOTIFICATION_BODY = '';

  if (isGroup) {
    const res = await IMGetGroupAttribute(toUser);
    const groupInfo = res?.data || {};
    NOTIFICATION_TITLE = groupInfo.nickname;
    NOTIFICATION_ICON = groupInfo.avatar;
    const isNotSystemNotify =
      MSG_FORMAT_MAP[msgType]?.type &&
      MSG_FORMAT_MAP[msgType]?.type !== CHECK_MSG_TYPE.IS_SYSTEM_NOTIFY;
    // 系统消息不展示fromNickname
    if (isNotSystemNotify) {
      NOTIFICATION_BODY = `${fromNickname}: `;
    }
  }

  NOTIFICATION_BODY +=
    `${MSG_FORMAT_MAP[msgType]?.label(data)}` || '未知类型消息';

  new Notification(NOTIFICATION_TITLE, {
    body: NOTIFICATION_BODY,
    icon: NOTIFICATION_ICON,
  }).onclick = () => {
    renderProcess.changeWindow(WIN_ACTION_TYPE.IS_SHOW, WINDOW_TYPE.IS_MAIN);

    if (location.hash !== '#/') return;

    const { isCurrent } = getCurrentSession('sessId', sessId);
    if (isCurrent) {
      IMClearUnreadCount(sessId);
    }
  };
}, 800);

// 检查是否是当前会话
const getCurrentSession = (key, id) => {
  const mainSessionWindow = storeInstance.getters['IMStore/mainSessionWindow'];
  const isCurrent =
    mainSessionWindow[key] && id && mainSessionWindow[key] === id;

  return {
    isCurrent,
    session: mainSessionWindow,
  };
};

export const IMSDKCallBackEvents = {
  Network: (ctx, state) => {
    storeInstance.commit('IMStore/setIMNetworkStatus', state);
  },
  DataSync: (ctx, state) => {
    // 1、同步中，2、同步完成，3、同步失败
    const map = {
      1: '同步中',
      2: '同步完成',
      3: '同步失败',
    };
    storeInstance.commit('IMStore/setIMDataSyncStatus', {
      label: map[state],
      value: state,
    });
  },
  UpdateConvList: (ctx, convList) => {
    storeInstance.commit('IMStore/setAllSession', convList);
  },
  ConvTotalUnreadMessageCount: (ctx, AllUnreadCount) => {
    storeInstance.commit('IMStore/setAllUnreadCount', AllUnreadCount);
  },
  MessageSendingStateCallBack: (ctx, msgInfo) => {
    const { msg } = msgInfo;
    storeInstance.commit('IMStore/setUpdateMsg', msg);
  },
  AddReceiveNewMessage: async (ctx, msgInfo) => {
    const { message, silence, isNotFocused } = msgInfo;
    const { sessId, fromUser } = message;

    const { session, isCurrent } = getCurrentSession('sessId', sessId);

    const { toUser, userId } = session;

    // 窗口是否聚集
    // toUser === userId 则表示和自己对话，不消息提醒
    // message.fromUser === userId 则表示自己发送的消息，不消息提醒
    if (isNotFocused && toUser !== userId && fromUser !== userId) {
      startNotification(message);
    }

    if (!session?.sessId) return;

    storeInstance.commit('IMStore/setCurrentMsg', { ...message, isNotFocused });

    if (!isCurrent) return;

    if (location.hash !== '#/') return;

    await IMClearUnreadCount(sessId, [session]);
  },
  KickOutedOffline(ctx) {
    storeInstance.commit('IMStore/setAllSession', []);
    ctx
      .$LConfirm({
        title: '提示',
        showCancelBtn: false,
        confirmBtnText: '确定',
        content: '当前登录被踢出, 请退出重新登录',
      })
      .then(async () => {
        const hasWindow = await renderProcess.hasWindow('TRTCWindow');
        if (hasWindow) {
          renderProcess.changeWindow(
            this.WIN_ACTION_TYPE.IS_CLOSE,
            WINDOW_TYPE.IS_TRTC,
          );
        }
        await ClientLogOut();
      });
  },
  FriendAddRequestUpdateListener(ctx, friendAddRequestCount) {
    storeInstance.commit(
      'IMStore/setNewFriendCount',
      Number(friendAddRequestCount),
    );
  },
  RefreshMsg(ctx, sessId) {
    storeInstance.commit('IMStore/setRefreshMsg', Date.now());
  },
  FriendDelListener(ctx, info) {
    const { delUerId } = info;

    if (getCurrentSession('toUser', delUerId).isCurrent) {
      storeInstance.commit('IMStore/setMainSessionWindow', {});
    }
    storeInstance.commit('IMStore/setRefreshAddressBook', Date.now());
  },
  UserTokenExpiredCallBack(ctx) {
    ctx
      .$LConfirm({
        title: '提示',
        showCancelBtn: false,
        confirmBtnText: '确定',
        content: '当前登录已失效, 请退出重新登录',
      })
      .then(async () => {
        await ClientLogOut();
      });
  },
  UserNicknameAvatarUpdateListener(ctx, info) {
    const { userId, nickname, avatar } = info;

    const currentSession = getCurrentSession('toUser', userId);

    if (currentSession.isCurrent) {
      storeInstance.commit('IMStore/setMainSessionWindow', {
        ...currentSession.session,
        nickname,
        avatar,
      });
    }

    storeInstance.commit('IMStore/setUserNicknameAvatarUpdate', info);
  },

  GroupUserAttributeChangedCallBack(ctx, info) {
    storeInstance.commit('IMStore/setGroupUserAttributeChanged', info);
  },

  GroupMemberDeleteCallBack(ctx, info) {
    storeInstance.commit('IMStore/setGroupMemberDeleteCallBack', info);
  },

  GroupMemberCountChangesListener(ctx, info) {
    const { groupId } = info;
    if (getCurrentSession('toUser', groupId).isCurrent) {
      storeInstance.commit('IMStore/setRefreshMembers', Date.now());
    }
  },

  GroupRoleManagerUpgradeListener(ctx, info) {
    const {
      groupRoleManager: { groupId },
    } = info;
    if (getCurrentSession('toUser', groupId).isCurrent) {
      storeInstance.commit('IMStore/setRefreshGroupRoleManager', Date.now());
    }
  },

  RevokeMessageCallback(ctx, info) {
    const { revokeMessage } = info;
    const { isCurrent } = getCurrentSession('sessId', revokeMessage.sessId);
    if (isCurrent) {
      storeInstance.commit('IMStore/setRefreshRevoke', revokeMessage);
    }
  },

  ReceiptMessageCallback(ctx, info) {
    const { receipts } = info;
    const { sessId = '' } = storeInstance.getters['IMStore/mainSessionWindow'];
    if (!sessId) return;
    const currentSessionMsgs = receipts.filter((d) => d.sessId === sessId);
    if (currentSessionMsgs?.length) {
      storeInstance.commit('IMStore/setRefreshReceipt', currentSessionMsgs);
    }
  },
};
