<template>
  <div class="send-login">
    <div class="back-icon" @click="backLogin">
      <LsIcon
        render-svg
        width="30"
        height="20"
        icon="a-icon_zuobian2x"
      ></LsIcon>
    </div>

    <div class="title">
      {{
        isAppLogin
          ? '请在APP上确认登录'
          : isSetPwd
          ? '设置登录密码'
          : '请输入密码'
      }}
    </div>

    <template v-if="!isAppLogin">
      <div class="title-tips" v-if="isSetPwd">
        密码应为8-16位，字母+数字的组合
      </div>

      <div class="input-panel">
        <el-form :model="form" :rules="rules" ref="loginForm" label-width="0px">
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
        </el-form>

        <div class="tips-opt" v-if="!isSetPwd">
          <span class="left" @click="handleForgetPassword">忘记密码？</span>
          <span class="right" @click="handleSwitchAuthCode">
            切换为验证码登录
          </span>
        </div>

        <div
          class="login-btn"
          :class="activeBtn && 'active'"
          @click="handleLogin"
        >
          立即登录
        </div>
      </div>
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
import { mapActions } from 'vuex';
import { Apis } from '@lanshu/utils';
import { renderProcess } from '@lanshu/render-process';
import { LsIcon } from '@lanshu/components';
import LoginMixins from './loginMixins';

const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;

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
    isAppLogin() {
      return !this.phoneNum;
    },
  },
  data() {
    const validateFormPwd = (rule, value, callback) => {
      if (!reg.test(value)) {
        return callback(new Error('请输入有效的密码1'));
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
      const terminal = await renderProcess.getStore('CLIENT_TERMINAL');
      if (this.isSetPwd) {
        await Apis.accountSetPassword({
          username: this.phoneNum,
          password: this.form.firstPhoneNum,
          captcha: this.captcha,
          terminal,
        });
      }

      const res = await Apis.accountLogin({
        username: this.phoneNum,
        password: this.form.firstPhoneNum,
        terminal,
        orgId: '',
      });

      await this.handleClientLogin(res);
    },
  },
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

  .phone,
  .login-btn {
    width: 100%;
    line-height: 60px;
    border-radius: 6px;
    box-sizing: border-box;
  }

  .login-btn {
    height: 60px;
    text-align: center;
    color: $bg-white-color;
    background-color: #87a1cd;
    cursor: pointer;
    margin-top: 36px;

    &.active {
      background: $primary-color;
    }
  }

  .phone {
    background: $bg-white-color;
    margin-bottom: 20px;

    ::v-deep .el-input__inner {
      width: 100%;
      height: 60px;
      line-height: 24px;
      font-size: 18px;
      outline: none;
      border: none;
      padding: 18px 26px;
      box-sizing: border-box;
      color: $main-text-color;
      background-color: $bg-hover-grey-color;

      &::placeholder {
        color: $tips-text-color;
        font-size: 18px;
      }
    }
  }

  .tips-opt {
    margin: 30px 0;
    font-size: 14px;
    color: $primary-hover-color;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left,
    .right {
      cursor: pointer;
    }

    .left {
      &.disabled {
        color: $tips-text-color;
        cursor: default;
      }
    }
  }
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
