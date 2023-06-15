<template>
  <div class="address-book">
    <div class="left">
      <div class="top">
        <span>通讯录</span>
      </div>

      <div class="nav-group" v-for="org in orgList" :key="org.id">
        <div class="nav-title">
          <span class="label">{{ org.name }}</span>
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
          <div class="org-panel-item" v-for="dep in org.subList">
            <div
              class="org-item"
              @click="orgActiveKey = orgActiveKey === dep.id ? null : dep.id"
            >
              <LsIcon
                class="nav-icon"
                render-svg
                icon="ls-icon-icon_danwei"
              ></LsIcon>
              <span class="label">{{ dep.name }}</span>
              <LsIcon
                class="more-icon"
                render-svg
                width="14"
                height="14"
                :icon="`ls-icon-icon_${
                  orgActiveKey === dep.id ? 'down' : 'right'
                }`"
              ></LsIcon>
            </div>

            <div class="org-sub-list" v-show="orgActiveKey === dep.id">
              <div
                class="org-sub-item"
                :class="activeKey === item.key && 'active'"
                v-for="item in dep.children"
                @click="handleSelectDep(item, dep, org)"
              >
                <LsIcon
                  class="nav-icon"
                  render-svg
                  icon="ls-icon-icon_xiaji"
                ></LsIcon>
                <span class="label" v-html="item.label"></span>
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
            @click="handleFriendNav(item)"
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
        <div class="nav-title">
          <span class="label">群聊</span>

          <span class="right-btn" @click="handleCreateGroup">
            <LsIcon
              icon="icon_tianjiahaoyou"
              class="top-btn"
              render-svg
              width="12"
              height="17"
            ></LsIcon>
            <span style="padding-left: 2px">创建群聊</span>
          </span>
        </div>
        <div class="nav-list">
          <div
            class="nav-item"
            :class="activeKey === item.key && 'active'"
            v-for="(item, index) in groupList"
            @click="handleFriendNav(item)"
          >
            <LsIcon class="nav-icon" render-svg :icon="item.icon"></LsIcon>
            <span class="label">{{ item.label }}</span>
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
            @click="handleFriendNav(item)"
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
          :depId="componentConfig.depId"
          :depList="componentConfig.depList"
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
import {
  Apis,
  IM_GROUP_MEMBER_PANEL_TYPE,
  SESSION_USER_TYPE,
} from '@lanshu/utils';
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
      friendNavItem: {},
      nvaList: [
        {
          label: '新的联系人',
          component: 'NewFriend',
          key: 'NewFriend',
          icon: 'ls-icon-icon_xindehaoyou',
        },
        {
          label: '联系人',
          component: 'FriendList',
          key: 'FriendList',
          icon: 'ls-icon-icon_haoyou',
        },
      ],
      groupList: [
        {
          label: '群聊',
          component: 'GroupFriend',
          key: 'GroupFriend',
          icon: 'ls-icon-icon_qunliao',
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
      orgList: [],
      depList: [],
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
    ...mapGetters('routerStore', ['orgBreadCrumbs']),

    rawMembers() {
      return this.sessionList.filter(
        (d) => d.toUserType === SESSION_USER_TYPE.IS_BASIC,
      );
    },
  },
  watch: {
    orgBreadCrumbs(val) {
      if (val?.length === 1) {
        const breadCrumb = val[0];
        this.activeKey = `${breadCrumb.key}_Org`;
      }
    },
  },
  mounted() {
    this.orgActiveKey = sessionStorage.getItem('orgActiveKey') || '';
    this.activeKey = sessionStorage.getItem('activeKey') || '';
    this.friendNavItem = JSON.parse(sessionStorage.getItem('friendNavItem') || '{}');
    if (!this.orgActiveKey && this.activeKey) {
      this.handleFriendNav({
        ...this.friendNavItem,
        key: this.activeKey,
      })
    }
    this.getDepList();
  },
  methods: {
    ...mapActions('IMStore', ['setMainSessionWindow']),
    ...mapActions('routerStore', ['setOrgBreadCrumb', 'clearOrgBreadCrumb']),

    addFriend() {
      this.activeKey = null;
      this.setComponentConfig(this.addFriendConfig);
    },

    handleSelectNav(nav) {
      this.clearOrgBreadCrumb();
      this.activeKey = nav.key;
      this.setComponentConfig({
        isOrg: false,
        subLabel: '',
        depId: '',
        depList: [],
        ...nav,
      });
    },

    handleFriendNav(nav) {
      this.orgActiveKey = '';
      this.friendNavItem = nav;
      this.handleSelectNav(nav);
    },

    handleSelectDep(item, dep, org) {
      this.friendNavItem = {};
      this.activeKey = item.key;
      this.handleSelectNav({
        ...item,
        label: item.name,
        isOrg: true,
        subLabel: org.name,
        depId: item.id,
        depList: this.depList,
      });
      this.clearOrgBreadCrumb();
      if (item.key.includes('Dep')) {
        const breadCrumb = item.myDeps?.map((d) => {
          return {
            label: d.name,
            key: d.id,
          };
        });
        this.setOrgBreadCrumb([
          {
            label: dep.name,
            key: dep.id,
          },
          ...breadCrumb,
        ]);
      } else {
        this.setOrgBreadCrumb([
          {
            label: item.name,
            key: item.id,
          },
        ]);
      }
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

    async getDepList() {
      const userDepRes = await Apis.userDepartList();
      const userDepList = userDepRes?.data || [];
      const departsRes = await Apis.accessibleDeparts();
      let orgList = departsRes?.data || {};

      const subList = [];
      orgList = orgList
        .filter((d) => {
          if (d.parentId === '0') return true;
          subList.push(d);
          return false;
        })
        .map((o) => {
          const depList = subList.filter((s) => s.parentId === o.id);
          depList.forEach((d) => {
            const { id, name } = d;

            const component = 'OrgStructure';
            const myDeps = this.recursionMyDep(subList, d, userDepList);

            let myDep;
            if (myDeps?.length) {
              myDep = myDeps.slice(-1)[0];
            }

            if (!o?.subList) {
              o.subList = [];
            }
            o.subList.push({
              ...d,
              children: [
                {
                  label: '组织架构',
                  component,
                  key: `${id}_Org`,
                  id,
                  name,
                },
                ...(myDep?.id
                  ? [
                      {
                        label: `我的部门 <span class="tag">(${myDep.name})</span>`,
                        component,
                        key: `${id}_Dep`,
                        id: myDep.id,
                        name: myDep.name,
                        myDeps: myDeps,
                      },
                    ]
                  : []),
              ],
            });
          });

          return {
            ...o,
          };
        });

      this.depList = subList;
      this.orgList = orgList;

      if (orgList?.length) {
        if (!this.orgActiveKey && !this.activeKey) {
          const org = orgList[0];
          const dep = org.subList[0];
          const item =
            dep.children?.length > 1 ? dep.children[1] : dep.children[0];
          this.handleSelectDep(item, dep, org);
        } else if (this.orgActiveKey && this.activeKey) {
          const org = orgList.find((d) =>
            d.subList.some((s) => s.id === this.orgActiveKey),
          );
          const dep = org.subList.find((d) => d.id === this.orgActiveKey);
          const item = dep.children?.find((d) => d.key === this.activeKey);
          this.handleSelectDep(item, dep, org);
        }
      }
    },

    recursionMyDep(subDepList, dep, userDepList) {
      // 所属部门只有一个 且 属于顶级部门
      if (userDepList.length === 1 && userDepList[0].id === dep.id) {
        return []
      }
      const userDep = userDepList.find((u) => u.parentId === dep.id);
      if (userDep) {
        return [userDep];
      }
      const subDep = subDepList.find((d) => d.parentId === dep.id);
      if (subDep) {
        const result = this.recursionMyDep(subDepList, subDep, userDepList);
        if (result) {
          return [subDep, ...result];
        }
      }
      return [];
    },
  },

  destroyed() {
    sessionStorage.setItem('orgActiveKey', this.orgActiveKey);
    sessionStorage.setItem('activeKey', this.activeKey);
    sessionStorage.setItem('friendNavItem', JSON.stringify(this.friendNavItem));
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

              ::v-deep .tag {
                font-size: 14px;
                color: $minor-text-color;
                padding-left: 6px;
              }
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
