<template>
  <div id="app">
    <MainLayout />
  </div>
</template>

<script>
import MainLayout from './components/layout'

export default {
  name: 'App',
  components: {
    MainLayout
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
