<template>
  <div class="plugin-app-nav">
    <div class="title">应用</div>
    <div class="container">
      <div
        class="item"
        :class="activeMicroAppKey === item.key && 'active'"
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
import {
  SESSION_USER_TYPE,
  BASE_PLUGIN_TYPE,
  RightPluginVisibleHistoryMixins,
} from '@lanshu/utils';

export default {
  name: BASE_PLUGIN_TYPE.PLUGIN_APP_NAV,
  mixins: [RightPluginVisibleHistoryMixins],
  props: {
    visible: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    ...mapGetters('IMStore', ['mainSessionWindow']),
    ...mapGetters('globalStore', ['systemUserInfo', 'currentMicroApp']),

    appList() {
      return this.systemUserInfo?.appList?.filter(
        (d) => d?.displayArea === 'right',
      );
    },

    activeMicroAppKey() {
      const { appKey = '', visible = false } = this.currentMicroApp || {};
      return appKey === BASE_PLUGIN_TYPE.PLUGIN_APP_NAV || !visible
        ? ''
        : appKey;
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
      handler(val = {}) {
        const { sessId, toUserType } = val;
        const visible = !!sessId && toUserType === SESSION_USER_TYPE.IS_BASIC;
        this.changeAppNav(visible);
      },
    },

    appList: {
      deep: true,
      handler() {
        this.getMicroAppList();
      },
    },
  },
  mounted() {
    this.getMicroAppList();
  },
  methods: {
    ...mapActions('globalStore', ['setCurrentMicroApp', 'setMicroAppList']),

    getMicroAppList() {
      const microAppList = this.appList.map((d) => {
        const { appName, appCode, defaultUrl, defaultPath, icon } = d;
        return {
          key: appCode,
          title: appName,
          path: defaultPath,
          url: defaultUrl,
          icon,
        };
      });
      if (microAppList?.length) {
        this.microAppList = microAppList;
        this.setMicroAppList(this.microAppList);
      }
    },

    async changeAppNav(navVisible) {
      if (!this.microAppList.length) return;
      if (navVisible) {
        if (!this.visible) {
          this.handleNavStyle(true, {
            flex: '1 1 0',
            minWidth: '61px',
            maxWidth: '61px',
          });
        }

        const { curHistoryData } = await this.getRightPluginVisibleHistory();
        const { appKey = this.activeMicroAppKey, visible = false } =
          curHistoryData;
        this.setCurrentMicroApp({
          appKey,
          visible,
        });
      } else {
        this.handleNavStyle(false, {
          flex: '1 1 0',
        });
      }
    },

    handleNavStyle(visible, style) {
      this.setCurrentMicroApp({
        appKey: BASE_PLUGIN_TYPE.PLUGIN_APP_NAV,
        visible,
      });
      this.$emit('update:pluginStyle', style);
    },

    async handleOpenApp(item) {
      const { key } = item;

      const visible = true;
      await this.setRightPluginVisibleHistory(key, visible);
      this.setCurrentMicroApp({
        appKey: key,
        visible,
      });
    },
  },
  beforeDestroy() {},
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
