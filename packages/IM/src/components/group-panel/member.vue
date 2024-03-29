<template>
  <div class="member">
    <div class="input-row" :class="isFocus && 'active'">
      <div class="query-icon">
        <LsIcon icon="navi_ss_icon" width="14" height="14" render-svg></LsIcon>
      </div>
      <div class="input-panel">
        <el-input
          type="text"
          v-model="memberName"
          placeholder="搜索群成员"
          @focus="isFocus = true"
          @blur="isFocus = false"
        />
      </div>
    </div>
    <div class="tips">共{{ members.length }}位成员</div>

    <div class="action">
      <span
        class="add btn"
        v-if="groupRoleManager.whoCanAddGroupMemberOrShareGroup <= groupRole"
        @click="changeMember(IM_GROUP_MEMBER_PANEL_TYPE.IS_ADD)"
      >
        <LsIcon render-svg width="14" height="14" icon="navi_ss_add"></LsIcon>
      </span>
      <span
        class="del btn"
        v-if="isGroupManager"
        @click="changeMember(IM_GROUP_MEMBER_PANEL_TYPE.IS_DEL)"
      >
        <LsIcon
          render-svg
          width="14"
          height="14"
          icon="a-icon_jianhao2x"
        ></LsIcon>
      </span>
    </div>

    <div class="list" v-loading="loading">
      <div class="scroll-view">
        <div
          class="item"
          v-for="(item, index) in members"
          :key="index"
          v-if="item.nickname && item.nickname.includes(memberName)"
          @click="(event) => handleFriend(item, event)"
        >
          <div class="img">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="name">
            <span>{{ item.nickname }}</span>
          </div>
          <div
            class="tag"
            :class="memberClass(item.role)"
            v-if="[2, 3].includes(item.role)"
          >
            <span>{{ GROUP_MEMBER_TYPE_MAP[item.role] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';
import { mapGetters } from 'vuex';
import {
  IM_GROUP_MEMBER_PANEL_TYPE,
  GROUP_MEMBER_TYPE_MAP,
  GROUP_ROLE_TYPE,
} from '@lanshu/utils';
import { IMGetGroupMemberList, IMGetGroupRoleManagerList } from '../../IM-SDK';

export default {
  name: 'Member',
  components: {
    LsIcon,
  },
  data() {
    return {
      IM_GROUP_MEMBER_PANEL_TYPE,
      GROUP_MEMBER_TYPE_MAP,
      memberName: '',
      isAdd: false,
      nextSeq: 0,
      members: [],
      groupRoleManager: {},
      loading: false,
      isFocus: false,
    };
  },
  computed: {
    ...mapGetters('IMStore', [
      'actionWindow',
      'userInfo',
      'refreshMembers',
      'refreshGroupRoleManager',
    ]),
    groupId() {
      return this.actionWindow.toUser;
    },
    groupRole() {
      const self = this.members.find((d) => d.userId === this.userInfo.userId);
      if (!self) return -1;
      return self.role;
    },
    isGroupManager() {
      return [GROUP_ROLE_TYPE.IS_MANAGE, GROUP_ROLE_TYPE.IS_OWNER].includes(
        this.groupRole,
      );
    },
  },
  watch: {
    refreshMembers() {
      this.getGroupMemberList();
    },
    refreshGroupRoleManager() {
      this.getGroupMemberList();
      this.getGroupRoleManagerList();
    },
  },
  methods: {
    getGroupMemberList() {
      this.loading = true;
      // nextSeq默认从0开始
      IMGetGroupMemberList(this.groupId, 0)
        .then((res) => {
          console.log(res, 'getGroupMemberList');
          const { nextSeq, members = [] } = res;
          this.nextSeq = nextSeq;
          this.members = members.map((d) => {
            return {
              ...d,
              nickname: d.alias || d.nickname,
            };
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    changeMember(type) {
      const members = this.members;
      const data = {
        type,
        defaultMembers: members,
      };
      if (type === this.IM_GROUP_MEMBER_PANEL_TYPE.IS_DEL) {
        data.members = members.filter((d) => d.userId !== this.userInfo.userId);
      }
      this.$emit('changeGroupMember', {
        ...data,
      });
    },
    memberClass(role) {
      return role === GROUP_ROLE_TYPE.IS_OWNER
        ? 'owner'
        : role === GROUP_ROLE_TYPE.IS_MANAGE
        ? 'manage'
        : '';
    },

    getGroupRoleManagerList() {
      IMGetGroupRoleManagerList(this.actionWindow.toUser)
        .then((res) => {
          console.log(res.data);
          this.groupRoleManager = res?.data || {};
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleFriend(member, event) {
      this.$emit('checkMember', member, event);
    },
  },
  mounted() {
    this.getGroupMemberList();
    this.getGroupRoleManagerList();
  },
};
</script>

<style scoped lang="scss">
.member {
  width: 100%;
  height: calc(100% - 68px);
  box-sizing: border-box;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  padding: 0 20px 10px;

  ::-webkit-scrollbar {
    display: none;
  }
}
.input-row {
  width: 100%;
  height: 36px;
  box-sizing: border-box;
  background-color: $bg-white-color;
  border-radius: 6px;
  border: 1px solid $split-line-color;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s;

  &.active {
    border-color: $primary-color;
  }

  .query-icon {
    width: 14px;
    height: 14px;
    transform: translateY(-2px);
  }

  .input-panel {
    flex: 1;
    height: 20px;
    padding: 0 8px;
    font-size: 14px;

    ::v-deep .el-input {
      border: none;

      .el-input__inner {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        padding: 0;
      }
      input::placeholder {
        color: $tips-text-color;
        font-size: 14px;
      }
    }
  }
}

.tips {
  margin: 14px 0;
  font-size: 14px;
  color: $minor-text-color;
}

.action {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .btn {
    width: 30px;
    height: 30px;
    margin-left: 10px;
    background: $bg-white-color;
    border-radius: 5px;
    border: 1px dashed $split-line-color;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.list {
  margin-left: 10px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  transform: translate3d(0, 0, 0);

  .scroll-view {
    .item {
      width: 100%;
      height: 32px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;

      &:last-child {
        margin-bottom: 0;
      }

      .img {
        width: 32px;
        height: 32px;
        margin-right: 10px;
        border-radius: 6px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      .name {
        flex: 1;
        height: 22px;
        line-height: 22px;
        padding-right: 10px;
        font-size: 14px;
        color: $main-text-color;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .tag {
        width: 48px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        border-radius: 3px;
        font-size: 12px;

        &.owner {
          background: #e9f2ff;
          color: #2b83fa;
        }

        &.manage {
          background: #fff3d7;
          color: #cf8f00;
        }
      }
    }
  }
}
</style>
