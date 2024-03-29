<template>
  <div class="send-login">
    <div class="top">
      <div class="back-icon" @click="backLogin">
        <LsIcon
          render-svg
          width="30"
          height="20"
          icon="a-icon_zuobian2x"
        ></LsIcon>
      </div>
      <span class="right" v-if="!isSetPwd" @click="handleSwitchAuthCode">
        验证码登录
      </span>
    </div>

    <div class="title">
      {{ isSetPwd ? '设置登录密码' : '请输入密码' }}
    </div>

    <div class="title-tips">密码应为8-16位，字母+数字的组合</div>

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
          <el-form-item label="" prop="firstPhoneNum">
            <el-input
              ref="firstPhoneNum"
              type="password"
              maxlength="16"
              show-password
              placeholder="请输入密码"
              v-model="form.firstPhoneNum"
            />
          </el-form-item>
          <el-form-item label="" prop="secondPhoneNum" v-if="isSetPwd">
            <el-input
              type="password"
              maxlength="16"
              show-password
              placeholder="请再次输入密码"
              v-model="form.secondPhoneNum"
            />
          </el-form-item>
        </div>

        <el-button
          class="login-btn"
          :class="activeBtn && 'active'"
          :loading="isAwait"
          @click="handleLogin"
        >
          立即登录
        </el-button>

        <input type="hidden" />
      </el-form>

      <div class="tips-opt" v-if="!isSetPwd">
        <span class="left" @click="handleForgetPassword">忘记密码？</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Apis, encryptData } from '@lanshu/utils';
import { LsIcon } from '@lanshu/components';
import LoginMixins from './loginMixins';

const reg = /^(?=.*[a-zA-Z])(?=.*\d)[0-9a-zA-Z!@#$%^&*_+,.?]{8,16}$/;

export default {
  name: 'Send-login',
  mixins: [LoginMixins],
  components: {
    LsIcon,
  },
  props: {
    isSetPwd: {
      type: Boolean,
      default: true,
    },
    phoneNum: {
      type: [String, Number],
      default: '',
    },
    isSendLogin: {
      type: Boolean,
      default: true,
    },
    captcha: {
      type: [String, Number],
      default: '',
    },
  },
  computed: {
    activeBtn() {
      const { firstPhoneNum, secondPhoneNum } = this.form;
      if (this.isSetPwd) {
        return (
          firstPhoneNum &&
          secondPhoneNum &&
          firstPhoneNum === secondPhoneNum &&
          reg.test(firstPhoneNum)
        );
      }
      return firstPhoneNum && reg.test(firstPhoneNum);
    },
  },
  data() {
    const validateFormPwd = (rule, value, callback) => {
      if (!reg.test(value)) {
        return callback(new Error('请输入有效的密码'));
      }
      const { secondPhoneNum } = this.form;
      if (secondPhoneNum && secondPhoneNum !== value) {
        this.$refs.loginForm.validateField('secondPhoneNum');
      }
      return callback();
    };

    const validateFormSecondPwd = (rule, value, callback) => {
      if (!reg.test(value)) {
        return callback(new Error('请输入有效的密码'));
      }
      const { firstPhoneNum } = this.form;
      if (firstPhoneNum && firstPhoneNum !== value) {
        return callback(new Error('两次密码输入不一致，请重新输入'));
      }
      return callback();
    };

    return {
      form: {
        firstPhoneNum: '',
        secondPhoneNum: '',
      },
      rules: {
        firstPhoneNum: [
          {
            required: true,
            max: 16,
            min: 8,
            message: '请输入有效的密码',
            trigger: ['change', 'blur'],
          },
          { validator: validateFormPwd, trigger: ['blur', 'change'] },
        ],
        secondPhoneNum: [
          {
            required: true,
            max: 16,
            min: 8,
            message: '请输入有效的密码',
            trigger: ['change', 'blur'],
          },
          {
            validator: validateFormSecondPwd,
            trigger: ['blur', 'change'],
          },
        ],
      },
      isAwait: false,
    };
  },
  mounted() {
    this.$refs.firstPhoneNum.focus();
  },
  methods: {
    backLogin() {
      if (this.isSetPwd) {
        this.$emit('backAuth', this.phoneNum, true);
      } else {
        this.$emit('update:isSendLogin');
      }
    },

    handleForgetPassword() {
      this.$emit('backAuth', this.phoneNum, true);
    },
    handleSwitchAuthCode() {
      this.$emit('backAuth', this.phoneNum, false);
    },

    async handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.isAwait = true;
          const password = await encryptData(this.form.firstPhoneNum);
          try {
            if (this.isSetPwd) {
              await Apis.accountSetPassword({
                username: this.phoneNum,
                password,
                captcha: this.captcha,
              });
            }

            const res = await Apis.accountLogin({
              username: this.phoneNum,
              password,
            });
            await this.handleClientLogin(res);
          } catch (e) {
            this.isAwait = false;
          }
        }
      });
      return;
    },
  },
};
</script>

<style scoped lang="scss">
.send-login {
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
    background: transparent;
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

  .phone,
  .login-btn {
    width: 100%;
    line-height: 48px;
    border-radius: 6px;
    box-sizing: border-box;
  }

  .phone {
    min-height: 48px;

    ::v-deep .el-form-item {
      margin-bottom: 20px;
    }
  }

  .login-btn {
    height: 48px;
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
    background-color: transparent;
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

  .tips-opt {
    margin-top: 16px;
    font-size: 12px;
    color: $primary-hover-color;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      cursor: pointer;
    }
  }
}
</style>
