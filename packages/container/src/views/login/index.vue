<template>
  <div id="login">
    <div class="image"></div>
    <div class="operate-panel">
      <div class="login-type" @click="switchLoginType"></div>

      <BasicLogin
        ref="basicLogin"
        v-if="!isSendLogin"
        :isAccountLogin.sync="isAccountLogin"
        @sendLogin="handleSendLogin"
      ></BasicLogin>

      <SendLogin
        v-else
        :phoneNum="phoneNum"
        :isSendLogin.sync="isSendLogin"
        :is
        @changeLoginType="changeLoginType"
      ></SendLogin>

      <div
        class="footer-btn"
        v-if="isAccountLogin || phoneNum"
        @click="openDialog"
      >
        <span>手机号已停用？去找回 ></span>
      </div>
    </div>

    <div class="action">
      <WindowOperate isLogin />
    </div>

    <div class="dialog" v-if='showDialog'>
      <div class="dialog-panel">
        <div class="dialog-panel-top">提示</div>
        <div class="dialog-panel-content">
          已实名账号, 请使用北象App自助找回账号。
          如未实名或无法使用移动端, 您也可以通过
          <span class='link'>账号申诉</span>
          找回账号。
        </div>
        <div class='dialog-panel-footer' @click='showDialog = false'>知道了</div>
      </div>
    </div>
  </div>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';
import { WindowOperate } from '@lanshu/components';
import BasicLogin from './basic-login';
import SendLogin from './send-login';

export default {
  name: 'Login',
  components: {
    WindowOperate,
    BasicLogin,
    SendLogin,
  },
  data() {
    return {
      isAccountLogin: true,
      isSendLogin: false,
      phoneNum: '',
      showDialog: false,
    };
  },
  created() {
    renderProcess.showLoginWindow();
  },
  methods: {
    clear() {
      this.isSendLogin = false;
      this.phoneNum = '';
    },
    switchLoginType() {
      this.clear();
      this.$nextTick(() => {
        this.isAccountLogin = !this.isAccountLogin;
      });
    },
    changeLoginType() {
      this.clear();
      this.$nextTick(() => {
        this.$refs.basicLogin.handleWechatLogin();
      });
    },
    handleSendLogin(phoneNum = '') {
      this.phoneNum = phoneNum;
      this.isSendLogin = true;
    },
    openDialog() {
      this.showDialog = true;
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

  .action {
    position: absolute;
    top: 24px;
    right: 20px;
  }

  .dialog {
    width: 100%;
    height: 100%;
    background: rgba(51,51,51,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9;
    transition: all .3s;

    &-panel {
      width: 369px;
      height: 239px;
      background: $bg-white-color;
      box-shadow: 0px 4px 20px 0px rgba(51,51,51,0.1);
      border-radius: 12px;
      border: 1px solid $split-line-color;
      box-sizing: border-box;
      padding: 0 46px;

      &-top {
        width: 36px;
        height: 25px;
        font-size: 18px;
        font-weight: bold;
        color: $main-text-color;
        line-height: 25px;
        margin: 30px auto;
      }

      &-content {
        height: 60px;
        font-size: 14px;
        color: $main-text-color;
        line-height: 20px;

        .link {
          color: $primary-hover-color;
        }
      }

      &-footer {
        width: 88px;
        height: 34px;
        background-color: $bg-grey-color;
        border-radius: 6px;
        text-align: center;
        line-height: 34px;
        font-size: 14px;
        font-weight: bold;
        color: $primary-color;
        margin: 30px auto;
        cursor: pointer;
      }
    }
  }
}
</style>
