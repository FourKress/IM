<template>
  <div id="client-header">
    <span>我是头部</span>
    <span @click="handleSetTitle">设置title</span>
  </div>
</template>

<script>
export default {
  name: 'MainHeader',
  methods: {
    handleSetTitle() {
      window?.electronAPI.setTitle('我设置的title');
    },
  },
};
</script>

<style scoped lang="scss">
#client-header {
  width: 100%;
  height: 50px;
  background-color: aliceblue;
}
</style>
