<template>
  <div id="login">
    <BasicLogin
      ref="basicLogin"
      v-if="!isSendLogin && !isAuthCode"
      @enterAuthCode="handleEnterAuthCode"
      @enterPassword="handleEnterPassword"
      @sendLogin="handleSendLogin"
    />

    <EnterAuthCode
      v-if="isAuthCode"
      :isAuthCode.sync="isAuthCode"
      :phoneNum="phoneNum"
      :isSetPwd="isSetPwd"
      @sendLogin="handleSendLogin"
      @switchPassword="handleSwitchPassword"
    />

    <SendLogin
      v-if="isSendLogin && !isAuthCode"
      :isSendLogin.sync="isSendLogin"
      :phoneNum="phoneNum"
      :isSetPwd="isSetPwd"
      :captcha="captcha"
      @backAuth="handleBackAuth"
    />

    <div class="header">
      <div class="action">
        <WindowOperate isLogin />
      </div>
    </div>
  </div>
</template>

<script>
import { WindowOperate, LsIcon } from '@lanshu/components';
import { RecoverAccountMixins } from '@lanshu/utils';
import BasicLogin from './basic-login';
import SendLogin from './send-login';
import EnterAuthCode from './enter-auth-code';

export default {
  name: 'Login',
  components: {
    WindowOperate,
    BasicLogin,
    SendLogin,
    LsIcon,
    EnterAuthCode,
  },
  mixins: [RecoverAccountMixins],
  data() {
    return {
      isSendLogin: false,
      isAuthCode: false,
      isSetPwd: false,
      phoneNum: '',
      captcha: '',
    };
  },
  methods: {
    clear() {
      this.isSendLogin = false;
      this.isAuthCode = false;
      this.isSetPwd = false;
      this.phoneNum = '';
      this.captcha = '';
    },

    handleSendLogin(phoneNum = '') {
      this.phoneNum = phoneNum;
      this.isSendLogin = true;
      this.isAuthCode = false;
    },

    handleSwitchPassword(phoneNum = '', isSetPwd, captcha) {
      this.isSetPwd = isSetPwd;
      this.captcha = captcha;
      this.handleSendLogin(phoneNum);
    },

    async handleEnterAuthCode(phoneNum = '') {
      this.isSetPwd = true;
      this.isAuthCode = true;
      this.phoneNum = phoneNum;
    },
    handleEnterPassword(phoneNum = '') {
      this.isSetPwd = false;
      this.handleSendLogin(phoneNum);
    },

    async handleBackAuth(phoneNum = '', isSetPwd) {
      this.isSetPwd = isSetPwd;
      this.phoneNum = phoneNum;
      this.isAuthCode = true;
      this.isSendLogin = false;
    },
  },
};
</script>

<style scoped lang="scss">
#login {
  width: 440px;
  height: 600px;
  background-color: $bg-white-color;
  box-sizing: border-box;
  border-radius: 20px;
  padding: 0 40px;
  user-select: none;
  overflow: hidden;
  position: relative;

  .header {
    width: 100%;
    height: 64px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 998;
    -webkit-app-region: drag;

    .action {
      position: absolute;
      width: 66px;
      height: 24px;
      top: 20px;
      right: 20px;
      -webkit-app-region: no-drag !important;
    }
  }
}
</style>
