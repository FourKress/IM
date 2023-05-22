<template>
  <div id="login">
    <div class="image"></div>
    <div class="operate-panel">
      <!--      <div class="login-type" @click="switchLoginType">-->
      <!--        <LsIcon-->
      <!--          render-svg-->
      <!--          width="117"-->
      <!--          height="115"-->
      <!--          :icon="isAccountLogin ? 'a-icon_erweima2x' : 'a-icon_shouji2x'"-->
      <!--        ></LsIcon>-->
      <!--      </div>-->

      <BasicLogin
        ref="basicLogin"
        v-if="!isSendLogin && !isAuthCode"
        :isAccountLogin.sync="isAccountLogin"
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

      <!--      <div-->
      <!--        class="footer-btn"-->
      <!--        v-if="isAccountLogin || phoneNum"-->
      <!--        @click="openDialog"-->
      <!--      >-->
      <!--        <span>-->
      <!--          <span>手机号已停用？去找回</span>-->
      <!--          <i class="el-icon-arrow-right"></i>-->
      <!--        </span>-->
      <!--      </div>-->
    </div>

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
import { mapActions, mapGetters } from 'vuex';

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
      isAccountLogin: true,
      isSendLogin: false,
      isAuthCode: false,
      isSetPwd: false,
      phoneNum: '',
      captcha: '',
    };
  },
  computed: {
    ...mapGetters('globalStore', ['codeCountdown']),
  },
  methods: {
    ...mapActions('globalStore', ['setCodeCountdown']),

    clear() {
      this.isSendLogin = false;
      this.isAuthCode = false;
      this.isSetPwd = false;
      this.phoneNum = '';
      this.captcha = '';
    },
    switchLoginType() {
      this.clear();
      this.$nextTick(() => {
        this.isAccountLogin = !this.isAccountLogin;
      });
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
      if (!this.codeCountdown) {
        await this.setCodeCountdown(60);
      }
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
      if (!isSetPwd && !this.codeCountdown) {
        await this.setCodeCountdown(60);
      }
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
    overflow: hidden;

    .login-type {
      position: absolute;
      top: 0;
      right: 0;
      width: 117px;
      height: 115px;
      cursor: pointer;
      padding: 22px 22px 0 0;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        border-width: 0 138px 137px 0;
        border-style: solid;
        border-color: transparent transparent $bg-white-color;
      }
    }

    .footer-btn {
      width: 185px;
      height: 32px;
      line-height: 32px;
      background: $bg-grey-color;
      border-radius: 100px 0px 20px 0px;
      font-size: 12px;
      text-align: center;
      color: $tips-text-color;
      cursor: pointer;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  .header {
    width: 100%;
    height: 68px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 998;
    -webkit-app-region: drag;

    .action {
      position: absolute;
      width: 90px;
      height: 20px;
      top: 24px;
      right: 20px;
      -webkit-app-region: no-drag !important;
    }
  }
}
</style>
