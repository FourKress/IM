<template>
  <div class="basic-login">
    <div class="logo">
      <img :src="LsAssets.logo" alt="" />
    </div>

    <div class="title">欢迎使用</div>

    <div class="title-tips">未注册的手机号，输入后将自动注册</div>

    <template>
      <div class="input-panel">
        <el-form
          :model="form"
          :rules="rules"
          ref="loginForm"
          label-width="0px"
          @submit.native.prevent
          @keyup.enter.native="handleLogin"
        >
          <div class="phone">
            <el-form-item label="" prop="phoneNum">
              <el-input
                type="text"
                maxlength="13"
                placeholder="输入手机号码，登录或注册"
                v-model="form.phoneNum"
              />
            </el-form-item>
          </div>

          <el-button
            class="login-btn"
            :class="activeBtn && 'active'"
            :loading="isAwait"
            @click="handleLogin"
          >
            确定
          </el-button>

          <div class="checkbox-row">
            <el-checkbox v-model="protocolChecked">
              <span>我已阅读并同意</span>
            </el-checkbox>

            <span class="link" @click="openUrl">《用户服务协议》</span>
            <span class="link" @click="openUrl">《隐私协议》</span>
          </div>

          <div class="checkbox-row">
            <el-checkbox v-model="autoLoginChecked" @change="handleAutoLogin">
              <span>7天自动登录</span>
            </el-checkbox>
          </div>
        </el-form>
      </div>
    </template>
  </div>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';
import {
  formatPhoneNum,
  unFormatPhoneNum,
  PhoneNumMixins,
  Apis,
} from '@lanshu/utils';
import { LsAssets } from '@lanshu/components';

export default {
  name: 'Basic-login',
  mixins: [PhoneNumMixins],
  data() {
    return {
      LsAssets,
      isWechatLogin: false,
      form: {
        phoneNum: '',
      },
      rules: {
        phoneNum: [
          {
            required: true,
            message: '请输入有效的电话号码',
            trigger: ['change', 'blur'],
          },
          { validator: this.validateFormValue, trigger: ['blur', 'change'] },
          {
            message: '请输入有效的电话号码',
            max: 13,
            min: 13,
            trigger: ['change', 'blur'],
          },
        ],
      },
      protocolChecked: false,
      isAwait: false,
      autoLoginChecked: false,
    };
  },
  computed: {
    activeBtn() {
      // 勾选协议并且手机号格式正确
      return this.protocolChecked && this.validPhoneNum;
    },
  },
  watch: {
    'form.phoneNum': function (val, oldVal) {
      const phoneNum = formatPhoneNum(val, oldVal);
      if (phoneNum) {
        this.form.phoneNum = phoneNum;
      }
    },
  },
  async created() {
    const historyPhoneNum = await window.$localStore.getItem('historyPhoneNum');
    this.form.phoneNum = historyPhoneNum;
    const autoLogin = (await renderProcess.getStore('AUTO_LOGIN')) || {};
    const { status = false } = autoLogin;
    this.autoLoginChecked = status;
  },
  methods: {
    openUrl(url) {
      renderProcess.openUrl('https://www.baidu.com' || url);
    },
    async handleLogin() {
      if (!this.protocolChecked) {
        this.$message.warning('请阅读并勾选《用户服务协议》《隐私协议》');
        return;
      }
      if (!this.activeBtn) return;

      this.isAwait = true;
      const phoneNum = unFormatPhoneNum(this.form.phoneNum);
      const {
        data: { code, msg },
      } = await Apis.accountCheckStatus({
        username: phoneNum,
      }).finally(() => {
        this.isAwait = false;
      });

      // 正常，跳转密码登录
      if (code === '10009') {
        this.$emit('enterPassword', phoneNum);
        return;
      }

      // 异常，终止登录
      if (code !== '10008') {
        this.$message.error(msg);
        return;
      }
      this.$emit('enterAuthCode', phoneNum);
    },

    handleAutoLogin(val) {
      renderProcess.setStore('AUTO_LOGIN', {
        status: val,
        token: '',
        expirationTime: 0,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.basic-login {
  padding-top: 67px;
}
.logo {
  width: 54px;
  height: 54px;
  border-radius: 11px;
  background: rgba(216, 233, 255, 1);
  border: 1px solid $split-line-color;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    width: 36px;
    height: 36px;
  }
}

.title {
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  color: $main-text-color;
  font-weight: bold;
  margin-top: 16px;
}

.title-tips {
  font-size: 12px;
  color: $minor-text-color;
  margin-top: 8px;
}

.input-panel {
  margin-top: 44px;

  .phone,
  .login-btn {
    width: 100%;
    height: 48px;
    line-height: 48px;
    border-radius: 6px;
    box-sizing: border-box;
  }

  .login-btn {
    text-align: center;
    color: $bg-white-color;
    background-color: #87a1cd;
    cursor: pointer;
    margin-bottom: 16px;
    border: none;
    padding: 0;
    display: block;

    &.active {
      background: $primary-color;
    }
  }

  .phone {
    margin-bottom: 20px;

    ::v-deep .el-input__inner {
      width: 100%;
      height: 48px;
      line-height: 24px;
      font-size: 14px;
      outline: none;
      padding: 12px 20px;
      box-sizing: border-box;
      color: $main-text-color;
      border: 1px solid $bg-white-color;
      background-color: $bg-white-color;

      &::placeholder {
        color: #c8c9cc;
        font-size: 14px;
      }

      &:focus {
        border-color: $primary-color;
      }
    }
  }

  .checkbox-row {
    color: $main-text-color;
    font-size: 12px;
    margin-bottom: 12px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    &:last-child {
      margin-bottom: 0;
    }

    ::v-deep .el-checkbox__label {
      padding-left: 8px;
      color: $main-text-color;
      font-size: 12px;
    }

    .link {
      cursor: pointer;
      color: $primary-color;
    }
  }
}
</style>
