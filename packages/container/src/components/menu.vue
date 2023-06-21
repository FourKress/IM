<template>
  <div id="client-menu">
    <div class="menu-panel">
      <div
        class="menu-item"
        v-for="item in navList"
        :key="item.path"
        :class="activePath === item.path && 'active'"
        @click="handleMenuSwitch(item.path)"
      >
        <span class="btn-icon">
          <img
            v-if="item.activeIcon.includes('http')"
            :src="item.activeIcon"
            alt=""
          />
          <LsIcon
            v-else
            render-svg
            width="20"
            height="20"
            :icon="
              activePath === item.path ? item.activeIcon : item.disableIcon
            "
          ></LsIcon>
        </span>
        <span class="menu-label">{{ item.label }}</span>

        <el-badge
          v-if="getBadge(item)"
          :value="getBadge(item)"
          :max="99"
          class="count"
        ></el-badge>
      </div>
    </div>
    <div class="update" v-if="updateNotify" @click="handleUpdate">
      <LsIcon
        icon="ls-icon-icon_shengji"
        width="28"
        height="28"
        render-svg
      ></LsIcon>
      <span class="label">新版本</span>
    </div>

    <LsCardDialog :visible.sync="visibleUpdate">
      <div class="update-panel">
        <div class="top">
          <img class="img" :src="LsAssets.updateBgSmall" alt="" />
        </div>
        <div class="container">
          <div class="title">{{ updateInfo.title }}</div>
          <div class="text-wrap">
            <div class="scroll-view" v-html="updateInfo.content"></div>
          </div>
        </div>
        <div class="footer">
          <span class="right btn" @click="handleStartUpdate">立即更新</span>
        </div>
      </div>
    </LsCardDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { LsIcon, LsCardDialog, LsAssets } from '@lanshu/components';
import { MICRO_APP_PATH_MARK } from '@lanshu/micro';
import { ClientUpdateMixins } from '@lanshu/utils';
import micro from '../micro';
import BaseRoutes from '../router';

export default {
  name: 'MainMenu',
  components: {
    LsIcon,
    LsCardDialog,
  },
  mixins: [ClientUpdateMixins],
  data() {
    return {
      activePath: '/',
      navList: [],
      LsAssets,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['allUnreadCount', 'newFriendCount']),
  },
  watch: {
    $route(val) {
      const { path = '' } = val;
      const isMicro = path.includes(MICRO_APP_PATH_MARK);
      const regExp = new RegExp('\/[a-zA-Z]+' + MICRO_APP_PATH_MARK, 'g');
      // 微应用路由，只需用第一级路由进行标识，确定菜单的计划效果
      this.activePath = isMicro ? path.match(regExp)[0] : path;
    },
  },
  created() {
    // 获取入口传入的Menu项
    const pluginMenu = JSON.parse(localStorage.getItem('menu') || '[]');

    // BaseRoutes 基础的菜单列表
    // micro.getRoutes() 微应用的菜单列表
    this.navList = [...BaseRoutes, ...micro.getRoutes()]
      .filter((r) => r?.meta?.isMenu)
      .concat(pluginMenu)
      .map((r) => {
        const meta = r?.meta;
        return {
          label: meta?.name,
          path: r.path,
          disableIcon: meta?.disableIcon,
          activeIcon: meta?.activeIcon,
        };
      });
  },
  methods: {
    handleMenuSwitch(path) {
      if (this.activePath === path) return;
      this.activePath = path;
      this.$router.push(path);
    },

    getBadge(item) {
      // / ==> 消息，/addressBook ==> 通讯录，这两个菜单需要渲染未读数量
      if (!['/', '/addressBook'].includes(item.path)) return 0;
      if (item.path === '/') return this.allUnreadCount;
      if (item.path === '/addressBook') return this.newFriendCount;
    },
  },
};
</script>

<style scoped lang="scss">
#client-menu {
  width: 72px;
  background: $gradient-sidebar-color;
  padding-bottom: 6px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: -15px 0 0 1px;

  ::-webkit-scrollbar {
    display: none;
  }

  .menu-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow-y: auto;
    transform: translate3d(0, 0, 0);

    .menu-item {
      width: 60px;
      height: 60px;
      min-height: 60px;
      font-size: 12px;
      line-height: 17px;
      color: #6f8ab9;
      cursor: pointer;
      transform: translate3d(0, 0, 0);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      transition: all 0.3s;

      .btn-icon {
        width: 20px;
        height: 20px;
        margin-bottom: 4px;
        transition: all 0.3s;
        margin-top: 2px;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      &.active {
        background-color: $bg-white-color;
        box-shadow: $bg-select-shadow;
        border-radius: 8px;
        color: $primary-color;

        .btn-icon {
          width: 20px;
          height: 20px;
          margin-bottom: 4px;
        }
      }

      ::v-deep .el-badge {
        position: absolute;
        right: 1px;
        top: 1px;
        display: block;
        transform-origin: center;
        transform: scale(0.8);
      }

      .menu-label {
        width: 60px;
        text-align: center;
        height: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .update {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: $main-text-color;
    cursor: pointer;
    margin: 8px 0 20px 0;

    .label {
      margin-top: 6px;
    }
  }
}

.update-panel {
  width: 320px;
  height: 424px;
  box-sizing: border-box;
  position: fixed;
  bottom: 24px;
  left: 82px;
  z-index: 8;
  display: flex;
  flex-direction: column;
  background: $bg-white-color;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 20px 0px rgb(51 51 51 / 10%);

  .top {
    width: 100%;
    height: 78px;

    .img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .container {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .title {
      padding: 16px;
      box-sizing: border-box;
      font-size: 16px;
      color: $main-text-color;
      font-weight: bold;
    }

    .text-wrap {
      flex: 1;
      overflow-y: auto;
      transform: translate3d(0, 0, 0);
      padding: 0 16px;

      .scroll-view {
      }
    }
  }

  .footer {
    width: 100%;
    box-sizing: border-box;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 10px 0 16px 0;

    .btn {
      width: 120px;
      height: 34px;
      border-radius: 6px;
      background: $bg-white-color;
      text-align: center;
      line-height: 34px;
      font-size: 14px;
      color: $bg-white-color;
      cursor: pointer;

      &.right {
        background: $primary-color;
      }

      &.left {
        color: $primary-color;
        text-align: left;
      }
    }
  }
}
</style>
