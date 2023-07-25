<template>
  <div class="top" :style="headerStyle">
    <div class="left">
      <div class="img" @click="handleFriend">
        <img :src="toAvatar" alt="" />
      </div>
      <div class="info">
        <span class="name">{{ session.nickname }}</span>
        <span v-if="isGroup">({{ memberCount }})</span>
        <!--        <span class="tips">顶顶顶顶</span>-->
      </div>
    </div>
    <div class="right">
      <div class="btn" v-if="!isGroup">
        <el-tooltip class="item" effect="dark" content="视频" placement="top">
          <!--        || groupRoleManager.whoCanStartNetworkCall <= groupRole-->
          <LsIcon
            render-svg
            icon="a-icon_sp2x"
            @click="handleStartTrtc(NETWORK_CALL_TYPE.IS_VIDEO)"
          ></LsIcon>
        </el-tooltip>
      </div>
      <div class="btn" v-if="!isGroup">
        <el-tooltip class="item" effect="dark" content="语音" placement="top">
          <!--        || groupRoleManager.whoCanStartNetworkCall <= groupRole-->
          <LsIcon
            render-svg
            icon="a-icon_yy2x"
            @click="handleStartTrtc(NETWORK_CALL_TYPE.IS_AUDIO)"
          ></LsIcon>
        </el-tooltip>
      </div>
      <div class="btn" v-if="isSettings && (!isGroup || groupRole > 0)">
        <el-dropdown trigger="click" @command="handleCommand">
          <el-tooltip class="item" effect="dark" content="更多" placement="top">
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

      <slot name="rightBtn"></slot>
    </div>

    <LsCardDialog :visible.sync="showFriendDialog">
      <LsFriendPanel
        :friend-info="friendInfo"
        :position="position"
        :config="friendPanelConfig"
        @update="handleCloseDialog"
        @sendMsg="handleSendMsg"
      />
    </LsCardDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { LsIcon, LsCardDialog, LsFriendPanel } from '@lanshu/components';
import {
  IM_HEADER_MORE_BTN_KEY,
  SESSION_USER_TYPE,
  CLIENT_TYPE,
  NETWORK_CALL_TYPE,
  FriendMixins,
} from '@lanshu/utils';
import { renderProcess } from '@lanshu/render-process';
import { IMGetOneFriend, IMGetUserProfile } from '../../IM-SDK';

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
    headerStyle: {
      type: Object,
      default: () => {},
    },
    memberCount: {
      type: Number,
      default: 0,
    },
  },
  inject: {
    isSettings: {
      default: true,
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
      friendPanelConfig: {},
    };
  },
  mixins: [FriendMixins],
  computed: {
    ...mapGetters('IMStore', ['userInfo']),

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
  methods: {
    handleCommand(command) {
      this.$emit('moreCallback', {
        command,
        session: {
          ...this.session,
          userId: this.session.toUser,
        },
      });
    },

    async handleStartTrtc(NETWORK_CALL_TYPE) {
      const platform = CLIENT_TYPE.IS_MOBILE;
      await renderProcess.setStore('TRTC_SESSION', this.session);
      await renderProcess.setStore('TRTC_CALL_INFO', {
        type: NETWORK_CALL_TYPE,
        roomId: Number(Date.now().toString().substring(4, 13)),
        isBeInvited: false,
        platform,
      });

      renderProcess.openTRTCWindow(platform);
    },

    async handleFriend(event) {
      if (this.isGroup) return;

      await this.openFriendDialog(event, async () => {
        const { toUser } = this.session;
        const friendInfo = (await IMGetOneFriend(toUser))?.data || {};

        if (friendInfo?.userId) {
          this.friendPanelConfig = this.isGroup
            ? { isPass: true }
            : { isDetails: true };
        } else {
          this.friendPanelConfig = { isApply: true };
        }

        const userProfile = (await IMGetUserProfile(toUser))?.data || {};
        const { remark, desc } = friendInfo;
        return {
          ...userProfile,
          remark,
          desc,
        };
      });

      if (this.friendInfo?.dep) {
        this.friendPanelConfig = { isPass: true };
      }
    },
  },
};
</script>

<style scoped lang="scss">
.top {
  height: 56px;
  box-sizing: border-box;
  background-color: $bg-white-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;

  .left {
    flex: 1;
    display: flex;
    align-items: center;

    .img {
      display: block;
      width: 40px;
      height: 40px;
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

    ::v-deep .btn {
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
