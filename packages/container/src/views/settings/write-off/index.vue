<template>
  <div class="write-off" ref="WriteOff">
    <div class="main-wrap">
      <div
        class="panel-container"
        :style="{ width: step === 2 ? '360px' : '500px' }"
      >
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
          <template v-if="step === 0">
            <div class="check-list">
              <div class="item" v-for="(item, index) in checkList" :key="index">
                <div class="label">{{ item.label }}</div>
                <div class="tips">{{ item.tips }}</div>
              </div>
            </div>

            <div class="checkbox-row">
              <el-checkbox v-model="isNext">
                <span>我已经阅读并同意上记条款</span>
              </el-checkbox>
            </div>
          </template>

          <template v-if="step === 1">
            <div class="select-list">
              <el-checkbox-group v-model="selectValue">
                <div
                  class="item"
                  v-for="(item, index) in selectList"
                  :key="index"
                >
                  <el-checkbox :label="item">
                    <span>{{ item }}</span>
                  </el-checkbox>
                  <el-input
                    v-if="index === selectList.length - 1"
                    class="textarea"
                    type="textarea"
                    resize="none"
                    :rows="4"
                    placeholder="请输入内容"
                    :maxlength="100"
                    show-word-limit
                    v-model="textarea"
                  ></el-input>
                </div>
              </el-checkbox-group>
            </div>
          </template>

          <div
            v-if="[0, 1].includes(step)"
            class="submit-btn"
            :class="isNext && 'active'"
            @click="handleNext"
          >
            下一步
          </div>

          <template v-if="step === 2">
            <AuthCode
              ref="authCode"
              isBgColor
              :phoneNum="phoneNum"
              :scene="SCENE_TYPE.IS_UPDATE_PHONE"
              @inputComplete="handleInputComplete"
            />

            <div
              class="submit-btn"
              :class="isNext && 'active'"
              @click="handleConfirmWriteOff"
            >
              确认注销
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
              <div class="title">注册申请已提交</div>

              <div class="title-tips">
                <div>1、此次注销您有7天犹豫期，账号数据将保留7天</div>
                <div>2、犹豫期内您可以使用此账号登录，撤销此次注销</div>
                <div>3、7天后，账号数据将全部删除，无法撤销</div>
                <div>{{ countdown }}s后客户端将自动退出</div>
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
  RecoverAccountMixins,
  Apis,
  SCENE_TYPE,
} from '@lanshu/utils';
import { ClientLogOut } from '@lanshu/im';
import { LsIcon } from '@lanshu/components';
import AuthCode from '../../../components/authCode';
import { mapGetters } from 'vuex';

export default {
  name: 'WriteOff',
  components: {
    AuthCode,
    LsIcon,
  },
  mixins: [RecoverAccountMixins],
  data() {
    return {
      SCENE_TYPE,
      phoneNum: '',
      step: 0,
      title: '申请注销账号',
      titleTips: '为保证您的账号安全，在您提交注销申请前，请先阅读以下须知',

      countdown: 5,
      isNext: false,

      checkList: [
        {
          label: '1.账号处于安全状态',
          tips: '账号正常使用，无被盗风险，1个月内未换绑手机号',
        },
        {
          label: '2.账号已解除三方绑定',
          tips: '需提前解除与其他产品的授权登录绑定关系',
        },
        {
          label: '3.无未完结的应用订单',
          tips: '如在北象的应用内，在订单完结前，均无法注销账号',
        },
        {
          label: '4.已知晓注销操作所产生的后果',
          tips: '账号注销后，账号无法使用，且所有数据均将删除，该操作无法撤销',
        },
      ],
      selectList: [
        '担心个人信息泄露',
        '使用体验不好',
        '使用其他的替代品',
        '对我没有帮助',
        '其他原因',
      ],
      selectValue: [],
      textarea: '',
    };
  },
  computed: {
    ...mapGetters('IMStore', ['userProfile']),
  },
  watch: {
    step(val) {
      this.isNext = false;
      this.selectValue = [];

      const titleMap = {
        0: '申请注销账号',
        1: '请选择您注销账号的原因',
        2: '请输入手机验证码',
      };
      const titleTipsMap = {
        0: '为保证您的账号安全，在您提交注销申请前，请先阅读以下须知',
        1: '您的选择有助于我们改进产品，为用户提供更好的产品体验',
        2: `4位数的验证码已发送至手机 ${this.getPhoneText(
          this.phoneNum,
        )}，有效期5分钟`,
      };
      this.title = titleMap[val];
      this.titleTips = titleTipsMap[val];

      this.$nextTick(() => {
        this.$refs.WriteOff.scrollTop = 0;
      });
    },
    selectValue(val) {
      if (val?.length) {
        this.isNext = true;
      } else {
        this.isNext = false;
      }
    },
  },
  async created() {
    const { phone } = this.userProfile;
    this.phoneNum = phone;
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
      if (flag && this.step === 2) {
        try {
          await this.checkCaptcha(codes);
          this.isNext = true;
        } catch (e) {
          this.isNext = false;
          this.$refs.authCode.handleClearCode();
        }
      }
    },
    goBack() {
      this.step -= 1;
    },

    async handleConfirmWriteOff() {
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
    },

    handleNext() {
      if (!this.isNext) return;
      this.step += 1;
    },
  },
  beforeDestroy() {
    // 清理和保存未结束的定时器
    if (this.step === 2) {
      this.$refs.authCode.handleSaveCountdown();
      this.$refs.authCode.handleClearInterval();
    }
  },
};
</script>

<style scoped lang="scss">
.write-off {
  flex: 1;
  height: calc(100% - 60px);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 24px 0 56px;

  .main-wrap {
    height: 672px;
  }

  .panel-container {
    margin: 0 auto;

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

      .check-list {
        width: 500px;
        height: 338px;
        background: $bg-hover-grey-color;
        border-radius: 8px;
        padding: 30px 0 30px 30px;
        box-sizing: border-box;

        .item {
          margin-bottom: 26px;

          .label {
            font-size: 16px;
            color: $main-text-color;
            font-weight: bold;
            padding-bottom: 6px;
          }

          .tips {
            font-size: 14px;
            color: $minor-text-color;
          }
        }
      }

      .select-list {
        .item {
          width: 100%;
          min-height: 50px;
          background: $bg-hover-grey-color;
          border-radius: 8px;
          padding: 14px 25px;
          box-sizing: border-box;
          margin-bottom: 20px;

          .textarea {
            margin-top: 14px;
          }
        }
      }

      .checkbox-row {
        margin: 30px 0;
      }

      .submit-btn {
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

    .success {
      display: flex;
      flex-direction: column;
      align-items: center;

      .success-icon {
        width: 53px;
        height: 53px;
      }

      .title-tips {
        width: 500px;
        margin-top: 38px;

        div {
          padding: 0 0 16px 110px;

          &:last-child {
            text-align: center;
            padding-top: 24px;
            padding-left: 0;
          }
        }
      }
    }
  }
}
</style>
