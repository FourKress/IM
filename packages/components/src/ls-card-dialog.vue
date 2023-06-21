<template>
  <div
    class="ls-card-dialog"
    :style="{ backgroundColor: backgroundColor }"
    v-if="visible"
    @click.self.stop="handleClose"
  >
    <slot></slot>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { MODAL_DIALOG_TYPE, setHeaderClassName } from '@lanshu/utils';

export default {
  name: 'Ls-card-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    isModalClose: {
      type: Boolean,
      default: true,
    },
    backgroundColor: {
      type: String,
      default: 'transparent',
    },
  },
  computed: {
    ...mapGetters('globalStore', ['modalDialog']),
  },
  watch: {
    visible(val) {
      // 实时设置全局的dialog、右键菜单的打开状态
      this.setModalDialog({
        type: MODAL_DIALOG_TYPE.IS_MODAL,
        visible: val,
      });
      if (val) {
        // 打开时，头部禁止拖动
        setHeaderClassName('no-drag');
        document.querySelector('#lanshu-app').appendChild(this.$el);
      } else {
        const cardDialogDom = document.querySelectorAll('.ls-card-dialog');
        // 关闭时，恢复头部拖动功能
        if (cardDialogDom.length === 1) {
          setHeaderClassName('drag');
        }
        this.handleRemoveDom();
      }
    },

    modalDialog: {
      deep: true,
      handler(val) {
        // 在特定情况下，根据全局的dialog状态，执行关闭处理
        if (val.type === MODAL_DIALOG_TYPE.IS_MODAL && !val.visible) {
          this.handleEmit();
        }
      },
    }
  },
  methods: {
    ...mapActions('globalStore', ['setModalDialog']),

    handleEmit() {
      this.$emit('close');
      this.$emit('update:visible', false);
    },
    handleClose() {
      if (!this.isModalClose) return;
      this.handleEmit();
    },
    handleRemoveDom() {
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.ls-card-dialog {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 990;
  transition: all 0.3s;
}
</style>
