<template>
  <div id="client-im">
    <div class="view-container">我是IM</div>
    <div @click="handleClick">选择文件</div>
    {{ filePath }}

    <div @click="handleScreenshots">截图</div>
    <img v-if="imgB64" :src="imgB64" alt="" />
  </div>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';

export default {
  name: 'MainIM',
  components: {},
  data() {
    return {
      filePath: '',
      imgB64: '',
    };
  },
  methods: {
    async handleClick() {
      const filePath = await renderProcess.openFile();
      this.filePath = filePath;
    },
    handleScreenshots() {
      renderProcess.startScreenshots();
      renderProcess.getScreenshots((event, value) => {
        if (value) {
          this.imgB64 = `data:image/png;base64,${value}`;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
#client-im {
  flex: 1;
  height: 100%;
  background-color: blueviolet;
}

img {
  width: 150px;
  height: 150px;
}
</style>
