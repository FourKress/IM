<template>
  <div class="plugin-app-nav">
    <div class="title">应用</div>
    <div class="container">
      <div
        class="item"
        :class="activeMicroApp === item.key && 'active'"
        v-for="item in microAppList"
        :key="item.key"
        @click="handleOpenApp(item)"
      >
        <img class="icon" src="../../assets/logo.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'PluginAppNav',
  props: {
    visible: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    ...mapGetters('IMStore', ['mainSessionWindow']),
    ...mapGetters('pluginStore', ['activeMicroApp']),
  },
  data() {
    return {
      microAppList: [
        {
          key: 'SmartAdvocacyMicroApp',
          title: '智慧宣传',
          path: '/spokesman',
          url: 'https://advocacy.lanshusoft.com/zhxc/',
          // url: 'http://localhost:3006/',
        },
      ],
    };
  },
  watch: {
    mainSessionWindow: {
      deep: true,
      handler() {
        this.openAppNav();
      },
    },
  },
  mounted() {
    this.setMicroAppList(this.microAppList);
    this.openAppNav();
    this.$emit('update:pluginStyle', {
      flex: '1 1 0',
      minWidth: '61px',
      maxWidth: '61px',
    });
  },
  methods: {
    ...mapActions('globalStore', ['setCurrentMicroApp', 'setMicroAppList']),
    ...mapActions('pluginStore', ['setActiveMicroApp']),

    openAppNav() {
      if (this.mainSessionWindow?.sessId && !this.visible) {
        this.setCurrentMicroApp({
          appKey: 'PluginAppNav',
          visible: true,
        });
      }
    },

    handleOpenApp(item) {
      const { key } = item;
      this.setActiveMicroApp(key);
      this.setCurrentMicroApp({
        appKey: key,
        visible: true,
      });
    },
  },
  beforeDestroy() {
    this.setActiveMicroApp('');
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
    box-sizing: border-box;
    border-bottom: 1px solid $split-line-color;
  }

  .container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 5px;
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
        &:hover {
          background-color: #e9f2ff;
        }
      }

      &:hover {
        background-color: $bg-hover-grey-color;
      }
    }
  }
}
</style>
