import { storeInstance, routeInstance } from '@lanshu/utils';
import { IMClearUnreadCount, ClientLogOut } from './event';

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
    const { message, silence } = msgInfo;

    const NOTIFICATION_TITLE = '客户端通知';
    const NOTIFICATION_BODY = message?.data?.content;
    new Notification(NOTIFICATION_TITLE, {
      body: NOTIFICATION_BODY,
    }).onclick = () => {
      const sessionList = storeInstance.getters['IMStore/sessionList'];
      const targetSession = sessionList.find(
        (d) => d.sessId === message.sessId,
      );
      if (!targetSession) return;
      storeInstance.commit('IMStore/setMainSessionWindow', targetSession);
      if (location.hash === '#/') return;
      IMClearUnreadCount(message.sessId);
      routeInstance.push('/');
    };

    console.log('@@@@@ AddReceiveNewMessage');

    const mainSessionWindow =
      storeInstance.getters['IMStore/mainSessionWindow'];
    const sessionWindowList =
      storeInstance.getters['IMStore/sessionWindowList'];

    if (!mainSessionWindow?.sessId && !sessionWindowList?.length) return;

    storeInstance.commit('IMStore/setCurrentMsg', message);

    if (mainSessionWindow.sessId !== message.sessId) return;

    await IMClearUnreadCount(message.sessId, [
      mainSessionWindow,
      ...sessionWindowList,
    ]);
  },
  KickOutedOffline(ctx) {
    console.log('@@@@@ KickOutedOffline');
    storeInstance.commit('IMStore/setAllSession');
    ctx
      .$Lconfirm({
        title: '提示',
        showCancelBtn: false,
        confirmBtnText: '确定',
        content: '当前登录被提出, 请退出重新登录',
      })
      .then(async () => {
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
    storeInstance.commit('IMStore/setGroupAttributeChanged', info);
  },
};
