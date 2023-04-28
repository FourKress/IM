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
          <span class="label">{{ item.label }}</span>
          <el-badge
            v-if="index === 0 && newFriendCount"
            :value="newFriendCount"
            :max="99"
            class="count"
          ></el-badge>
          <span v-else class="count">{{ item.count }}</span>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top" v-if="componentConfig.key">
        {{ componentConfig.label }}
        <span class="create-group" v-if="componentConfig.key === 'GroupFriend'">
          <LsIcon
            icon="ls-icon-icon_cjql"
            width="14"
            height="14"
            class="top-btn"
            render-svg
          ></LsIcon>
          <span @click="handleCreateGroup">创建群聊</span>
        </span>
      </div>
      <div class="main-warp">
        <div class="empty-bg" v-if="!componentConfig.key">
          <LsIcon
            icon="ls-icon-logo"
            width="168"
            height="168"
            render-svg
          ></LsIcon>
        </div>
        <component
          :is="componentConfig.component"
          :key="componentConfig.key"
          :isBot="componentConfig.key === 'FriendListBot'"
        ></component>
      </div>
    </div>

    <LsCardDialog :visible.sync="visibleGroupMember" :isModalClose="false">
      <GroupMemberChat
        :panelType="IM_GROUP_MEMBER_PANEL_TYPE.IS_CREATE"
        @close="handleGroupClose"
        @confirm="handleCroupConfirm"
      ></GroupMemberChat>
    </LsCardDialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { LsIcon, LsCardDialog } from '@lanshu/components';
import AddFriend from './add-friend.vue';
import NewFriend from './new-friend.vue';
import GroupFriend from './group-friend.vue';
import FriendList from './friend-list.vue';
import { IM_GROUP_MEMBER_PANEL_TYPE } from '@lanshu/utils';
import { GroupMemberChat } from '@lanshu/im';

export default {
  name: 'AddressBook',
  components: {
    LsIcon,
    AddFriend,
    NewFriend,
    GroupFriend,
    FriendList,
    GroupMemberChat,
    LsCardDialog,
  },
  data() {
    return {
      activeIndex: null,
      nvaList: [
        {
          label: '新的联系人',
          component: 'NewFriend',
          key: 'NewFriend',
          icon: 'icon_txl_xdlxr',
        },
        {
          label: '群聊',
          component: 'GroupFriend',
          key: 'GroupFriend',
          icon: 'icon_txl_ql',
        },
        {
          label: '联系人',
          component: 'FriendList',
          key: 'FriendList',
          icon: 'icon_txl_lxr',
        },
        {
          label: '技术支持',
          component: 'FriendList',
          key: 'FriendListBot',
          icon: 'icon_txl_jszc',
        },
      ],
      addFriendConfig: {
        label: '添加好友',
        component: 'AddFriend',
        key: 'AddFriend',
      },
      componentConfig: {},
      visibleGroupMember: false,
      IM_GROUP_MEMBER_PANEL_TYPE,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['newFriendCount']),
  },
  methods: {
    ...mapActions('IMStore', ['setMainSessionWindow']),

    addFriend() {
      this.activeIndex = null;
      this.setComponentConfig(this.addFriendConfig);
    },
    handleSelectNav(nav, index) {
      this.activeIndex = index;
      this.setComponentConfig(nav);
    },
    setComponentConfig(nav) {
      this.componentConfig = {
        ...nav,
      };
    },

    handleCreateGroup() {
      this.visibleGroupMember = true;
    },

    handleGroupClose() {
      this.visibleGroupMember = false;
    },
    handleCroupConfirm(session) {
      console.log(session);
      this.handleGroupClose();
      if (session) {
        this.$nextTick(() => {
          this.$router.push('/');
          this.setMainSessionWindow(session);
        })
      }
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
      box-sizing: border-box;
      font-size: 16px;
      font-weight: normal;
      color: $main-text-color;
      border-bottom: 1px solid $split-line-color;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .create-group {
        width: 86px;
        height: 28px;
        border-radius: 4px;
        border: 1px solid $primary-color;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: $primary-color;
        cursor: pointer;
      }
    }

    .main-warp {
      flex: 1;
      overflow: hidden;
      position: relative;

      .empty-bg {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
