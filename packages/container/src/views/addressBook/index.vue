<template>
  <div class="address-book">
    <div class="left">
      <div class="top">
        <span>通讯录</span>
        <LsIcon
          icon="icon_tianjiahaoyou"
          class="top-btn"
          render-svg
          @click="addFriend"
        ></LsIcon>
      </div>
      <div class="nav-list">
        <div
          class="nav-item"
          :class="activeIndex === index && 'active'"
          v-for="(item, index) in nvaList"
          @click="handleSelectNav(item, index)"
        >
          <LsIcon class="nav-icon" render-svg :icon="item.icon"></LsIcon>
          <span class="label">{{item.label}}</span>
          <el-badge
            v-if="index === 0"
            :value="item.count"
            :max="99"
            class="count"
          ></el-badge>
          <span v-else class="count">{{item.count}}</span>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top">{{ componentConfig.title }}</div>
      <div class="main-warp">
        <component :is="componentConfig.component"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';
import AddFriend from './add-friend.vue';

export default {
  name: 'AddressBook',
  components: {
    LsIcon,
    AddFriend,
  },
  data() {
    return {
      activeIndex: null,
      nvaList: [
        {
          label: '新的联系人',
          component: 'newAddress',
          count: 3,
          icon: 'icon_txl_xdlxr',
        },
        {
          label: '群聊',
          component: 'group',
          count: 3,
          icon: 'icon_txl_ql',
        },
        {
          label: '联系人',
          component: 'addressBook',
          count: 3,
          icon: 'icon_txl_lxr',
        },
        {
          label: '技术支持',
          // component: 'addressBook',
          count: 3,
          icon: 'icon_txl_jszc',
        },
      ],
      componentConfig: {},
    };
  },
  methods: {
    addFriend() {
      this.setComponentConfig('添加好友', 'add-friend');
    },
    handleSelectNav(nav, index) {
      this.activeIndex = index;
      this.setComponentConfig(nav.label, nav.component);
    },
    setComponentConfig(title, component) {
      this.componentConfig = {
        title,
        component,
      };
    },
  },
};
</script>

<style scoped lang="scss">
.address-book {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 100%;

  .left {
    width: 265px;
    min-width: 265px;
    height: 100%;
    box-sizing: border-box;

    .top {
      font-size: 16px;
      height: 22px;
      line-height: 22px;
      font-weight: bold;
      color: $main-text-color;
      padding: 14px 15px 14px 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .top-btn {
        cursor: pointer;
      }
    }

    .nav-list {
      padding: 0 10px;
      box-sizing: border-box;

      .nav-item {
        height: 56px;
        padding: 0 12px 0 10px;
        background: $bg-white-color;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;

        &.active {
          background: #e9f2ff;
        }

        .label {
          flex: 1;
          padding-left: 8px;
        }

        .nav-icon {
          transform: translateY(1px);
        }
      }
    }
  }

  .right {
    flex: 1;
    height: 100%;
    border-left: 1px solid $split-line-color;
    display: flex;
    flex-direction: column;

    .top {
      width: 100%;
      height: 52px;
      line-height: 52px;
      padding: 0 20px;
      font-size: 16px;
      font-weight: normal;
      color: $main-text-color;
      border-bottom: 1px solid $split-line-color;
    }

    .main-warp {
      flex: 1;
    }
  }
}
</style>
