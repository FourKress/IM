<template>
  <LsDialog
    ref="confirmDialog"
    :title="title"
    :visible.sync="visible"
    :confirmBtnText="confirmBtnText"
    :cancelBtnText="cancelBtnText"
    @confirm="dialogSure"
    @cancel="dialogCancel"
    @close="dialogClose"
    :showCancelBtn="showCancelBtn"
  >
    <div slot='content'>
      <Expand v-if="render" :render="render"></Expand>
      <div v-if="content" v-html="content"></div>
    </div>
  </LsDialog>
</template>
<script>
import Expand from './expand';
import LsDialog from '../ls-dialog';

export default {
  components: { Expand, LsDialog },
  data() {
    return {
      title: '提示',
      visible: false,
      confirmBtnText: null,
      cancelBtnText: null,
      showCancelBtn: true,
      promiseStatus: null,
      render: undefined,
      content: '',
    };
  },
  methods: {
    open(data = {}) {
      const {
        title = '提示',
        confirmBtnText = '确定',
        cancelBtnText = '取消',
        showCancelBtn = true,
        render = undefined,
        content = '',
      } = data;
      this.title = title;
      this.confirmBtnText = confirmBtnText;
      this.cancelBtnText = cancelBtnText;
      this.showCancelBtn = showCancelBtn;
      this.render = render;
      this.content = content;

      this.visible = true;

      return new Promise((resolve, reject) => {
        this.promiseStatus = { resolve, reject };
      });
    },

    dialogSure() {
      this.promiseStatus && this.promiseStatus.resolve(true);
    },
    dialogCancel() {
      this.promiseStatus && this.promiseStatus.reject({ isCancel: true });
    },
    dialogClose() {
      this.promiseStatus && this.promiseStatus.reject({ isClose: true });
    },
  },
  watch: {
    visible(value) {
      if (!value && this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    },
  },
};
</script>
<style lang="less" scoped></style>
