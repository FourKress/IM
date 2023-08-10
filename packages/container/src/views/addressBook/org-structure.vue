<template>
  <div class="org-list">
    <div class="bread-crumb">
      <span v-for="(item, index) in orgBreadCrumbs">
        <span
          class="item"
          :class="index === orgBreadCrumbs.length - 1 && 'last'"
          @click="handleBreadCrumbs(item, index)"
        >
          {{ item.label }}
        </span>
        <span class="split" v-if="index !== orgBreadCrumbs.length - 1">/</span>
      </span>
    </div>

    <div class="list">
      <div class="scroll-view" v-if="selfDepList.length">
        <div
          class="item"
          v-for="item in selfDepList"
          :key="item.id"
          @click="handleOrg(item)"
        >
          <span class="org-icon">
            <LsIcon
              icon="ls-icon-a-icon_mrtb2x"
              width="34"
              height="34"
              render-svg
            ></LsIcon>
          </span>
          <span class="label">{{ item.name }}</span>
          <span class="more">
            <LsIcon
              icon="ls-icon-icon_right"
              width="14"
              height="14"
              render-svg
            ></LsIcon>
          </span>
        </div>
      </div>
      <div class="scroll-view" v-if="userList.length">
        <div
          class="item"
          v-for="item in userList"
          :key="item.userId"
          @click="(event) => handleFriend(item, event)"
        >
          <span class="org-icon">
            <img :src="item.picture" alt="" />
          </span>
          <span class="label">
            <span class="name">{{ item.name }}</span>
            <span class="tag" v-if="roleCodeMap[item.roleCode]">
              {{ roleCodeMap[item.roleCode] }}
            </span>
          </span>
        </div>
      </div>
    </div>

    <LsCardDialog :visible.sync="showFriendDialog">
      <LsFriendPanel
        :friend-info="friendInfo"
        :position="position"
        :config="friendPanelConfig"
        :isDep="true"
        @sendMsg="handleSendMsg"
        @sendVideo="handleSendVideo"
        @sendAudio="handleSendAudio"
      />
    </LsCardDialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { LsIcon, LsCardDialog, LsFriendPanel } from '@lanshu/components';
import { Apis, FriendMixins } from '@lanshu/utils';

export default {
  name: 'Org-Structure',
  components: {
    LsIcon,
    LsCardDialog,
    LsFriendPanel,
  },
  props: {
    depId: {
      type: String,
      required: true,
    },
    depList: {
      type: Array,
      default: () => [],
    },
  },
  mixins: [FriendMixins],
  computed: {
    ...mapGetters('routerStore', ['orgBreadCrumbs']),
  },
  watch: {
    orgBreadCrumbs: {
      deep: true,
      handler(val) {
        if (!val?.length) return;
        const current = val.slice(-1)[0];
        this.initData(current.key);
      },
    },
  },
  data() {
    return {
      selfDepList: [],
      userList: [],
      showFriendDialog: false,
      friendPanelConfig: {},
      roleCodeMap: {
        // generalUser: '普通成员',
        departAdmin: '部门管理员',
        // cooperateAdmin: '协作管理员',
        orgAdmin: '组织管理员',
        // platformAdmin: '平台管理员',
      },
    };
  },
  mounted() {
    this.initData(this.depId);
  },
  methods: {
    ...mapActions('routerStore', ['addOrgBreadCrumb', 'deleteOrgBreadCrumb']),

    initData(depId) {
      this.userList = [];
      this.selfDepList = [];
      this.selfDepList = this.depList.filter((d) => d.parentId === depId);
      this.getUserByDep(depId);
    },

    async getUserByDep(depId) {
      const res = await Apis.findUserByDepartId({
        departId: depId,
      });
      this.userList = res?.data || [];
    },

    handleOrg(dep) {
      this.addOrgBreadCrumb({
        label: dep.name,
        key: dep.id,
      });
    },

    async handleFriend(user, event) {
      await this.openFriendDialog(
        event,
        async () => {
          const { userId, nickName, picture } = user;
          this.friendPanelConfig = { isPass: true };
          return {
            userId,
            nickname: nickName,
            avatar: picture,
          };
        },
        440,
      );
    },

    handleBreadCrumbs(item, index) {
      if (index === this.orgBreadCrumbs.length - 1) return;
      this.deleteOrgBreadCrumb(index);
    },
  },
};
</script>

<style scoped lang="scss">
.org-list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;

  .bread-crumb {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 14px 30px 16px;

    font-size: 12px;
    color: $primary-hover-color;

    .item {
      cursor: pointer;
      &.last {
        color: $tips-text-color;
        cursor: default;
      }
    }

    .split {
      color: $tips-text-color;
      padding: 0 4px;
    }
  }

  .list {
    overflow-y: auto;
    overflow-x: hidden;
    transform: translate3d(0, 0, 0);
    scroll-behavior: smooth;
    height: 100%;

    .scroll-view {
      padding: 0 30px;

      .item {
        width: 100%;
        height: 66px;
        padding: 16px 30px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        border-radius: 6px;

        &:hover {
          background: $bg-hover-grey-color;
        }

        .org-icon {
          width: 34px;
          height: 34px;
          border-radius: 6px;
          margin-right: 10px;
          border-radius: 6px;
          overflow: hidden;

          img {
            display: flex;
            width: 34px;
            height: 34px;
          }
        }

        .label {
          flex: 1;
          font-size: 14px;
          display: flex;
          align-items: center;

          .tag {
            width: 72px;
            height: 20px;
            background: #e2eeff;
            font-size: 12px;
            color: $primary-color;
            border-radius: 3px;
            text-align: center;
            line-height: 20px;
            margin-left: 6px;

            &.admin {
              background: #fff3d7;
              color: #cf8f00;
            }
          }
        }

        .more {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
}
</style>
