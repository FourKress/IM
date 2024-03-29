<template>
  <div class="change-phoneNum">
    <div class="main-wrap">
      <div class="panel-container">
        <div class="back-icon">
          <LsIcon
            v-if="[1, 2].includes(step)"
            render-svg
            width="30"
            height="20"
            icon="a-icon_zuobian2x"
            @click="goBack"
          ></LsIcon>
        </div>

        <div class="title">{{ title }}</div>

        <div class="title-tips">
          {{ titleTips }}
        </div>

        <div class="input-panel">
          <template v-if="[0, 2].includes(step)">
            <AuthCode
              ref="authCode"
              isBgColor
              :phoneNum="phoneNum"
              :newPhoneNum="newPhoneNum"
              :scene="SCENE_TYPE.IS_UPDATE_PHONE"
              @inputComplete="handleInputComplete"
            />

            <!--          <div class="recover-account" v-if="step === 0">-->
            <!--            <span>手机号已停用？</span>-->
            <!--            <span class="link" @click="openDialog">-->
            <!--              <span>去找回</span>-->
            <!--              <i class="el-icon-arrow-right"></i>-->
            <!--            </span>-->
            <!--          </div>-->
          </template>

          <template v-if="step === 1">
            <el-form :model="form" :rules="rules" ref="form" label-width="0px">
              <div class="phone">
                <el-form-item label="" prop="phoneNum">
                  <el-input
                    type="text"
                    ref="newPhoneNum"
                    maxlength="13"
                    placeholder="请输入新手机号码"
                    v-model="form.phoneNum"
                  />
                </el-form-item>
              </div>
            </el-form>

            <div
              class="submit-btn"
              :class="validPhoneNum && 'active'"
              @click="handleAuth"
            >
              下一步
            </div>
          </template>

          <template v-if="step == 3">
            <div class="success">
              <div class="success-icon">
                <LsIcon
                  render-svg
                  width="53"
                  height="53"
                  icon="ls-icon-a-icon_genghuanchenggong2x1"
                ></LsIcon>
              </div>
              <div class="title">手机号码更换成功</div>

              <div class="title-tips">
                {{ countdown }}s后客户端将自动退出，请使用手机号码{{
                  getPhoneText(this.newPhoneNum)
                }}重新登录
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  dataEncryption,
  formatPhoneNum,
  unFormatPhoneNum,
  PhoneNumMixins,
  RecoverAccountMixins,
  Apis,
  SCENE_TYPE,
} from '@lanshu/utils';
import { ClientLogOut } from '@lanshu/im';
import { LsIcon } from '@lanshu/components';
import AuthCode from '../../../components/authCode';
import { mapGetters } from 'vuex';

export default {
  name: 'Change-phoneNum',
  components: {
    AuthCode,
    LsIcon,
  },
  mixins: [RecoverAccountMixins, PhoneNumMixins],
  data() {
    return {
      SCENE_TYPE,
      phoneNum: '',
      newPhoneNum: '',
      step: 0,
      title: '请输入原手机验证码',
      titleTips: '',

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
      countdown: 5,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['userProfile']),
  },
  watch: {
    step(val) {
      const phoneMap = {
        0: this.userProfile.phone,
        2: this.newPhoneNum,
      };
      this.phoneNum = phoneMap[val];
      this.form.phoneNum = phoneMap[val];

      const titleMap = {
        0: '请输入原手机验证码',
        1: '请输入新手机号码',
        2: '请输入手机验证码',
      };
      const titleTipsMap = {
        0: `4位数的验证码已发送至手机 ${this.getPhoneText(
          this.phoneNum,
        )}，有效期5分钟`,
        1: '你正在修改登录手机号，修改后请使用新手机号码登录',
        2: `4位数的验证码已发送至手机 ${this.getPhoneText(
          this.newPhoneNum,
        )}，有效期5分钟`,
      };
      this.title = titleMap[val];
      this.titleTips = titleTipsMap[val];
    },
    'form.phoneNum': function (val, oldVal) {
      const phoneNum = formatPhoneNum(val, oldVal);
      if (phoneNum) {
        this.form.phoneNum = phoneNum;
      }
    },
  },
  async created() {
    const { phone } = this.userProfile;
    this.phoneNum = phone;
    this.form.phoneNum = phone;
    this.titleTips = `验证码已发送至手机 ${this.getPhoneText(
      this.phoneNum,
    )}，有效期5分钟`;
  },
  methods: {
    async checkCaptcha(codes) {
      await Apis.accountCheckCaptcha({
        phone: this.phoneNum,
        captcha: codes,
        scene: this.SCENE_TYPE.IS_UPDATE_PHONE,
      });
    },

    getPhoneText(phoneNum) {
      return dataEncryption(phoneNum);
    },
    async handleInputComplete(flag, codes) {
      if (flag) {
        if (this.step === 0) {
          try {
            await this.checkCaptcha(codes);
          } catch (e) {
            this.$refs.authCode.handleClearCode();
            return;
          }
          this.step = 1;
          this.form.phoneNum = '';
          this.$nextTick(() => {
            this.$refs.newPhoneNum.focus();
          });
        } else {
          try {
            await this.checkCaptcha(codes);
          } catch (e) {
            this.$refs.authCode.handleClearCode();
            return;
          }
          await Apis.accountUpdatePhone({
            newPhone: this.newPhoneNum,
          });
          const loadingInstance = this.$loading({
            lock: true,
            text: '',
            spinner: 'none',
            background: 'transparent',
          });

          this.step = 3;
          this.timer = setInterval(async () => {
            this.countdown--;
            if (this.countdown <= 0) {
              clearInterval(this.timer);
              this.countdown = 0;
              loadingInstance.close();
              await ClientLogOut();
            }
          }, 1000);
        }
      }
    },
    goBack() {
      this.step -= 1;
    },

    async handleAuth() {
      if (!this.validPhoneNum) return;
      this.newPhoneNum = unFormatPhoneNum(this.form.phoneNum);
      this.step = 2;
    },
  },
  beforeDestroy() {
    // 清理和保存未结束的定时器
    if ([0, 2].includes(this.step)) {
      this.$refs.authCode.handleSaveCountdown();
      this.$refs.authCode.handleClearInterval();
    }
  },
};
</script>

<style scoped lang="scss">
.change-phoneNum {
  flex: 1;
  height: calc(100% - 60px);
  display: flex;
  align-items: center;
  justify-content: center;

  .main-wrap {
    height: 448px;
  }

  .panel-container {
    width: 360px;

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
      margin-top: 20px;
    }

    .title-tips {
      font-size: 14px;
      color: $tips-text-color;
      margin-top: 8px;
    }

    .input-panel {
      margin: 60px 0 126px 0;

      .phone,
      .submit-btn {
        width: 100%;
        height: 60px;
        line-height: 60px;
        border-radius: 6px;
        box-sizing: border-box;
      }

      .submit-btn {
        text-align: center;
        color: $bg-white-color;
        background-color: #87a1cd;
        cursor: pointer;
        margin-bottom: 60px;

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
          padding: 18px 26px;
          box-sizing: border-box;
          color: $main-text-color;

          &::placeholder {
            color: $tips-text-color;
            font-size: 18px;
          }
        }
      }
    }

    .recover-account {
      font-size: 12px;
      font-weight: normal;
      color: $main-text-color;

      .link {
        color: $primary-hover-color;
        cursor: pointer;
      }
    }

    .success {
      display: flex;
      flex-direction: column;
      align-items: center;

      .success-icon {
        width: 53px;
        height: 53px;
      }

      .title-tips {
        width: 388px;
      }
    }
  }
}
</style>
