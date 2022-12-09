<template>
  <div id="client-layout" v-if="!isLogin">
    <Header />
    <ContainerView />
  </div>
  <router-view v-else class="router-view" />
</template>

<script>
import { ContainerView } from '@lanshu/container';
import Header from './header';

export default {
  name: 'MainLayout',
  components: {
    Header,
    ContainerView,
  },
  computed: {
    isLogin() {
      const { isLogin = false } = this.$route.meta;
      return isLogin;
    },
  },
};
</script>

<style scoped lang="scss">
#client-layout {
  width: 100vw;
  min-width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
