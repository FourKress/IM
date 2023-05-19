import {
  storeInstance,
  routeInstance,
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

  const isGroup = message.toUserType === SESSION_USER_TYPE.IS_GROUP;
  let NOTIFICATION_TITLE = message.fromNickname,
    NOTIFICATION_ICON = message.fromAvatar;

  if (isGroup) {
    const res = await IMGetGroupAttribute(message.toUser);
    const groupInfo = res?.data || {};
    NOTIFICATION_TITLE = groupInfo.nickname;
    NOTIFICATION_ICON = groupInfo.avatar;
  }

  let NOTIFICATION_BODY;
  // 文本类型的消息直接展示
  if (MSG_FORMAT_MAP[message.msgType]?.type === CHECK_MSG_TYPE.IS_TEXT) {
    NOTIFICATION_BODY = message?.data?.content.split('<br>')[0];
  } else {
    // 其他类型消息动态处理
    NOTIFICATION_BODY = `${MSG_FORMAT_MAP[message.msgType]?.label(
      message?.data,
    )}`;
  }

  new Notification(NOTIFICATION_TITLE, {
    body: NOTIFICATION_BODY,
    icon: NOTIFICATION_ICON,
  }).onclick = () => {
    const sessionList = storeInstance.getters['IMStore/sessionList'];
    const targetSession = sessionList.find((d) => d.sessId === message.sessId);
    if (!targetSession) return;
    storeInstance.commit('IMStore/setMainSessionWindow', targetSession);
    renderProcess.changeWindow(WIN_ACTION_TYPE.IS_SHOW, WINDOW_TYPE.IS_MAIN);
    if (location.hash === '#/') return;
    IMClearUnreadCount(message.sessId);
    routeInstance.push('/');
  };
}, 800);

export const IMSDKCallBackEvents = {
  Network: (ctx, state) => {
    console.log('@@@@@ Network');
    storeInstance.commit('IMStore/setIMNetworkStatus', state);
  },
  DataSync: (ctx, state) => {
    console.log('@@@@@ DataSync');
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
    console.log('@@@@@ UpdateConvList');
    storeInstance.commit('IMStore/setAllSession', convList);
  },
  ConvTotalUnreadMessageCount: (ctx, AllUnreadCount) => {
    console.log('@@@@@ ConvTotalUnreadMessageCount');
    storeInstance.commit('IMStore/setAllUnreadCount', AllUnreadCount);
  },
  MessageSendingStateCallBack: (ctx, msgInfo) => {
    const { sendState, msg } = msgInfo;
    const mainSessionWindow =
      storeInstance.getters['IMStore/mainSessionWindow'];
    const sessionWindowList =
      storeInstance.getters['IMStore/sessionWindowList'];

    if (!mainSessionWindow?.sessId && !sessionWindowList?.length) return;
    if (mainSessionWindow.sessId !== msg.sessId) return;
    storeInstance.commit('IMStore/setRefreshMsg', Date.now());
  },
  AddReceiveNewMessage: async (ctx, msgInfo) => {
    const { message, silence, isFocused } = msgInfo;

    console.log('@@@@@ AddReceiveNewMessage');

    const mainSessionWindow =
      storeInstance.getters['IMStore/mainSessionWindow'];
    const sessionWindowList =
      storeInstance.getters['IMStore/sessionWindowList'];

    const isCurrentSessionWindow = mainSessionWindow.sessId === message.sessId;

    // 窗口是否聚集
    if (!isFocused) {
      startNotification(message);
    }

    if (!mainSessionWindow?.sessId && !sessionWindowList?.length) return;

    storeInstance.commit('IMStore/setCurrentMsg', message);

    if (!isCurrentSessionWindow) return;

    await IMClearUnreadCount(message.sessId, [
      mainSessionWindow,
      ...sessionWindowList,
    ]);
  },
  KickOutedOffline(ctx) {
    console.log('@@@@@ KickOutedOffline');
    storeInstance.commit('IMStore/setAllSession', []);
    ctx
      .$Lconfirm({
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
    console.log('新好友：', friendAddRequestCount);
    storeInstance.commit(
      'IMStore/setNewFriendCount',
      Number(friendAddRequestCount),
    );
  },
  RefreshMsg(ctx, sessId) {
    console.log('RefreshMsg', sessId);
    storeInstance.commit('IMStore/setRefreshMsg', Date.now());
  },
  FriendDelListener(ctx, info) {
    console.log('FriendDelListener', info);
    const mainSessionWindow =
      storeInstance.getters['IMStore/mainSessionWindow'];
    if (mainSessionWindow.toUser === info.delUerId) {
      storeInstance.commit('IMStore/setMainSessionWindow', {});
    }
    storeInstance.commit('IMStore/setRefreshAddressBook', Date.now());
  },
  UserTokenExpiredCallBack(ctx) {
    console.log('UserTokenExpiredCallBack');
    ctx
      .$Lconfirm({
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
    console.log('UserNicknameAvatarUpdateListener', info);
    const { userId, nickname, avatar } = info;
    const mainSessionWindow =
      storeInstance.getters['IMStore/mainSessionWindow'];
    if (mainSessionWindow?.toUser && userId) {
      storeInstance.commit('IMStore/setMainSessionWindow', {
        ...mainSessionWindow,
        nickname,
        avatar,
      });
    }

    storeInstance.commit('IMStore/setUserNicknameAvatarUpdate', info);
  },

  GroupUserAttributeChangedCallBack(ctx, info) {
    console.log(info);
    storeInstance.commit('IMStore/setGroupUserAttributeChanged', info);
  },
};
