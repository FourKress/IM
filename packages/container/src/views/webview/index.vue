<template>
  <webview class="webview" v-if="src" :src="src" allowpopups></webview>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';

export default {
  name: 'WebviewPage',
  data() {
    return {
      src: '',
    };
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
    const webview = document.querySelector('.webview');
    renderProcess.webviewOpenUrl((event, url) => {
      webview.src = url;
    });
  },
  methods: {
    getSrc() {
      this.src = this.$route?.meta?.webviewSrc;
    },
  },
};
</script>

<style scoped lang="scss">
.webview {
  display: flex;
}
</style>
