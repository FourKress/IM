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
  components: {
    MainLayout,
  },
  mixins: [IMMixin],
  created() {
    // this.IM_init(
    //   // 'eyJhcHBJZCI6IjYzNmNhMzFiZDRjYTM1MmJmMWZmNjQxZSIsImFwcFVzZXIiOiIxMjM0NTQzMjEiLCJleHBpcmUiOi0xLCJzaWduIjoiZWpzcWNBS1RaV2lNaThCdzZFZlAzcmRMOERYTzFyQytzbzFLQjd5bWxqOD0ifQ==',
    //   'eyJhcHBJZCI6IjYzNmNhMzFiZDRjYTM1MmJmMWZmNjQxZSIsImFwcFVzZXIiOiI4ODg4ODg4IiwiZXhwaXJlIjotMSwic2lnbiI6IlByTkhyVlRkTjNZL3RqWmkrV1pGejNIYndNLzBhc2VKS1RJMkgrRGlpaE09In0=',
    // );
  },
  methods: {},
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html, body {
  height: 100%;
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
  background: #D8D8D8;
  box-shadow: 0px 4px 20px 0px rgba(0,0,0,0.1);
  border-radius: 12px;
  //border: 1px solid #FFFFFF;


}
</style>
