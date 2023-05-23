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
        </el-form>
      </div>
    </template>
  </div>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';
import { formatPhoneNum, PhoneNumMixins, Apis } from '@lanshu/utils';
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
  methods: {
    openUrl(url) {
      renderProcess.openUrl('https://www.baidu.com' || url);
    },
    async handleLogin() {
      if (!this.activeBtn) return;
      if (!this.protocolChecked) {
        this.$message.warning('请阅读并勾选《用户服务协议》《隐私协议》');
        return;
      }
      this.isAwait = true;
      const phoneNum = this.replacePhoneNum();
      const {
        data: { code, msg },
      } = await Apis.accountCheckStatus({
        username: phoneNum,
      });

      this.isAwait = false;

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
  },
};
</script>

<style scoped lang="scss">
.basic-login {
  padding-top: 80px;
}
.logo {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: $bg-IM-color;
  border: 1px solid $split-line-color;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    width: 42px;
    height: 42px;
  }
}

.title {
  height: 32px;
  line-height: 32px;
  font-size: 24px;
  color: $main-text-color;
  font-weight: bold;
  margin-top: 24px;
}

.title-tips {
  font-size: 16px;
  color: $tips-text-color;
  margin-top: 8px;
}

.input-panel {
  margin-top: 60px;

  .phone,
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
    margin-bottom: 16px;
    border: none;
    padding: 0;
    display: block;

    &.active {
      background: $primary-color;
    }
  }

  .phone {
    background-color: $bg-hover-grey-color;
    margin-bottom: 20px;

    ::v-deep .el-input__inner {
      width: 100%;
      height: 60px;
      line-height: 24px;
      font-size: 18px;
      outline: none;
      background-color: transparent;
      border: none;
      padding: 18px 24px;
      box-sizing: border-box;
      color: $main-text-color;

      &::placeholder {
        color: $tips-text-color;
      }
    }
  }

  .checkbox-row {
    color: $minor-text-color;
    font-size: 15px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    ::v-deep .el-checkbox__label {
      padding-left: 8px;
    }

    .link {
      cursor: pointer;
      color: $primary-color;
    }
  }
}
</style>
