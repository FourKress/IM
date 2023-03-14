<template>
  <div class="send-login">
    <div class="back-icon" @click="backLogin">
      <LsIcon
        render-svg
        width="40"
        height="30"
        icon="a-icon_zuobian2x"
      ></LsIcon>
    </div>

    <div class="title">
      {{ isAppLogin ? '请在APP上确认登录' : '请输入手机验证码' }}
    </div>

    <template v-if="!isAppLogin">
      <div class="title-tips">
        4位数的验证码已发送至手机 {{ phoneText }}，有效期10分钟
      </div>

      <div class="input-panel">
        <AuthCode ref="authCode" @inputComplete="handleInputComplete" />
      </div>

      <OtherLogin @wechatLogin="handleWechatLogin" />
    </template>

    <template v-else>
      <div class="user-info">
        <div class="avatar"></div>
        <div class="nickname">李安宁</div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { setToken, phoneEncryption } from '@lanshu/utils';
import { IMSDK_Init } from '@lanshu/im';
import { renderProcess } from '@lanshu/render-process';
import OtherLogin from './other-login';
import AuthCode from '../../components/authCode';
import { LsIcon } from '@lanshu/components';

export default {
  name: 'Send-login',
  components: {
    OtherLogin,
    AuthCode,
    LsIcon,
  },
  props: {
    phoneNum: {
      type: [String, Number],
      default: '',
    },
    isSendLogin: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    phoneText() {
      return phoneEncryption(this.phoneNum);
    },
    isAppLogin() {
      return !this.phoneNum;
    },
    ...mapGetters('globalStore', ['codeCountdown']),
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    ...mapActions('IMStore', ['setUserInfo', 'setAllSession']),
    ...mapActions('routerStore', ['clearBreadCrumb']),
    backLogin() {
      this.handleClearInterval();
      this.handleSaveCountdown();
      this.$nextTick(() => {
        this.$emit('update:isSendLogin');
      });
    },
    handleWechatLogin() {
      this.handleClearInterval();
      this.handleSaveCountdown();
      this.$nextTick(() => {
        this.$emit('update:isSendLogin');
      });
    },

    handleInputComplete(flag) {
      if (flag) {
        this.handleLogin();
      }
    },
    handleClearInterval() {
      this.$refs?.authCode?.handleClearInterval();
    },
    handleSaveCountdown() {
      this.$refs?.authCode?.handleSaveCountdown();
    },

    async handleLogin() {
      this.handleClearInterval();
      // const token =
      //   'eyJhcHBJZCI6IjY0MDg0YThhODcxZGY2N2ExMTc3MmM2NSIsImFwcFVzZXIiOiIxMjM0NTQzMjEiLCJleHBpcmUiOi0xLCJzaWduIjoiNTZjZUZrVWVJSjhpcUkzdENtQ0dRWFUvRldEdkFCMXNJZm5FeVhiK0plQT0ifQ==';
      const token = 'eyJhcHBJZCI6IjY0MDg0YThhODcxZGY2N2ExMTc3MmM2NSIsImFwcFVzZXIiOiI5OTk5OTk5IiwiZXhwaXJlIjotMSwic2lnbiI6InlBV3pid3orS1FrUUdRb3JIWU5RL1RNRTJpa093cURBSUozNzVHN3BVMzQ9In0=';
      setToken({
        token,
      });
      try {
        await IMSDK_Init({
          token,
          userId: '9999999',
          // userId: '123454321',
        });

        this.$router.push('/');
        this.clearBreadCrumb();
        renderProcess.showMainWindow();
      } catch (e) {}
    },
  },
};
</script>

<style scoped lang="scss">
.back-icon {
  width: 40px;
  height: 30px;
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

.user-info {
  width: 140px;
  margin: 126px auto 0;
  text-align: center;

  .avatar {
    width: 140px;
    height: 140px;
    background: #9482ff;
    border-radius: 20px;
  }

  .nickname {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: $main-text-color;
    margin-top: 30px;
  }
}
</style>
