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
import { MODAL_DIALOG_TYPE } from '@lanshu/utils';

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
      console.log('Ls-card-dialog', val)
      this.setModalDialog({
        type: MODAL_DIALOG_TYPE.IS_MODAL,
        visible: val,
      });
      if (val) {
        this.setClassName('no-drag');
        document.querySelector('#lanshu-app').appendChild(this.$el);
      } else {
        console.log('2222');
        const cardDialogDom = document.querySelectorAll('.ls-card-dialog');
        if (cardDialogDom.length === 1) {
          this.setClassName('drag');
        }
        this.handleRemoveDom();
      }
    },

    modalDialog: {
      deep: true,
      handler(val) {
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
    setClassName(className) {
      const hearerSearch = document.querySelector('.header-container');
      if (hearerSearch) {
        // 控制头部拖拽效果
        hearerSearch.className = `${className}`;
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
