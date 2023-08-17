<template>
  <div
    id="login"
    :style="{
      backgroundImage: `url(${LsAssets.loginBg})`,
    }"
  >
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
import { WindowOperate, LsIcon, LsAssets } from '@lanshu/components';
import {
  RecoverAccountMixins,
  Apis,
  setToken,
  TOKEN_TYPE,
} from '@lanshu/utils';
import BasicLogin from './basic-login';
import SendLogin from './send-login';
import EnterAuthCode from './enter-auth-code';
import loginMixins from './loginMixins';
import { renderProcess } from '@lanshu/render-process';

export default {
  name: 'Login',
  components: {
    WindowOperate,
    BasicLogin,
    SendLogin,
    LsIcon,
    EnterAuthCode,
  },
  mixins: [loginMixins, RecoverAccountMixins],
  data() {
    return {
      LsAssets,
      isSendLogin: false,
      isAuthCode: false,
      isSetPwd: false,
      phoneNum: '',
      captcha: '',
    };
  },
  async created() {
    const autoLogin = (await renderProcess.getStore('AUTO_LOGIN')) || {};
    const { status = false, token = '' } = autoLogin;
    if (status && token) {
      setToken(TOKEN_TYPE.IS_SYS, token);
      const { data } = await Apis.accountUserInfo().catch(() => {
        this.autoLoginResult();
      });
      const loginData = data?.loginData;
      if (loginData) {
        await this.handleClientLogin({
          data: loginData,
        });
      }
      this.autoLoginResult();
    }
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

    autoLoginResult() {
      renderProcess.autoLoginCallBack();
    },
  },
};
</script>

<style scoped lang="scss">
#login {
  width: 360px;
  height: 490px;
  background-color: #ccc;
  box-sizing: border-box;
  padding: 0 30px;
  user-select: none;
  overflow: hidden;
  position: relative;
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;

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
