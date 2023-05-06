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
      {{ `4位数的验证码已发送至手机 ${phoneText}，有效期10分钟` }}
    </div>

    <div class="input-panel">
      <AuthCode ref="authCode" @inputComplete="handleInputComplete" @switchPassword="handleSwitchPassword" />
      <div
        class="login-btn"
        :class="isAuthCodeComplete && 'active'"
        @click="handleLogin"
      >
        下一步
      </div>
    </div>
  </div>
</template>

<script>
import { PhoneNumMixins, phoneEncryption } from '@lanshu/utils';
import { LsIcon } from '@lanshu/components';
import OtherLogin from './other-login';
import AuthCode from '../../components/authCode';

export default {
  name: 'Enter-auth-code',
  mixins: [PhoneNumMixins],
  props: {
    phoneNum: {
      type: [String, Number],
      default: '',
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

    handleInputComplete(flag) {
      this.isAuthCodeComplete = flag;
    },

    handleSwitchPassword() {
      this.backLogin();
      this.$emit('switchPassword', {
        phoneNum: this.phoneNum,
        isSetPwd: false,
      });
    },

    handleLogin() {
      if (!this.isAuthCodeComplete) return
      this.$emit('sendLogin', {
        phoneNum: this.phoneNum,
        isSetPwd: true,
      });
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
