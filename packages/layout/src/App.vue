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
    //   'eyJhcHBJZCI6IjYzNmNhMzFiZDRjYTM1MmJmMWZmNjQxZSIsImFwcFVzZXIiOiIyMzQ1IiwiZXhwaXJlIjotMSwic2lnbiI6IlhmdkZ5VVJUMnU0YjZVaFYzSUU2ZjcvdHBTZ0NTRjlNTzVMaVBxV2x2NVE9In0=',
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform: translate3d(0, 0, 0);
  color: $main-text-color;
}
</style>
