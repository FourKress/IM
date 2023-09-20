<template>
  <div class="ls-dialog" v-if="visible">
    <div class="ls-dialog-panel" :style="{ width: `${width}px` }">
      <div class="ls-dialog-panel-top">{{ title }}</div>
      <div class="ls-dialog-panel-content">
        <slot name="content"></slot>
      </div>
      <div class="ls-dialog-panel-footer">
        <slot name="footer">
          <div class="cancel btn" v-if="showCancelBtn" @click="handleCancel">
            {{ cancelBtnText }}
          </div>
          <div class="confirm btn" @click="handleConfirm">
            {{ confirmBtnText }}
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Ls-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    title: {
      type: String,
      default: '提示',
    },
    confirmBtnText: {
      type: String,
      default: '确定',
    },
    cancelBtnText: {
      type: String,
      default: '取消',
    },
    showCancelBtn: {
      type: Boolean,
      default: true,
    },
    width: {
      type: Number,
      default: 369,
    },
  },
  data() {
    return {
      showDialog: true,
    };
  },
  methods: {
    handleClose() {
      this.$emit('close');
      this.$emit('update:visible', false);
    },
    handleCancel() {
      this.$emit('cancel');
      this.$emit('update:visible', false);
    },
    handleConfirm() {
      this.$emit('confirm');
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style scoped lang="scss">
.ls-dialog {
  width: 100%;
  height: 100%;
  background: rgba(51, 51, 51, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  transition: all 0.3s;

  user-select: none;

  &-panel {
    width: 369px;
    background: $bg-white-color;
    box-shadow: 0px 4px 20px 0px rgba(51, 51, 51, 0.1);
    border-radius: 12px;
    border: 1px solid $split-line-color;
    box-sizing: border-box;
    padding: 0 46px;

    &-top {
      width: 100%;
      height: 25px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: $main-text-color;
      line-height: 25px;
      margin: 30px auto;
    }

    &-content {
      //height: 60px;
      font-size: 14px;
      color: $main-text-color;
      line-height: 20px;
      text-align: center;

      .link {
        color: $primary-hover-color;
        cursor: pointer;
      }
    }

    &-footer {
      width: 100%;
      height: 34px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 30px auto;

      .btn {
        width: 88px;
        height: 34px;
        text-align: center;
        line-height: 34px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        background: $bg-grey-color;
        border-radius: 6px;
        margin: 0 5px;

        &.cancel {
          color: $minor-text-color;
        }

        &.confirm {
          color: $primary-color;
        }
      }
    }
  }
}
</style>
