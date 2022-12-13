<template>
  <div class="send-login">
    <div class="back-icon" @click='backLogin'></div>

    <div class="title">{{isAppLogin ? '请在APP上确认登录' : '请输入手机验证码'}}</div>

    <template v-if='!isAppLogin'>
      <div class="title-tips">
        4位数的验证码已发送至手机 {{ phoneText }}，有效期10分钟
      </div>

      <div class="input-panel">
        <div class="verification-code">
          <el-input
            v-for="(code, index) in codeList"
            maxLength="1"
            minLength="1"
            :key="index"
            class="code-item"
            type="text"
            v-model="codeList[index]"
          />
        </div>

        <div class="send-code">重新获取验证码</div>

        <div
          class="login-btn"
          :class="activeBtn && 'active'"
          @click="handleLogin"
        >
          下一步
        </div>
      </div>

      <OtherLogin @wechatLogin="handleWechatLogin" />
    </template>

    <template v-else>
      <div class='user-info'>
        <div class='avatar'></div>
        <div class='nickname'>李安宁</div>
      </div>
    </template>

  </div>
</template>

<script>
import { token } from '@lanshu/utils';
import { renderProcess } from '@lanshu/render-process';
import { IMMixin } from '@lanshu/im';
import OtherLogin from './other-login';

export default {
  name: 'Send-login',
  mixins: [IMMixin],
  components: {
    OtherLogin,
  },
  props: {
    phoneNum: {
      type: [String, Number],
      default: '',
    },
  },
  computed: {
    activeBtn() {
      return this.codeList.every((d) => d);
    },
    phoneText() {
      if (!this.phoneNum) return;
      const regExp = new RegExp(/([\s\S]{3})\d*([\s\S]{4})/);
      const replaceValue = `$1${new Array(Number(4) + 1).join('*')}$2`;
      return this.phoneNum.replace(regExp, replaceValue);
    },
    isAppLogin() {
      return !this.phoneNum
    }
  },
  data() {
    return {
      codeList: ['', '', '', ''],
    };
  },
  methods: {
    backLogin() {
      this.$emit('update:isSendLogin')
    },
    handleWechatLogin() {
      this.$emit('changeLoginType');
    },
    handleLogin() {
      this.initIM();
      renderProcess.showMainWindow();
      token.setToken('12312');
      this.$router.push('/');
    },
    initIM() {
      this.IM_init(
        // 'eyJhcHBJZCI6IjYzNmNhMzFiZDRjYTM1MmJmMWZmNjQxZSIsImFwcFVzZXIiOiIxMjM0NTQzMjEiLCJleHBpcmUiOi0xLCJzaWduIjoiZWpzcWNBS1RaV2lNaThCdzZFZlAzcmRMOERYTzFyQytzbzFLQjd5bWxqOD0ifQ==',
        'eyJhcHBJZCI6IjYzNmNhMzFiZDRjYTM1MmJmMWZmNjQxZSIsImFwcFVzZXIiOiI4ODg4ODg4IiwiZXhwaXJlIjotMSwic2lnbiI6IlByTkhyVlRkTjNZL3RqWmkrV1pGejNIYndNLzBhc2VKS1RJMkgrRGlpaE09In0=',
      );
    },
  },
};
</script>

<style scoped lang="scss">
.back-icon {
  width: 14px;
  height: 6px;
  background-color: #333;
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

  .verification-code,
  .login-btn {
    width: 100%;
    height: 60px;
    line-height: 60px;
    border-radius: 6px;
    box-sizing: border-box;
  }

  .login-btn {
    text-align: center;
    color: $bg-white-color;
    background-color: #87a1cd;
    cursor: pointer;
    margin-bottom: 60px;

    &.active {
      background: $primary-color;
    }
  }

  .verification-code {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .code-item {
      background-color: $bg-hover-grey-color;
      width: 80px;
      height: 60px;
      border-radius: 6px;
      margin-right: 14px;

      ::v-deep .el-input__inner {
        width: 100%;
        height: 60px;
        line-height: 24px;
        font-size: 18px;
        outline: none;
        background-color: transparent;
        border: none;
        padding: 18px 26px;
        box-sizing: border-box;
        color: $main-text-color;
        text-align: center;
      }
    }
  }

  .send-code {
    margin: 30px 0;
    font-size: 14px;
    color: $primary-hover-color;
    cursor: pointer;
  }
}

.user-info {
  width: 140px;
  margin: 126px auto 0;
  text-align: center;

  .avatar {
    width: 140px;
    height: 140px;
    background: #9482FF;
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
