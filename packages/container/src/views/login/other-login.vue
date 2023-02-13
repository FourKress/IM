<template>
  <div class="other-login">
    <div class="split-line">
      <span class="left-line"></span>
      <span class="text">更多登录</span>
      <span class="right-line"></span>
    </div>
    <div class="wechat" @click="handleWechatLogin">
      <LsIcon render-svg width='50' height='50' icon='a-icon_weixin2x'></LsIcon>
    </div>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';

export default {
  name: 'Other-login',
  components: {
    LsIcon,
  },
  methods: {
    handleWechatLogin() {
      this.$emit('wechatLogin');
    },
  },
};
</script>

<style scoped lang="scss">
.other-login {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .split-line {
    height: 20px;
    font-size: 14px;
    color: $tips-text-color;
    margin-bottom: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    .left-line,
    .right-line {
      width: 99px;
      height: 2px;
      background: linear-gradient(
        270deg,
        rgba(238, 238, 238, 0) 0%,
        #d8d8d8 100%
      );
      border-radius: 1px;
    }

    .left-line {
      transform-origin: center;
      transform: rotateZ(-180deg);
    }

    .text {
      margin: 0 10px;
    }
  }

  .wechat {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
  }
}
</style>
