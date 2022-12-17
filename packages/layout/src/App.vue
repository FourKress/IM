<template>
  <div id="app">
    <MainLayout />
  </div>
</template>

<script>
import MainLayout from './components/layout';
import { IMMixin } from '@lanshu/im';

export default {
  name: 'App',
  mixins: [IMMixin],
  components: {
    MainLayout,
  },
  created() {
    this.IM_init();
  },
  methods: {},
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
  scroll-behavior:smooth;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform: translate3d(0, 0, 0);
  color: $main-text-color;

  //min-width: 1366px;
  height: 100%;

  overflow: hidden;
  //width: 1680px;
  //height: 1050px;

  //width: 1034px;
  //height: 776px;
  box-sizing: border-box;
  background: #d8d8d8;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  //border: 1px solid #FFFFFF;
}
</style>
