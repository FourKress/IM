<template>
  <div id="client-im">
    <ImView :session='mainSessionWindow' isMainSession />
    <template v-for="(item, index) in sessionWindowList">
      <ImView :session='item' />
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { renderProcess } from '@lanshu/render-process';
import ImView from './im-view';

export default {
  name: 'MainIM',
  components: {
    ImView,
  },
  data() {
    return {
      filePath: '',
      imgB64: '',
    };
  },
  computed: {
    ...mapGetters('global', ['mainSessionWindow']),
    ...mapGetters('global', ['sessionWindowList']),
  },
  created() {

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
  border-left: 1px solid #eaeaea;
  box-shadow: 4px 0px 10px -4px rgb(51 51 51 / 10%);
  min-width: 500px;
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
  transform: translate3d(0, 0, 0);
}
</style>
