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
        <img class="icon" :src="item.icon" alt="" />
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
    ...mapGetters('globalStore', ['systemUserInfo']),

    appList() {
      return this.systemUserInfo?.appList?.filter(
        (d) => d?.displayArea === 'right',
      );
    },
  },
  data() {
    return {
      microAppList: [],
    };
  },
  watch: {
    mainSessionWindow: {
      deep: true,
      handler(val) {
        this.changeAppNav(!!val?.sessId);
      },
    },

    appList: {
      deep: true,
      handler() {
        this.initApp();
      },
    },
  },
  mounted() {
    this.initApp();
    if (!this.microAppList.length) return;
    this.setMicroAppList(this.microAppList);
    this.changeAppNav(true);
  },
  methods: {
    ...mapActions('globalStore', ['setCurrentMicroApp', 'setMicroAppList']),
    ...mapActions('pluginStore', ['setActiveMicroApp']),

    initApp() {
      this.microAppList = this.appList.map((d) => {
        const { appName, appCode, defaultUrl, defaultPath, icon } = d;
        return {
          key: appCode,
          title: appName,
          path: defaultPath,
          url: defaultUrl,
          icon,
        };
      });
    },

    changeAppNav(visible) {
      if (!this.microAppList.length) return;

      if (visible) {
        if (this.mainSessionWindow?.sessId && !this.visible) {
          this.setCurrentMicroApp({
            appKey: 'PluginAppNav',
            visible: true,
          });
          this.$emit('update:pluginStyle', {
            flex: '1 1 0',
            minWidth: '61px',
            maxWidth: '61px',
          });
        }
      } else {
        this.setCurrentMicroApp({
          appKey: 'PluginAppNav',
          visible: false,
        });
        this.$emit('update:pluginStyle', {
          flex: '1 1 0',
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
