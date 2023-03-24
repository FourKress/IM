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
        type="text"
        @input="(val) => handleInput(val, index)"
        v-model="codeList[index]"
      />
    </div>

    <div class="send-code" :class="timer && 'disabled'" @click="resetCode">
      {{ timer ? `倒计时 ${countdown}S` : '重新获取验证码' }}
    </div>
  </span>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'authCode',
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
      // 输入完毕自动触发
      this.$emit('inputComplete', active);
    },
  },
  mounted() {
    // 读取历史倒计时
    this.countdown = this.codeCountdown;
    if (this.countdown) {
      this.handleCountdown();
    }
    this.$refs[`codeRef_0`][0].focus();
  },
  methods: {
    ...mapActions('globalStore', ['setCodeCountdown']),
    handleInput(val, index) {
      if (!val) return;
      if (index !== 3) {
        this.$refs[`codeRef_${index + 1}`][0].focus();
      }
    },
    handleClearInterval() {
      this.timer && clearInterval(this.timer);
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
    resetCode() {
      if (this.timer || this.countdown) return;
      this.codeList = this.codeList.map(() => '');
      this.countdown = 20;
      // TODO 请求接口倒计时
      this.handleCountdown();
    },
  },
};
</script>

<style scoped lang="scss">
.verification-code {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 60px;
  line-height: 60px;
  border-radius: 6px;
  box-sizing: border-box;

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

  &.disabled {
    color: $tips-text-color;
    cursor: default;
  }
}
</style>
