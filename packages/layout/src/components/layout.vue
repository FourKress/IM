<template>
  <div id="client-layout">
    <Header />
    <ContainerView />
  </div>
</template>

<script>
import { ContainerView } from '@lanshu/container';
import Header from './header';


export default {
  name: 'MainLayout',
  components: {
    Header,
    ContainerView
  },
};
</script>

<style scoped lang="scss">
#client-layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
