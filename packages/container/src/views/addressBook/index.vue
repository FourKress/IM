<template>
  <div class="address-book">
    <div class="left">
      <div class="top">
        <span>通讯录</span>
      </div>

      <div class="nav-group">
        <div class="nav-title">
          <span class="label">组织管理</span>
          <span class="right-btn" @click="openOrgLink">
            <LsIcon
              icon="icon_tianjiahaoyou"
              class="org-icon"
              render-svg
              width="12"
              height="17"
            ></LsIcon>
            <span style="padding-left: 2px">管理组织</span>
          </span>
        </div>
        <div class="org-panel-list">
          <div class="org-panel-item" v-for="org in orgList">
            <div
              class="org-item"
              @click="orgActiveKey = orgActiveKey === org.key ? null : org.key"
            >
              <LsIcon
                class="nav-icon"
                render-svg
                icon="ls-icon-icon_danwei"
              ></LsIcon>
              <span class="label">{{ org.label }}</span>
              <LsIcon
                class="more-icon"
                render-svg
                width="14"
                height="14"
                :icon="`ls-icon-icon_${
                  orgActiveKey === org.key ? 'down' : 'right'
                }`"
              ></LsIcon>
            </div>

            <div class="org-sub-list" v-show="orgActiveKey === org.key">
              <div
                class="org-sub-item"
                :class="activeKey === item.key && 'active'"
                v-for="item in org.subList"
                @click="handleSelectOrg(item)"
              >
                <LsIcon
                  class="nav-icon"
                  render-svg
                  icon="ls-icon-icon_xiaji"
                ></LsIcon>
                <span class="label">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="nav-group">
        <div class="nav-title">
          <span class="label">好友</span>

          <span class="right-btn" @click="addFriend">
            <LsIcon
              icon="icon_tianjiahaoyou"
              class="top-btn"
              render-svg
              width="12"
              height="17"
            ></LsIcon>
            <span style="padding-left: 2px">添加好友</span>
          </span>
        </div>
        <div class="nav-list">
          <div
            class="nav-item"
            :class="activeKey === item.key && 'active'"
            v-for="(item, index) in nvaList"
            @click="handleSelectNav(item)"
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

      <div class="nav-group">
        <div class="nav-title"></div>
        <div class="nav-list">
          <div
            class="nav-item"
            :class="activeKey === item.key && 'active'"
            v-for="item in botList"
            @click="handleSelectNav(item)"
          >
            <LsIcon class="nav-icon" render-svg :icon="item.icon"></LsIcon>
            <span class="label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top" v-if="componentConfig.key">
        <span class="top-label" v-if="componentConfig.isOrg">
          <span>{{ componentConfig.label }}</span>
          <span class="sub-title">{{ componentConfig.subLabel }}</span>
        </span>
        <span class="top-label" v-else>{{ componentConfig.label }}</span>
        <span class="create-group" v-if="componentConfig.key === 'GroupFriend'">
          <LsIcon
            icon="ls-icon-icon_cjql"
            width="13"
            height="13"
            class="top-btn"
            render-svg
          ></LsIcon>
          <span style="padding-left: 2px" @click="handleCreateGroup">
            创建群聊
          </span>
        </span>
      </div>
      <div class="main-wrap">
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
        :rawMembers="rawMembers"
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
import OrgStructure from './org-structure.vue';
import { IM_GROUP_MEMBER_PANEL_TYPE, SESSION_USER_TYPE } from '@lanshu/utils';
import { GroupMemberChat } from '@lanshu/im';
import { renderProcess } from '@lanshu/render-process';

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
    OrgStructure,
  },
  data() {
    return {
      activeKey: null,
      orgActiveKey: null,
      nvaList: [
        {
          label: '新的联系人',
          component: 'NewFriend',
          key: 'NewFriend',
          icon: 'ls-icon-icon_xindehaoyou',
        },
        // {
        //   label: '群聊',
        //   component: 'GroupFriend',
        //   key: 'GroupFriend',
        //   icon: 'ls-icon-icon_qunliao',
        // },
        {
          label: '联系人',
          component: 'FriendList',
          key: 'FriendList',
          icon: 'ls-icon-icon_haoyou',
        },
      ],
      botList: [
        {
          label: '技术支持',
          component: 'FriendList',
          key: 'FriendListBot',
          icon: 'ls-icon-icon_jishuzhichi',
        },
      ],
      orgList: [
        {
          label: '行政服务中心',
          key: 'AdminServiceCenter',
          subList: [],
        },
        {
          label: '交通局',
          key: 'TransportationBureau',
          subList: [],
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
    ...mapGetters('IMStore', ['newFriendCount', 'sessionList']),

    rawMembers() {
      return this.sessionList.filter(
        (d) => d.toUserType === SESSION_USER_TYPE.IS_BASIC,
      );
    },
  },
  mounted() {
    this.orgList = this.orgList.map((d) => {
      return {
        ...d,
        subList: [
          {
            label: '组织架构',
            component: 'OrgStructure',
            key: `${d.key}_OrgStructure`,
          },
          {
            label: '我的部门',
            component: 'MyDep',
            key: `${d.key}_MyDep`,
          },
        ],
      };
    });
  },
  methods: {
    ...mapActions('IMStore', ['setMainSessionWindow']),

    addFriend() {
      this.activeKey = null;
      this.setComponentConfig(this.addFriendConfig);
    },
    handleSelectNav(nav) {
      this.activeKey = nav.key;
      this.setComponentConfig(nav);
    },

    handleSelectOrg(org) {
      this.activeKey = org.key;
      console.log(org);
      this.handleSelectNav({
        ...org,
        isOrg: true,
        subLabel: '实打实大大',
      });
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
        });
      }
    },

    openOrgLink() {
      renderProcess.openUrl('https://www.baidu.com');
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

    .nav-group {
      &:first-child {
        .nav-title {
          border-top: none;
          margin-top: 10px;
        }
      }

      .nav-title {
        margin: 10px 22px;

        border-top: 1px solid $split-line-color;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .label {
          font-size: 14px;
          color: $main-text-color;
          font-weight: bold;
          height: 40px;
          line-height: 40px;
        }

        .right-btn {
          font-size: 12px;
          color: $tips-text-color;
          display: flex;
          align-items: center;
          cursor: pointer;

          .org-icon {
            transform: translateY(1px);
          }
        }
      }
    }

    .nav-list {
      padding: 0 12px;
      box-sizing: border-box;
      transition: all 0.3s;

      .nav-item {
        height: 56px;
        padding: 0 12px 0 10px;
        background: $bg-white-color;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        cursor: pointer;

        &.active {
          background: #e9f2ff;
          .label {
            color: $primary-color;
          }
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

    .org-panel-list {
      padding: 0 12px;
      box-sizing: border-box;
      transition: all 0.3s;

      .org-panel-item {
        .org-item {
          height: 56px;
          padding: 0 12px 0 10px;
          background: $bg-white-color;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          cursor: pointer;

          .label {
            flex: 1;
            padding-left: 8px;
          }
        }

        .org-sub-list {
          box-sizing: border-box;
          transition: all 0.3s;

          .org-sub-item {
            height: 56px;
            padding: 0 12px 0 10px;
            background: $bg-white-color;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            cursor: pointer;

            &.active {
              background: #e9f2ff;
              .label {
                color: $primary-color;
              }
            }

            .label {
              flex: 1;
              padding-left: 8px;
            }

            .nav-icon {
              margin-left: 24px;
            }
          }
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

      .top-label {
        font-weight: bold;
        display: flex;
        align-items: flex-end;
        font-size: 16px;

        .sub-title {
          font-size: 14px;
          color: $tips-text-color;
          font-weight: normal;
          padding-left: 6px;
        }
      }
    }

    .main-wrap {
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
