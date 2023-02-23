require('./sdk/lim-core-h5');
import { mapGetters, mapActions } from 'vuex';
import { _clearSessionUnreadCount } from '@lanshu/utils';

export default {
  data() {
    return {
      isNewMsg: false,
    };
  },
  created() {},
  computed: {
    ...mapGetters('IMStore', [
      'SDK_NOT_READ',
      'sessionWindowList',
      'mainSessionWindow',
    ]),
  },
  methods: {
    ...mapActions('IMStore', [
      'setAllSession',
      'setUserInfo',
      'setIMStatus',
      'setCurrentMsg',
    ]),
    IM_init() {
      IMSDK.registerEvent(IMSDK.EVENTS.IM_SDK_READY, (event) => {
        console.log('IM_SDK_READY');
        const user = IMSDK.getSelfUserSync();
        this.setUserInfo(user);
        console.log(user);
      });
      IMSDK.registerEvent(IMSDK.EVENTS.IM_SDK_NOT_READY, () => {
        console.log(' SDK not ready');
        this.$message.error(this.SDK_NOT_READ);
        this.setIMStatus(this.SDK_NOT_READ);
      });
      IMSDK.registerEvent(IMSDK.EVENTS.ON_RECEIVED_MESSAGE, async (e) => {
        console.log('收到消息：', e.data);

        const msg = e.data;
        if (this.isNewMsg) {
          this.setCurrentMsg(msg);

          // 拿到所有的聊天界面, 匹配对应消息 做清除未读数
          await _clearSessionUnreadCount(msg.sessId, [
            this.mainSessionWindow,
            ...this.sessionWindowList,
          ]);

          const NOTIFICATION_TITLE = '客户端通知';
          const NOTIFICATION_BODY = msg?.data?.content;
          const CLICK_MESSAGE = msg;
          new Notification(NOTIFICATION_TITLE, {
            body: NOTIFICATION_BODY,
          }).onclick = () => {
            console.log(CLICK_MESSAGE);
          };
        }
      });
      IMSDK.registerEvent(IMSDK.EVENTS.ON_EVENT_SYNC_START, () => {
        console.log('同步中... ');
        this.setIMStatus('同步中...');
      });
      IMSDK.registerEvent(IMSDK.EVENTS.ON_SESSION_UNREAD_TOTAL_UPDATE, (e) => {
        console.log('总未读数更新 ' + e.data);
      });
      IMSDK.registerEvent(IMSDK.EVENTS.ON_SESSION_UPDATE, (e) => {
        console.log('会话更新');
        console.log(e.data);
        if (e.data.length > 0) {
          const sessionArray = e.data;
          this.setAllSession(sessionArray);
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
          this.setIMStatus('连接中...');
        } else {
          // 网络正常
          console.log('网络正常');
          this.setIMStatus('');
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
        this.isNewMsg = true;
        this.setIMStatus('');
      });
    },
  },
};
