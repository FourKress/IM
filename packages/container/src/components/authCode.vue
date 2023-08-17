<template>
  <span>
    <div class="verification-code">
      <el-input
        :ref="`codeRef_${index}`"
        v-for="(code, index) in codeList"
        maxLength="1"
        minLength="1"
        :key="index"
        class="code-item"
        :class="isBgColor && 'bg-color'"
        type="text"
        @input="(val) => handleInput(val, index)"
        @keydown.native="(event) => handleBackspace(event, index)"
        v-model="codeList[index]"
      />
    </div>

    <slot></slot>

    <div class="send-code">
      <span class="left" :class="timer && 'disabled'" @click="sendCode">
        重新获取验证码{{ timer ? ` ${countdown}S` : '' }}
      </span>
    </div>
  </span>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Apis } from '@lanshu/utils';

export default {
  name: 'authCode',
  props: {
    phoneNum: {
      type: [String, Number],
      default: '',
    },
    newPhoneNum: {
      type: [String, Number],
      default: '',
    },
    scene: {
      type: String,
      required: true,
    },
    isBgColor: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      codeList: ['', '', '', ''],
      timer: null,
      countdown: 0,
    };
  },
  computed: {
    ...mapGetters('globalStore', ['codeCountdown']),
  },
  watch: {
    codeList(val) {
      const active = val.every((d) => d);
      const codes = val
        .map((d) => d)
        .join('')
        .toString();
      // 输入完毕自动触发
      this.$emit('inputComplete', active, active ? codes : '');
    },
  },
  created() {
    this.initData();
  },
  mounted() {
    this.$refs[`codeRef_0`][0].focus();
  },
  methods: {
    ...mapActions('globalStore', ['setCodeCountdown']),

    initData() {
      // 读取历史倒计时，存在时继续计时，不存在则开始计时
      this.countdown = this.codeCountdown;
      if (this.countdown) {
        this.handleCountdown();
      } else {
        this.sendCode();
      }
    },

    handleBackspace(event, index) {
      if (event.key === 'Backspace') {
        // 为清除到第一位时，前一位输入框自动聚焦
        if (index >= 0) {
          this.codeList = this.codeList.map((d, i) => (i === index ? '' : d));
          this.$refs[`codeRef_${Math.max(index - 1, 0)}`][0].focus();
        }
        event.preventDefault();
      }
    },

    handleInput(val, index) {
      if (!val) return;
      // 为输入到最后一位时，下一位输入框自动聚焦
      if (index !== 3) {
        this.$refs[`codeRef_${index + 1}`][0].focus();
      }
    },
    handleClearInterval() {
      if (this.timer) {
        clearInterval(this.timer);
        this.countdown = 0;
      }
    },
    // 保存倒计时
    handleSaveCountdown() {
      this.countdown && this.setCodeCountdown(this.countdown);
    },
    handleCountdown() {
      this.timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.countdown = 0;
          this.handleClearInterval();
          this.timer = null;
        }
      }, 1000);
    },
    async sendCode() {
      if (this.timer || this.countdown) return;
      this.handleClearCode();
      this.countdown = 60;
      await Apis.accountSendCaptcha({
        phone: this.newPhoneNum || this.phoneNum,
        scene: this.scene,
      });
      this.handleCountdown();
    },
    handleClearCode() {
      this.codeList = this.codeList.map(() => '');
      // 清除验证码时，自动聚焦
      this.$refs[`codeRef_0`] && this.$refs[`codeRef_0`][0].focus();
    },
  },
};
</script>

<style scoped lang="scss">
.verification-code {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 48px;
  box-sizing: border-box;

  .code-item {
    width: 54px;
    height: 48px;
    border-radius: 6px;

    &.bg-color {
      ::v-deep .el-input__inner {
        background-color: $bg-hover-grey-color;
      }
    }

    ::v-deep .el-input__inner {
      width: 100%;
      height: 48px;
      line-height: 24px;
      font-size: 22px;
      outline: none;
      padding: 12px 20px;
      box-sizing: border-box;
      color: $main-text-color;
      text-align: center;
      font-weight: bold;
      border: 1px solid $bg-white-color;
      background-color: $bg-white-color;

      &:focus {
        border-color: $primary-color;
      }
    }
  }
}

.send-code {
  margin: 20px 0;
  font-size: 12px;
  color: $primary-hover-color;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .left {
    cursor: pointer;
    &.disabled {
      color: $tips-text-color;
      cursor: default;
    }
  }
}
</style>
