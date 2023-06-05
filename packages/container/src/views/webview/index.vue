<template>
  <div class="webview-container">
    <webview class="webview" v-if="src" :src="src" allowpopups></webview>
    <div class="btn" v-if="historySrcList.length" @click="handleBack">
      <LsIcon render-svg icon="ls-icon-icon_fanhui_hover" width="28" height="28"></LsIcon>
    </div>
  </div>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';
import { LsIcon } from '@lanshu/components';

export default {
  name: 'WebviewPage',
  data() {
    return {
      src: '',
      historySrcList: [],
    };
  },
  components: {
    LsIcon,
  },
  watch: {
    $route() {
      this.getSrc();
    },
  },
  created() {
    this.getSrc();
  },
  mounted() {
    renderProcess.webviewOpenUrl((event, url) => {
      console.log('webviewOpenUrl', url);
      this.historySrcList.push(this.src);
      this.src = url;
    });
  },
  methods: {
    getSrc() {
      this.historySrcList = [];
      this.src = this.$route?.meta?.webviewSrc;
    },
    handleBack() {
      console.log('3122322');
      this.src = this.historySrcList.pop();
    },
  },
};
</script>

<style scoped lang="scss">
.webview-container {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

  .webview {
    flex: 1;
    display: flex;
  }

  .btn {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    z-index: 9;
    opacity: 0.6;
  }
}
</style>
