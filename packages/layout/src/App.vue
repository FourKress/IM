<template>
  <div id="app">
    <MainLayout />
  </div>
</template>

<script>
import MainLayout from './components/layout';
import { mapActions } from 'vuex';

require('./sdk/lim-core-h5-1.1.0');

export default {
  name: 'App',
  components: {
    MainLayout,
  },
  created() {
    console.log(IMSDK);

    const obj = {
      id: '6360e989736e7f4f1f50841a', //会话列表id
      userId: '63477d81660d90392838019c', //IM 自己的userId
      userType: 0, //IM　自己的用户类型
      toUser: '634789e1eaa46d56eb9360f7', //IM  对方的userId
      toUserType: 0, //IM　对方的用户类型
      sessId: '63477d81660d90392838019c:634789e1eaa46d56eb9360f7', //会话id
      sessType: 0, //会话类型
      topState: 0, //置顶状态，0为置顶，1置顶
      state: 0, //会话状态
      tags: null, //会话标记，是一个数组
      extra: null, //自定义数据，二进制，不64字节
      avatar:
        'https://pic3.zhimg.com/v2-aec2f270fa1eebd96098001b4f72a7e7_r.jpg', //对方头像
      appUser: '2345', //该应用下接收方userId
      nickname: '开天辟地第二人', //对方昵称
      lastMsg: {
        //该会话的最后一条消息
        fromUser: '634789e1eaa46d56eb9360f7', //消息发送方（IM），可能存在会话之外的userId
        fromUserType: 0, //消息发送方类型（IM）
        fromUserAvatar:
          'https://pic3.zhimg.com/v2-aec2f270fa1eebd96098001b4f72a7e7_r.jpg',
        toUser: '63477d81660d90392838019c', //消息接收方（IM)，可能存在会话之外的userId
        toUserType: 0, //消息接收方类型
        sessId: '63477d81660d90392838019c:634789e1eaa46d56eb9360f7', //会话id
        msgId: '1037318087717683200', //消息全局唯一id，由服务端生成，
        cliMsgId: '16673529887403', //客户端生成的id
        msgType: 1, //消息类型，1：文本，2：图片，3:文件,4:视频,5:语音,6:位置
        version: '1.0.0', //消息发送时的版本
        timestamp: 1664899200000, //消息时间戳
        data: {
          //消息数据
          content: '士士大夫士大夫士大夫士大夫士大夫士大夫士大夫士大夫大夫', //文本消息内容
        },
      },
      unreadCount: 232,
    };

    setTimeout(() => {
      this.getAllSession([obj]);

    }, 1000);

    IMSDK.registerEvent(IMSDK.EVENTS.IM_SDK_READY, (event) => {
      console.log('IM_SDK_READY');

      const user = IMSDK.getSelfUserSync();
      console.log(user);
    });

    IMSDK.registerEvent(IMSDK.EVENTS.ON_RECEIVED_MESSAGE, (e) => {
      console.log('收到消息：', e.data);
    });

    IMSDK.registerEvent(IMSDK.EVENTS.ON_EVENT_SYNC_START, () => {
      console.log('收取中... ');
    });

    // 事件同步完成（取消顶部显示的 "收取中..."、"同步中..."）
    IMSDK.registerEvent(IMSDK.EVENTS.ON_EVENT_SYNC_FINISH, () => {
      console.log('收取完成 ');

      let sessionArray = IMSDK.getAllSession();
      console.log(sessionArray);
      this.getAllSession(sessionArray);
    });

    // IMSDK.login({
    //   lt: 'eyJhcHBJZCI6IjE2NjI2MDczNzIiLCJhcHBVc2VyIjoiMjM0NSIsImV4cGlyZSI6LTEsInNpZ24iOiI2ZUI4R2ZpbEE0ZGV4eStkUFJQYzRxOVFqeUUvMUJMSHBkS0hBdHdPRm9zPSJ9',
    // })
    //   .then((e) => {
    //     if (e.code === 0) {
    //       console.log('登录成功');
    //     } else {
    //       console.log('登录失败');
    //     }
    //   })
    //   .catch((e) => {
    //     console.log('登录失败，错误码：', e.code);
    //   });
  },
  methods: {
    ...mapActions('global', ['getAllSession']),
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform: translate3d(0, 0, 0);
}
</style>
