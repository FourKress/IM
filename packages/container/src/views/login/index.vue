<template>
  <div id="login">
    <div class="image"></div>
    <div class="operate-panel">
      <div class='login-type' @click='switchLoginType'>
        {{isAccountLogin}}
      </div>

      <BasicLogin :isAccountLogin.sync='isAccountLogin'></BasicLogin>
    </div>

    <div class='action'>
      <WindowOperate isLogin />
    </div>
  </div>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';
import { WindowOperate } from '@lanshu/components'
import BasicLogin from './basic-login';

export default {
  name: 'Login',
  components: {
    WindowOperate,
    BasicLogin,
  },
  data() {
    return {
      isAccountLogin: true
    };
  },
  created() {
    renderProcess.showLoginWindow();
  },
  methods: {
    switchLoginType() {
      this.isAccountLogin = !this.isAccountLogin;
    },
  },
};
</script>

<style scoped lang="scss">
#login {
  width: 1440px;
  height: 1080px;
  background: linear-gradient(
    45deg,
    #dde2ef 0%,
    #eceef5 46%,
    #f3f0eb 81%,
    #dde2ef 100%
  );
  box-sizing: border-box;
  padding: 136px 70px;
  user-select: none;

  -webkit-app-region: drag;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;

  .operate-panel {
    width: 620px;
    height: 808px;
    background-color: $bg-white-color;
    border-radius: 20px;
    border: 1px solid $split-line-color;
    box-sizing: border-box;
    padding: 88px 80px 74px;
    position: relative;

    .login-type {
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      cursor: pointer;

      background-color: #333333;
      color: #fff;
    }
  }

  .action {
    position: absolute;
    top: 24px;
    right: 20px;
  }
}
</style>
