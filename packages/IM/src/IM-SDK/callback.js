import {
  storeInstance,
  routeInstance,
  WINDOW_TYPE,
  MSG_FORMAT_MAP,
  CHECK_MSG_TYPE,
  SESSION_USER_TYPE,
  lodash,
  WIN_ACTION_TYPE,
  MODAL_DIALOG_TYPE,
} from '@lanshu/utils';
import { IMClearUnreadCount, ClientLogOut, IMGetGroupAttribute } from './event';
import { renderProcess } from '@lanshu/render-process';

const startNotification = lodash.debounce(async function (message) {
  const audio = new Audio(require('./new-msg-audio.mp3'));
  await audio.play();

  const isGroup = message.toUserType === SESSION_USER_TYPE.IS_GROUP;
  let NOTIFICATION_TITLE = message.fromNickname,
    NOTIFICATION_ICON = message.fromAvatar;
  let NOTIFICATION_BODY = '';

  if (isGroup) {
    const res = await IMGetGroupAttribute(message.toUser);
    const groupInfo = res?.data || {};
    NOTIFICATION_TITLE = groupInfo.nickname;
    NOTIFICATION_ICON = groupInfo.avatar;
    NOTIFICATION_BODY = `${message.fromNickname}: `;
  }

  NOTIFICATION_BODY += `${MSG_FORMAT_MAP[message.msgType]?.label(
    message?.data,
  )}`;

  new Notification(NOTIFICATION_TITLE, {
    body: NOTIFICATION_BODY,
    icon: NOTIFICATION_ICON,
  }).onclick = () => {
    const modalDialog = storeInstance.getters['globalStore/modalDialog'];
    const { type = '', visible = false } = modalDialog;
    console.log('modalDialog', modalDialog);
    // 存在全局操作弹窗
    if (type === MODAL_DIALOG_TYPE.IS_DIALOG && visible) {
      renderProcess.changeWindow(WIN_ACTION_TYPE.IS_SHOW, WINDOW_TYPE.IS_MAIN);
      return;
    }

    const sessionList = storeInstance.getters['IMStore/sessionList'];
    const targetSession = sessionList.find((d) => d.sessId === message.sessId);
    if (!targetSession) return;
    storeInstance.commit('IMStore/setMainSessionWindow', targetSession);
    renderProcess.changeWindow(WIN_ACTION_TYPE.IS_SHOW, WINDOW_TYPE.IS_MAIN);
    IMClearUnreadCount(message.sessId);

    if (location.hash === '#/') return;

    // 处理全局遮罩
    if (type === MODAL_DIALOG_TYPE.IS_MODAL && visible) {
      storeInstance.commit('globalStore/setModalDialog', {
        type: MODAL_DIALOG_TYPE.IS_MODAL,
        visible: false,
      });
    }
    setTimeout(() => {
      routeInstance.push('/');
    });
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
    const { sendState, msg } = msgInfo;
    const mainSessionWindow =
      storeInstance.getters['IMStore/mainSessionWindow'];

    if (!mainSessionWindow?.sessId) return;
    if (mainSessionWindow.sessId !== msg.sessId) return;
    storeInstance.commit('IMStore/setRefreshMsg', Date.now());
  },
  AddReceiveNewMessage: async (ctx, msgInfo) => {
    const { message, silence, isFocused } = msgInfo;
    const { sessId, msgType } = message;

    const { session, isCurrent } = getCurrentSession('sessId', sessId);

    const isNotSystemNotify =
      MSG_FORMAT_MAP[msgType]?.type &&
      MSG_FORMAT_MAP[msgType]?.type !== CHECK_MSG_TYPE.IS_SYSTEM_NOTIFY;

    // 窗口是否聚集
    if (!isFocused && isNotSystemNotify) {
      startNotification(message);
    }

    if (!session?.sessId) return;

    storeInstance.commit('IMStore/setCurrentMsg', message);

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
  LogOutCallBack(ctx, info) {
    console.info('日志', info);
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
};
