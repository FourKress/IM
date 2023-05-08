<template>
  <div class="enter-auth-code">
    <div class="back-icon" @click="backLogin">
      <LsIcon
        render-svg
        width="30"
        height="20"
        icon="a-icon_zuobian2x"
      ></LsIcon>
    </div>

    <div class="title">请输入手机验证码</div>

    <div class="title-tips">
      {{ `4位数的验证码已发送至手机 ${phoneText}，有效期5分钟` }}
    </div>

    <div class="input-panel">
      <AuthCode ref="authCode" :phoneNum="phoneNum" @inputComplete="handleInputComplete">
        <span v-if="!isSetPwd" @click="handleSwitchPassword">切换为密码登录</span>
      </AuthCode>
      <div
        class="login-btn"
        :class="isAuthCodeComplete && 'active'"
        @click="handleLogin"
      >
        {{isSetPwd ? '下一步' : '立即登录'}}
      </div>
    </div>
  </div>
</template>

<script>
import { PhoneNumMixins, phoneEncryption, Apis } from '@lanshu/utils';
import { LsIcon } from '@lanshu/components';
import OtherLogin from './other-login';
import AuthCode from '../../components/authCode';
import {renderProcess} from "@lanshu/render-process";

export default {
  name: 'Enter-auth-code',
  mixins: [PhoneNumMixins],
  props: {
    phoneNum: {
      type: [String, Number],
      default: '',
    },
    isSetPwd: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    OtherLogin,
    AuthCode,
    LsIcon,
  },
  data() {
    return {
      isAuthCodeComplete: false,
      codes: '',
    };
  },
  computed: {
    phoneText() {
      return phoneEncryption(this.phoneNum);
    },
  },
  watch: {},
  methods: {
    backLogin() {
      this.handleClearInterval();
      this.handleSaveCountdown();
      this.$nextTick(() => {
        this.$emit('update:isAuthCode');
      });
    },

    handleClearInterval() {
      this.$refs?.authCode?.handleClearInterval();
    },
    handleSaveCountdown() {
      this.$refs?.authCode?.handleSaveCountdown();
    },

    handleInputComplete(flag, codes) {
      this.isAuthCodeComplete = flag;
      this.codes = codes
    },

    handleSwitchPassword() {
      this.backLogin();
      this.$emit('switchPassword', this.phoneNum, false);
    },

    async handleLogin() {
      if (!this.isAuthCodeComplete) return
      const terminal = await renderProcess.getStore('CLIENT_TERMINAL');
      await Apis.accountCheckCaptcha({
        phone: this.phoneNum,
        captcha: this.codes,
        terminal
      })
      this.$emit('switchPassword', this.phoneNum, this.isSetPwd, this.codes);
    },
  },

  beforeDestroy() {
    this.handleClearInterval();
    this.handleSaveCountdown();
  }
};
</script>

<style scoped lang="scss">
.back-icon {
  width: 30px;
  height: 20px;
  margin: 24px 0 44px 0;
  cursor: pointer;
}
.title {
  font-size: 30px;
  color: $main-text-color;
  font-weight: bold;
}
.title-tips {
  font-size: 14px;
  color: $tips-text-color;
  margin-top: 8px;
}
.input-panel {
  margin: 60px 0 126px 0;
}

.input-panel {
  margin: 60px 0;

  .login-btn {
    text-align: center;
    color: $bg-white-color;
    background-color: #87a1cd;
    cursor: pointer;
    margin-bottom: 60px;
    width: 100%;
    height: 60px;
    line-height: 60px;
    border-radius: 6px;
    box-sizing: border-box;

    &.active {
      background: $primary-color;
    }
  }
}
</style>
