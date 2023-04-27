import { stareInstance, routeInstance } from '@lanshu/utils';
import { IMClearUnreadCount } from './event';

export const IMSDKCallBackEvents = {
  Network: (state) => {
    console.log('@@@@@ Network');
    stareInstance.commit('IMStore/setIMNetworkStatus', state);
  },
  DataSync: (state) => {
    console.log('@@@@@ DataSync');
    // 1、同步中，2、同步完成，3、同步失败
    const map = {
      1: '同步中',
      2: '同步完成',
      3: '同步失败',
    };
    stareInstance.commit('IMStore/setIMDataSyncStatus', {
      label: map[state],
      value: state,
    });
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
    new Notification(NOTIFICATION_TITLE, {
      body: NOTIFICATION_BODY,
    }).onclick = () => {
      const sessionList = stareInstance.getters['IMStore/sessionList'];
      const targetSession = sessionList.find(
        (d) => d.sessId === message.sessId,
      );
      if (!targetSession) return;
      stareInstance.commit('IMStore/setMainSessionWindow', targetSession);
      if (location.hash === '#/') return;
      IMClearUnreadCount(message.sessId);
      routeInstance.push('/');
    };

    console.log('@@@@@ AddReceiveNewMessage');
    stareInstance.commit('IMStore/setCurrentMsg', message);

    const mainSessionWindow =
      stareInstance.getters['IMStore/mainSessionWindow'];
    const sessionWindowList =
      stareInstance.getters['IMStore/sessionWindowList'];

    if (!mainSessionWindow?.sessId && !sessionWindowList?.length) return;

    if (mainSessionWindow.sessId !== message.sessId) return;

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
  FriendAddRequestUpdateListener(friendAddRequestCount) {
    console.log('新好友：', friendAddRequestCount);
    stareInstance.commit(
      'IMStore/setNewFriendCount',
      Number(friendAddRequestCount),
    );
  },
  RefreshMsg(sessId) {
    console.log('RefreshMsg', sessId);
    stareInstance.commit('IMStore/setRefreshMsg', true);
  },
};
