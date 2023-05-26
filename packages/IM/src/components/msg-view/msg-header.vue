<template>
  <div class="top">
    <div class="left">
      <div class="img" @click="handleFriend">
        <img :src="toAvatar" alt="" />
      </div>
      <div class="info">
        <span class="name">{{ session.nickname }}</span>
        <span v-if="isGroup">({{ members.length }})</span>
        <!--        <span class="tips">顶顶顶顶</span>-->
      </div>
    </div>
    <div class="right">
      <!--      <div class="btn" @click="handleCloseSession">-->
      <!--        <LsIcon render-svg icon="a-icon_sp2x"></LsIcon>-->
      <!--      </div>-->
      <div class="btn">
        <el-tooltip
          class="item"
          effect="dark"
          content="视频"
          placement="top"
        >
          <!--        || groupRoleManager.whoCanStartNetworkCall <= groupRole-->
          <LsIcon
            render-svg
            icon="a-icon_sp2x"
            v-if="!isGroup"
            @click="handleStartTrtc(NETWORK_CALL_TYPE.IS_VIDEO)"
          ></LsIcon>
        </el-tooltip>
      </div>
      <div class="btn">
        <el-tooltip
          class="item"
          effect="dark"
          content="语音"
          placement="top"
        >
          <!--        || groupRoleManager.whoCanStartNetworkCall <= groupRole-->
          <LsIcon
            render-svg
            icon="a-icon_yy2x"
            v-if="!isGroup"
            @click="handleStartTrtc(NETWORK_CALL_TYPE.IS_AUDIO)"
          ></LsIcon>
        </el-tooltip>
      </div>
      <div class="btn" v-if="!isGroup || groupRole > 0">
        <el-dropdown trigger="click" @command="handleCommand">
          <el-tooltip
            class="item"
            effect="dark"
            content="更多"
            placement="top"
          >
            <LsIcon render-svg icon="a-icon_more2x"></LsIcon>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown" v-if="isGroup">
            <el-dropdown-item
              :command="IM_HEADER_MORE_BTN_KEY.IS_OPEN_GROUP_MEMBER"
            >
              <div class="send-down-row">
                <LsIcon render-svg icon="pop_cd_cjql"></LsIcon>
                <span>群成员</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item
              :command="IM_HEADER_MORE_BTN_KEY.IS_OPEN_GROUP_SET"
            >
              <div class="send-down-row">
                <LsIcon render-svg icon="pop_cd_sz"></LsIcon>
                <span>群设置</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu slot="dropdown" v-else>
            <el-dropdown-item :command="IM_HEADER_MORE_BTN_KEY.IS_CREATE_GROUP">
              <div class="send-down-row">
                <LsIcon render-svg icon="pop_cd_cjql"></LsIcon>
                <span>创建群聊</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item :command="IM_HEADER_MORE_BTN_KEY.IS_OPEN_SET">
              <div class="send-down-row">
                <LsIcon render-svg icon="pop_cd_sz"></LsIcon>
                <span>设置</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <LsCardDialog :visible.sync="showFriendDialog">
      <LsFriendPanel
        :friend-info="friendInfo"
        :position="position"
        :config="{ isDetails: true }"
        @update="handleCloseDialog"
      />
    </LsCardDialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { LsIcon, LsCardDialog, LsFriendPanel } from '@lanshu/components';
import {
  IM_HEADER_MORE_BTN_KEY,
  SESSION_USER_TYPE,
  CLIENT_TYPE,
  NETWORK_CALL_TYPE,
  FriendMixins,
} from '@lanshu/utils';
import { renderProcess } from '@lanshu/render-process';
import {
  IMGetGroupMemberList,
  IMGetOneFriend,
  IMGetUserProfile,
} from '../../IM-SDK';

export default {
  name: 'Msg-header',
  props: {
    groupRole: {
      type: Number,
      default: -1,
    },
    groupRoleManager: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    LsIcon,
    LsCardDialog,
    LsFriendPanel,
  },
  data() {
    return {
      IM_HEADER_MORE_BTN_KEY,
      NETWORK_CALL_TYPE,
      showFriendDialog: false,
      members: [],
    };
  },
  mixins: [FriendMixins],
  computed: {
    ...mapGetters('IMStore', ['userInfo', 'refreshMembers']),

    session() {
      return this.$attrs.session;
    },
    toAvatar() {
      return this.session.avatar;
    },
    isGroup() {
      return this.session?.toUserType === SESSION_USER_TYPE.IS_GROUP;
    },
  },
  watch: {
    refreshMembers() {
      this.getGroupMemberList();
    },
  },
  mounted() {
    if (this.isGroup) {
      this.getGroupMemberList();
    }
  },
  methods: {
    ...mapActions('IMStore', ['removeSessionWindowList']),

    handleCommand(command) {
      this.$emit('moreCallback', {
        command,
        session: this.session,
      });
    },

    async handleStartTrtc(NETWORK_CALL_TYPE) {
      const platform = CLIENT_TYPE.IS_PC;
      await renderProcess.setStore('TRTC_SESSION', this.session);
      await renderProcess.setStore('TRTC_CALL_INFO', {
        type: NETWORK_CALL_TYPE,
        roomId: Date.now(),
        isBeInvited: false,
        platform,
      });

      renderProcess.openTRTCWindow(platform);
    },

    handleCloseSession() {
      if (this.isMainSession) return;
      this.removeSessionWindowList(this.session);
    },

    async handleFriend(event) {
      if (this.isGroup) return;
      const { toUser } = this.session;
      const friendInfo = (await IMGetOneFriend(toUser))?.data || {};
      const userProfile = (await IMGetUserProfile(toUser))?.data || {};
      const { remark, desc } = friendInfo;
      this.openFriendDialog(
        {
          ...userProfile,
          remark,
          desc,
        },
        event,
      );
    },

    getGroupMemberList() {
      // nextSeq默认从0开始
      IMGetGroupMemberList(this.session.toUser, 0).then((res) => {
        const { members = [] } = res;
        this.members = members;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.top {
  height: 66px;
  box-sizing: border-box;
  background-color: $bg-white-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;

  .left {
    flex: 1;
    display: flex;
    align-items: center;

    .img {
      display: block;
      width: 46px;
      height: 46px;
      border-radius: 6px;
      margin-right: 10px;
      overflow: hidden;
      cursor: pointer;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .info {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-weight: bold;

      .name {
        font-size: 16px;
        color: $main-text-color;
        height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 200px;
      }

      .tips {
        font-size: 12px;
        color: $tips-text-color;
      }
    }
  }

  .right {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .btn {
      margin-right: 20px;
      cursor: pointer;
      width: 16px;
      height: 16px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
