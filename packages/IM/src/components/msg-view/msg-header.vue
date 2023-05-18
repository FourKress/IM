<template>
  <div class="top">
    <div class="left">
      <div class="img">
        <img :src="toAvatar" alt="" />
      </div>
      <div class="info">
        <span class="name">{{ session.nickname }}</span>
        <!--        <span class="tips">顶顶顶顶</span>-->
      </div>
    </div>
    <div class="right">
      <!--      <div class="btn" @click="handleCloseSession">-->
      <!--        <LsIcon render-svg icon="a-icon_sp2x"></LsIcon>-->
      <!--      </div>-->
      <div class="btn">
        <LsIcon
          render-svg
          icon="a-icon_sp2x"
          v-if="!isGroup && groupRoleManager.whoCanStartNetworkCall <= groupRole"
          @click="handleStartTrtc(NETWORK_CALL_TYPE.IS_VIDEO)"
        ></LsIcon>
      </div>
      <div class="btn">
        <LsIcon
          render-svg
          icon="a-icon_yy2x"
          v-if="!isGroup && groupRoleManager.whoCanStartNetworkCall <= groupRole"
          @click="handleStartTrtc(NETWORK_CALL_TYPE.IS_AUDIO)"
        ></LsIcon>
      </div>
      <div class="btn">
        <el-dropdown trigger="click" @command="handleCommand">
          <LsIcon render-svg icon="a-icon_more2x"></LsIcon>
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { LsIcon } from '@lanshu/components';
import {
  IM_HEADER_MORE_BTN_KEY,
  SESSION_USER_TYPE,
  CLIENT_TYPE,
  NETWORK_CALL_TYPE,
} from '@lanshu/utils';
import { renderProcess } from '@lanshu/render-process';

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
  },
  data() {
    return {
      IM_HEADER_MORE_BTN_KEY,
      NETWORK_CALL_TYPE,
    };
  },
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

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      .name {
        font-size: 16px;
        font-weight: bold;
        color: $main-text-color;
        margin-bottom: 5px;
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
