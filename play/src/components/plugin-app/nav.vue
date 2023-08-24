<template>
  <div class="plugin-app-nav">
    <div class="title">应用</div>
    <div class="container">
      <div
        class="item"
        v-for="item in 2"
        :key="item"
        @click="handleOpenApp(item)"
      >
        <img class="icon" src="./logo.jpg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'PluginAppNav',
  components: {},
  computed: {
    ...mapGetters('IMStore', ['mainSessionWindow']),
  },
  watch: {
    mainSessionWindow: {
      deep: true,
      handler(val) {
        if (val.sessId) {
          console.log('PluginOptPanel');
          this.setOpenMicroApp({
            appName: 'PluginAppNav',
            visible: true,
          });
        }
      },
    },
  },
  mounted() {
    this.$emit('update:pluginStyle', {
      flex: '1 1 0',
      minWidth: '60px',
      maxWidth: '60px',
    });
  },
  methods: {
    ...mapActions('globalStore', ['setOpenMicroApp']),

    handleOpenApp(item) {
      this.setOpenMicroApp({
        appName: item === 1 ? 'SelfPlugin' : 'SelfPluginB',
        visible: true,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.plugin-app-nav {
  width: 60px;
  max-width: 60px;
  min-width: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $bg-white-color;
  position: relative;

  .title {
    height: 48px;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    color: $main-text-color;
    font-weight: bold;
    border-bottom: 1px solid $split-line-color;
  }

  .container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .item {
      width: 50px;
      height: 50px;
      min-height: 50px;
      background-color: $bg-white-color;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      cursor: pointer;
      overflow: hidden;

      .icon {
        display: block;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        overflow: hidden;
      }

      &.active {
        background-color: #e9f2ff;
      }

      &:hover {
        background-color: #e9f2ff;
      }
    }
  }
}
</style>
