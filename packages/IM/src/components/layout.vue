<template>
  <div id="client-im">
    <template v-for="(item, index) in windowList">
      <ImView />
    </template>
  </div>
</template>

<script>
require('../sdk/lim-core');

import { renderProcess } from '@lanshu/render-process';
import ImView from './im-view';

export default {
  name: 'MainIM',
  components: {
    ImView,
  },
  data() {
    return {
      filePath: '',
      imgB64: '',

      windowList: new Array(2).fill(''),
    };
  },
  created() {
    console.log(IMSDK);
    // IMSDK.registerEvent(IMSDK.EVENTS.IM_SDK_READY, (event) => {
    //   console.log("IM_SDK_READY")
    //
    //   let user = IMSDK.getSelfUserSync();
    //   console.log(user)
    //
    //
    //   let textMsg = IMSDK.createTextMessage({
    //     content: '收到你的测试消息', //文本内容
    //     toUser: '63477d81660d90392838019c', //消息接收方，为会话列表中的toUser
    //     toUserType: 0, //消息接收方类型，为会话列表中的toUserType
    //   });
    //
    //
    //   //发送消息，只有在sdk ready状态下才能发送成功，IMSDK.sendMessage返回一个Promise对象
    //   setTimeout(() => {
    //
    //     // IMSDK.sendMessage(textMsg).then((e) => {
    //     //   console.log("消息发送成功", e)
    //     // }).catch((e) => {
    //     //
    //     //   console.log("消息发送失败", e)
    //     // })
    //
    //   }, 8000)
    //
    // })
    //
    IMSDK.registerEvent(IMSDK.EVENTS.ON_RECEIVED_MESSAGE, (e) => {
      //事件处理
      console.log("收到消息：", e.data)
    })
    //
    // IMSDK.registerEvent(IMSDK.EVENTS.ON_EVENT_SYNC_START, () => {
    //   console.log("收取中... ")
    // })
    //
    // //事件同步完成（取消顶部显示的 "收取中..."、"同步中..."）
    // IMSDK.registerEvent(IMSDK.EVENTS.ON_EVENT_SYNC_FINISH, () => {
    //   console.log("收取完成 ")
    //
    //   let sessionArray = IMSDK.getAllSession();
    //   console.log(sessionArray);
    // })
    // let promise = IMSDK.login({
    //   lt: "eyJhcHBJZCI6IjE2NjI2MDczNzIiLCJhcHBVc2VyIjoiMjM0NSIsImV4cGlyZSI6LTEsInNpZ24iOiI2ZUI4R2ZpbEE0ZGV4eStkUFJQYzRxOVFqeUUvMUJMSHBkS0hBdHdPRm9zPSJ9",
    // });
    //
    // promise.then((e) => {
    //   if (e.code === 0) {
    //     console.log("登录成功")
    //   } else {
    //     console.log("登录失败")
    //   }
    // }).catch((e) => {
    //   console.log("登录失败，错误码：", e.code)
    // })
  },
  methods: {
    async handleClick() {
      const filePath = await renderProcess.openFile();
      this.filePath = filePath;
    },
    handleScreenshots() {
      renderProcess.startScreenshots();
      renderProcess.getScreenshots((event, value) => {
        if (value) {
          this.imgB64 = `data:image/png;base64,${value}`;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
#client-im {
  flex: 1;
  height: 100%;
  border-left: 1px solid #eaeaea;
  box-shadow: 4px 0px 10px -4px rgb(51 51 51 / 10%);
  min-width: 500px;
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
  transform: translate3d(0, 0, 0);
}
</style>
