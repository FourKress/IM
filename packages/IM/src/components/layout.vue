<template>
  <div id="client-im">
    <ImView
      :key="mainSessionWindow.sessId"
      :session="mainSessionWindow"
      isMainSession
    />
    <template v-for="item in sessionWindowList">
      <ImView :key="item.sessId" :session="item" />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ImView from './im-view';

export default {
  name: 'MainIM',
  components: {
    ImView,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('global', ['mainSessionWindow', 'sessionWindowList']),
  },
  created() {},
  methods: {

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
