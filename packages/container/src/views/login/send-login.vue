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
            <el-form-item label="" prop="secondPhoneNum">
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

        <div
          class="login-btn"
          :class="activeBtn && 'active'"
          @click="handleLogin"
        >
          下一步
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
import { setToken } from '@lanshu/utils';
import { IMSDK_Init } from '@lanshu/im';
import { renderProcess } from '@lanshu/render-process';
import { LsIcon } from '@lanshu/components';
import { microShared } from '@lanshu/micro';

export default {
  name: 'Send-login',
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
  },
  computed: {
    activeBtn() {
      const { firstPhoneNum, secondPhoneNum } = this.form;
      return (
        firstPhoneNum && secondPhoneNum && firstPhoneNum === secondPhoneNum
      );
    },
    isAppLogin() {
      return !this.phoneNum;
    },
  },
  data() {
    const reg = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/g;
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
    };
  },
  mounted() {
    this.$refs.firstPhoneNum.focus();
  },
  methods: {
    ...mapActions('IMStore', ['setUserInfo', 'setAllSession']),
    ...mapActions('routerStore', ['clearBreadCrumb']),

    backLogin() {
      this.handleBeforeDestroy();
      this.$nextTick(() => {
        this.$emit('update:isSendLogin');
      });
    },

    handleBeforeDestroy() {
      this.handleClearInterval();
      this.handleSaveCountdown();
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
      //   'eyJhcHBJZCI6IjY0MDg0YThhODcxZGY2N2ExMTc3MmM2NSIsImFwcFVzZXIiOiI4ODg4ODg4IiwiZXhwaXJlIjotMSwic2lnbiI6IjVKT0d1VmJPL2VyelVibjc5N2xOUkdhMU1qMzA5bi9oTFNqRjdjemJWQkk9In0=';
      const token =
        'eyJhcHBJZCI6IjY0MDg0YThhODcxZGY2N2ExMTc3MmM2NSIsImFwcFVzZXIiOiI5OTk5OTk5IiwiZXhwaXJlIjotMSwic2lnbiI6InlBV3pid3orS1FrUUdRb3JIWU5RL1RNRTJpa093cURBSUozNzVHN3BVMzQ9In0=';
      // const token = 'eyJhcHBJZCI6IjY0MDg0YThhODcxZGY2N2ExMTc3MmM2NSIsImFwcFVzZXIiOiIxMjM0NTQzMjEiLCJleHBpcmUiOi0xLCJzaWduIjoiNTZjZUZrVWVJSjhpcUkzdENtQ0dRWFUvRldEdkFCMXNJZm5FeVhiK0plQT0ifQ==';
      setToken({
        token,
      });
      try {
        await IMSDK_Init({
          token,
          // userId: '8888888',
          userId: '9999999',
          // userId: '123454321',
        });

        microShared.setToken(token);

        this.$router.push('/');
        await this.clearBreadCrumb();
        renderProcess.showMainWindow();
      } catch (e) {}
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
