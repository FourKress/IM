require('./sdk/lim-core-h5-1.1.0');
import { mapActions } from 'vuex';

export default {
  created() {},
  methods: {
    ...mapActions('IMStore', [
      'setAllSession',
      'setUserInfo',
      'setMainSessionWindow',
    ]),
    IM_init(token) {
      IMSDK.registerEvent(IMSDK.EVENTS.IM_SDK_READY, (event) => {
        console.log('IM_SDK_READY');
        const user = IMSDK.getSelfUserSync();
        this.setUserInfo(user);
        console.log(user);
      });
      IMSDK.registerEvent(IMSDK.EVENTS.IM_SDK_NOT_READY, () => {
        console.log(' SDK not ready');
      });
      IMSDK.registerEvent(IMSDK.EVENTS.ON_RECEIVED_MESSAGE, (e) => {
        console.log('收到消息：', e.data);
      });
      IMSDK.registerEvent(IMSDK.EVENTS.ON_EVENT_SYNC_START, () => {
        console.log('收取中... ');
      });
      IMSDK.registerEvent(IMSDK.EVENTS.ON_SESSION_UNREAD_TOTAL_UPDATE, (e) => {
        console.log('总未读数更新 ' + e.data);
      });
      IMSDK.registerEvent(IMSDK.EVENTS.ON_SESSION_UPDATE, (e) => {
        console.log('会话更新');
        if (e.data.length > 0) {
          console.log(e.data);
        }
      });
      IMSDK.registerEvent(IMSDK.EVENTS.ON_KICK_OUT_EVENT, (e) => {
        console.log('登录被踢出...', e.data);
      });
      // 网络状态发生变化时回调，e.data=1网络正常，e.data=2网络断开sdk重连中（可在顶部提示 "连接中..."）
      IMSDK.registerEvent(IMSDK.EVENTS.NET_STATE_CHANGE, (e) => {
        if (e.data === 2) {
          // 2网络断开sdk重连中
          console.log('连接中...');
        } else {
          // 网络正常
          console.log('网络正常');
        }
        console.log('网络发生变化 ', e.data);
      });
      // 收到服务端的错误事件，e.code 状态码，e.message 描述信息
      IMSDK.registerEvent(IMSDK.EVENTS.ON_ERROR, (e) => {
        // 事件处理
        console.log('收到错误：', e.code + e.message);
      });
      // 当有消息被修改时，调用该方法，e.data 为消息对象，直接替换对应的msgId中的data和extraData
      IMSDK.registerEvent(IMSDK.EVENTS.ON_MESSAGE_MODIFY, (e) => {
        console.log('消息被修改 ', e.data);
      });

      // 事件同步完成（取消顶部显示的 "收取中..."、"同步中..."）
      IMSDK.registerEvent(IMSDK.EVENTS.ON_EVENT_SYNC_FINISH, () => {
        console.log('收取完成');
        const sessionArray = IMSDK.getAllSession();
        console.log('会话列表', sessionArray);
        if (sessionArray?.length) {
          this.setAllSession(sessionArray);
          setTimeout(() => {
            this.setMainSessionWindow(sessionArray[0]);
          }, 0);
        }
      });

      IMSDK.login({
        lt: token,
      })
        .then((e) => {
          if (e.code === 0) {
            console.log('登录成功');
          } else {
            console.log('IM 登录失败');
          }
        })
        .catch((e) => {
          console.log('IM 登录失败，错误码：', e.code);
        });
    },
  },
};
