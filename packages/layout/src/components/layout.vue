<template>
  <div id="client-layout" v-if="!isFull && userInfo.userId">
    <Header />
    <ContainerView />
  </div>
  <router-view v-else class="router-view" />
</template>

<script>
import { ContainerView } from '@lanshu/container';
import Header from './header';
import { mapGetters } from 'vuex';

export default {
  name: 'MainLayout',
  components: {
    Header,
    ContainerView,
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo']),

    isFull() {
      const { isFull = false } = this.$route.meta;
      return isFull;
    },
  },
};
</script>

<style scoped lang="scss">
#client-layout {
  width: 100%;
  min-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
