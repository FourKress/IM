<template>
  <div class="enter-auth-code">
    <div class="top">
      <div class="back-icon" @click="backLogin">
        <LsIcon
          render-svg
          width="30"
          height="20"
          icon="a-icon_zuobian2x"
        ></LsIcon>
      </div>
      <span class="right" v-if="!isSetPwd" @click="handleSwitchPassword">
        密码登录
      </span>
    </div>

    <div class="title">请输入手机验证码</div>

    <div class="title-tips">
      {{ `验证码已发送至手机 ${phoneText}，有效期5分钟` }}
    </div>

    <div class="input-panel">
      <AuthCode
        ref="authCode"
        :phoneNum="phoneNum"
        :scene="sceneType"
        @inputComplete="handleInputComplete"
        @submit.native.prevent
        @keyup.enter.native="handleLogin"
      >
        <el-button
          class="login-btn"
          :class="isAuthCodeComplete && 'active'"
          :loading="isAwait"
          @click="handleLogin"
        >
          {{ isSetPwd ? '下一步' : '立即登录' }}
        </el-button>
      </AuthCode>
    </div>
  </div>
</template>

<script>
import {
  PhoneNumMixins,
  phoneEncryption,
  Apis,
  SCENE_TYPE,
} from '@lanshu/utils';
import { LsIcon } from '@lanshu/components';
import AuthCode from '../../components/authCode';
import LoginMixins from './loginMixins';

export default {
  name: 'Enter-auth-code',
  mixins: [PhoneNumMixins, LoginMixins],
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
    AuthCode,
    LsIcon,
  },
  data() {
    return {
      SCENE_TYPE,
      isAuthCodeComplete: false,
      codes: '',
      isAwait: false,
    };
  },
  computed: {
    phoneText() {
      // 手机号加密
      return phoneEncryption(this.phoneNum);
    },
    sceneType() {
      return this.isSetPwd
        ? this.SCENE_TYPE.IS_SET_PWD
        : this.SCENE_TYPE.IS_LOGIN;
    },
  },
  methods: {
    backLogin() {
      this.handleSaveCountdown();
      this.handleClearInterval();
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
      this.codes = codes;
    },

    handleSwitchPassword() {
      this.backLogin();
      this.$emit('switchPassword', this.phoneNum, false);
    },

    async handleLogin() {
      if (!this.isAuthCodeComplete) return;
      this.isAwait = true;
      if (this.isSetPwd) {
        Apis.accountCheckCaptcha({
          phone: this.phoneNum,
          captcha: this.codes,
          scene: this.sceneType,
        })
          .then(() => {
            this.$emit(
              'switchPassword',
              this.phoneNum,
              this.isSetPwd,
              this.codes,
            );
          })
          .catch(() => {
            this.$refs?.authCode?.handleClearCode();
            this.isAwait = false;
          });
      } else {
        Apis.accountLoginWithCaptcha({
          username: this.phoneNum,
          captcha: this.codes,
        })
          .then(async (res) => {
            await this.handleClientLogin(res);
          })
          .catch(() => {
            this.$refs?.authCode?.handleClearCode();
            this.isAwait = false;
          });
      }
    },
  },

  beforeDestroy() {
    this.handleClearInterval();
    this.handleSaveCountdown();
  },
};
</script>

<style scoped lang="scss">
.enter-auth-code {
  padding-top: 75px;
}

.top {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .back-icon {
    width: 30px;
    height: 20px;
    cursor: pointer;
  }

  .right {
    cursor: pointer;
    width: 78px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    background: $bg-white-color;
    border-radius: 6px;
    border: 1px solid $primary-color;
    box-sizing: border-box;
    font-size: 12px;
    color: $primary-hover-color;
  }
}

.title {
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  color: $main-text-color;
  font-weight: bold;
  margin-top: 26px;
}
.title-tips {
  font-size: 12px;
  color: $minor-text-color;
  margin-top: 10px;
}

.input-panel {
  margin-top: 44px;

  .login-btn {
    width: 100%;
    height: 48px;
    line-height: 48px;
    border-radius: 6px;
    box-sizing: border-box;
    text-align: center;
    color: $bg-white-color;
    background-color: #87a1cd;
    cursor: pointer;
    margin: 20px 0;
    border: none;
    padding: 0;
    display: block;

    &.active {
      background: $primary-color;
    }
  }
}
</style>
