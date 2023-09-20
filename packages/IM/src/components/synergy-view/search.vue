<template>
  <div class="synergy-search" :style="positionInfo">
    <div class="title">邀请协同者</div>
    <div class="search" :class="isFocus && 'active'">
      <LsIcon icon="navi_ss_icon" width="14" height="14" render-svg></LsIcon>
      <div class="input-panel">
        <el-input
          ref="searchInput"
          v-model="keywords"
          @input="handleSearch"
          @focus="isFocus = true"
          @blur="isFocus = false"
          clearable
          type="text"
          placeholder="搜索组织成员、好友、群聊"
        />
      </div>
      <span class="btn" @click="handleCreateSynergy">
        <el-tooltip
          class="btn"
          effect="dark"
          content="批量邀请 或 创建群协同"
          placement="top"
        >
          <LsIcon size="14" color="#90959F" icon="ls-icon-a-icon_"></LsIcon>
        </el-tooltip>
      </span>
    </div>
    <div class="history" v-if="synergyHistory.length && !keywords">
      近期协同
    </div>
    <div class="scroll-view" v-if="searchData.length">
      <div class="item" v-for="item in searchData" @click="startSynergy(item)">
        <img class="img" :src="item.avatar" alt="" />
        <span class="name">{{ item.nickname }}</span>
      </div>
    </div>

    <div class="empty-data" v-if="isEmpty && keywords">
      没有找到“
      <span class="link">{{ keywords }}</span>
      ”相关的结果
    </div>

    <div class="mask" v-if="visibleSynergyMember">
      <GroupMemberChat
        :panelType="IM_GROUP_MEMBER_PANEL_TYPE.IS_SYNERGY"
        @close="handleGroupClose"
        @confirm="handleCroupConfirm"
        :rawMembers="rawMembers"
        :disabledMembers="disabledMembers"
      ></GroupMemberChat>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { LsIcon } from '@lanshu/components';
import GroupMemberChat from '../base-settings/group-member-chat.vue';
import {
  Apis,
  lodash,
  SESSION_USER_TYPE,
  IM_GROUP_MEMBER_PANEL_TYPE,
} from '@lanshu/utils';
import {
  IMGetAllFriendList,
  IMGetByUserId,
  IMGetGroupList,
  IMSetSynergyStatus,
} from '../../IM-SDK';

export default {
  name: 'search',
  components: { LsIcon, GroupMemberChat },
  data() {
    return {
      IM_GROUP_MEMBER_PANEL_TYPE,
      keywords: '',
      groupData: [],
      addressBooKData: [],
      searchData: [],
      orgData: [],
      originData: [],
      isEmpty: false,
      visibleSynergyMember: false,
      isFocus: false,
      positionInfo: {},
    };
  },
  computed: {
    ...mapGetters('IMStore', [
      'synergyHistory',
      'mainSessionWindow',
      'sessionList',
      'synergySessionList',
      'userInfo',
    ]),
    ...mapGetters('globalStore', ['systemUserInfo']),

    rawMembers() {
      return this.sessionList.filter(
        (d) =>
          d.toUserType === SESSION_USER_TYPE.IS_BASIC &&
          this.synergySessionList.every((s) => s.sessId !== d.sessId),
      );
    },
    disabledMembers() {
      return [this.mainSessionWindow, ...this.synergySessionList];
    },
  },
  mounted() {
    const container = document.querySelector('.synergy .top');
    const { left, top, width } = container.getBoundingClientRect();
    this.positionInfo = {
      left: `${left + width - 376}px`,
      top: `${top + 56}px`,
    };
    this.getData();
    this.$nextTick(() => {
      this.$refs.searchInput.focus();
    });
  },

  methods: {
    ...mapActions('IMStore', ['setSynergyHistory', 'addSynergySessionList']),

    handleSearch: lodash.debounce(function (val) {
      if (!val) {
        this.isEmpty = false;
        this.getHistoryList();
        return;
      }
      this.getSearchResult(val);
    }, 400),

    getSearchResult(keywords) {
      if (!keywords) return;
      const searchData = this.originData.filter((d) => {
        const { nickname, remark = '' } = d;
        if (nickname && nickname.includes(keywords)) return true;
        if (remark && remark.includes(keywords)) return true;
        return false;
      });

      this.searchData = searchData;

      this.isEmpty = !this.searchData.length && keywords;
    },

    async getData() {
      this.keywords = '';
      this.searchData = [];
      this.isEmpty = false;
      const groupRes = await IMGetGroupList();
      const addressBooKRes = await IMGetAllFriendList();
      const orgRes = await Apis.userQueryByOrgId({
        orgId: this.systemUserInfo?.currentOrg?.id,
      });
      this.groupData = groupRes?.data || [];
      this.addressBooKData = addressBooKRes?.data || [];
      this.orgData = (orgRes?.data || []).map((d) => {
        const { nickName, picture, userId } = d;
        return {
          ...d,
          toUser: userId,
          avatar: picture,
          nickname: nickName,
        };
      });
      this.originData = [
        ...this.groupData,
        ...this.addressBooKData,
        ...this.orgData,
      ].filter(
        (o) => (o?.userId || o?.groupId) !== this.mainSessionWindow.toUser,
      );
      this.getHistoryList();
    },

    getHistoryList() {
      if (this.synergyHistory?.length) {
        this.searchData = this.synergyHistory
          .map((d) => {
            const target = this.originData.find(
              (o) => (o?.userId || o?.groupId) === d,
            );
            return {
              ...target,
            };
          })
          .filter((o) => o?.userId || o?.groupId);
      }
    },

    async startSynergy(synergy) {
      const { userId = '', groupId = '', avatar, nickname } = synergy;
      const targetId = userId || groupId;
      await this.setSynergyHistory([targetId]);
      const createSession = await IMGetByUserId(groupId || userId);
      const session = createSession.data;
      await IMSetSynergyStatus(session.sessId, true);
      await this.addSynergySessionList([
        {
          ...session,
          avatar,
          nickname,
        },
      ]);
      this.$emit('confirm', session);
    },

    handleCreateSynergy() {
      this.visibleSynergyMember = true;
    },

    handleGroupClose() {
      this.visibleSynergyMember = false;
    },
    handleCroupConfirm() {
      this.handleGroupClose();
      this.$emit('confirm');
    },
  },
};
</script>

<style scoped lang="scss">
.synergy-search {
  width: 360px;
  max-height: 460px;
  min-height: 120px;
  position: absolute;
  background-color: $bg-white-color;
  box-shadow: 0px 2px 8px 0px rgba(143, 149, 158, 0.1);
  border-radius: 4px;
  border: 1px solid $split-line-color;
  display: flex;
  flex-direction: column;
  padding-bottom: 6px;

  .title {
    font-size: 14px;
    font-weight: bold;
    color: $main-text-color;
    padding: 12px 14px 14px;
  }

  .search {
    width: 332px;
    height: 36px;
    min-height: 36px;
    background-color: $bg-white-color;
    border-radius: 6px;
    border: 1px solid $split-line-color;
    padding-left: 14px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    transition: all 0.3s;

    &.active {
      border-color: $primary-color;
    }

    .input-panel {
      flex: 1;
      height: 36px;
      padding-left: 8px;
      font-size: 14px;
      cursor: pointer;

      ::v-deep .el-input {
        border: none;
        height: 36px;

        .el-input__inner {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          padding: 0 32px 0 0;
        }

        input::placeholder {
          color: $tips-text-color;
          font-size: 14px;
        }
      }
    }

    .btn {
      width: 46px;
      height: 100%;
      background: #f2f4f8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }

  .history {
    font-size: 14px;
    color: $minor-text-color;
    margin: 22px 0 0 0;
    padding: 0 14px;
  }

  .scroll-view {
    flex: 1;
    padding: 0 6px;
    overflow-y: auto;
    margin-top: 16px;

    .item {
      height: 32px;
      background-color: $bg-white-color;
      border-radius: 6px;
      padding: 8px 12px 8px;
      display: flex;
      align-items: center;
      cursor: pointer;

      .img {
        display: block;
        width: 32px;
        height: 32px;
        border-radius: 4px;
      }

      .name {
        flex: 1;
        padding-left: 8px;
        font-size: 14px;
        color: $main-text-color;
      }

      &:hover {
        background-color: $bg-hover-grey-color;
      }
    }
  }

  .empty-data {
    height: 20px;
    font-size: 14px;
    margin: 14px auto 0;
    text-align: center;

    .link {
      color: $primary-color;
    }
  }

  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 991;
    left: 0;
    top: 0;
  }
}
</style>
