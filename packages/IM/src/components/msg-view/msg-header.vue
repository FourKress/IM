<template>
  <div class="top" :style="headerStyle">
    <div class="left">
      <div class="img" @click="handleFriend">
        <img :src="toAvatar" alt="" />
      </div>
      <div class="info">
        <span class="name">{{ session.nickname }}</span>
        <span class="count" v-if="isGroup">
          <LsIcon
            render-svg
            width="14"
            height="14"
            icon="ls-icon-renshu"
          ></LsIcon>
          {{ memberCount }}
        </span>
        <div v-if="isBot" class="bot-tag">机器人</div>
      </div>
    </div>
    <div class="right" v-if="!isBot">
      <div class="btn" v-if="!isGroup && isNotMe">
        <el-tooltip class="item" effect="dark" content="视频" placement="top">
          <!--        || groupRoleManager.whoCanStartNetworkCall <= groupRole-->
          <LsIcon
            size="16"
            icon="a-icon_sp2x"
            @click="handleStartTrtc(NETWORK_CALL_TYPE.IS_VIDEO)"
          ></LsIcon>
        </el-tooltip>
      </div>
      <div class="btn" v-if="!isGroup && isNotMe">
        <el-tooltip class="item" effect="dark" content="语音" placement="top">
          <!--        || groupRoleManager.whoCanStartNetworkCall <= groupRole-->
          <LsIcon
            size="16"
            icon="a-icon_yy2x"
            @click="handleStartTrtc(NETWORK_CALL_TYPE.IS_AUDIO)"
          ></LsIcon>
        </el-tooltip>
      </div>
      <div class="btn" v-if="isSettings && (!isGroup || groupRole > 0)">
        <el-dropdown trigger="click" @command="handleCommand">
          <el-tooltip class="item" effect="dark" content="更多" placement="top">
            <LsIcon size="16" icon="a-icon_more2x"></LsIcon>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown" v-if="isGroup">
            <el-dropdown-item
              :command="IM_HEADER_MORE_BTN_KEY.IS_OPEN_GROUP_MEMBER"
            >
              <LsIcon size="14" color="#777" icon="pop_cd_cjql"></LsIcon>
              <span>群成员</span>
            </el-dropdown-item>
            <el-dropdown-item
              :command="IM_HEADER_MORE_BTN_KEY.IS_OPEN_GROUP_SET"
            >
              <LsIcon size="14" color="#777" icon="pop_cd_sz"></LsIcon>
              <span>群设置</span>
            </el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu slot="dropdown" v-else>
            <el-dropdown-item
              v-if="isNotMe"
              :command="IM_HEADER_MORE_BTN_KEY.IS_CREATE_GROUP"
            >
              <LsIcon size="14" color="#777" icon="pop_cd_cjql"></LsIcon>
              <span>创建群聊</span>
            </el-dropdown-item>
            <el-dropdown-item :command="IM_HEADER_MORE_BTN_KEY.IS_OPEN_SET">
              <LsIcon size="14" color="#777" icon="pop_cd_sz"></LsIcon>
              <span>设置</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <slot name="rightBtn"></slot>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { LsIcon } from '@lanshu/components';
import {
  IM_HEADER_MORE_BTN_KEY,
  SESSION_USER_TYPE,
  NETWORK_CALL_TYPE,
  startTrtc,
} from '@lanshu/utils';

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
    isBot() {
      return this.session?.toUserType === SESSION_USER_TYPE.IS_BOT;
    },
    isNotMe() {
      return this.userInfo.userId !== this.session.toUser;
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
      await startTrtc(this.session, NETWORK_CALL_TYPE);
    },

    async handleFriend(event) {
      if (this.isBot || this.isGroup) return;
      const member = {
        userId: this.session.toUser,
      };
      this.$emit('checkMember', member, event);
    },
  },
};
</script>

<style scoped lang="scss">
.top {
  height: 48px;
  box-sizing: border-box;
  background-color: $bg-white-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;

  .left {
    flex: 1;
    display: flex;
    align-items: center;

    .img {
      display: block;
      width: 32px;
      height: 32px;
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

      .name {
        font-size: 16px;
        color: $main-text-color;
        height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 200px;
        font-weight: bold;
      }

      .count {
        font-size: 14px;
        color: #87a1cd;
        display: flex;
        align-self: end;
        align-items: center;
        padding-left: 13px;

        .ls-icon-wrap {
          margin-right: 3px;
        }
      }

      .bot-tag {
        width: 38px;
        padding: 2px 0;
        margin-left: 4px;
        text-align: center;
        background: linear-gradient(110deg, #d2fff2 -11%, #b8c4ff 98%);
        border-radius: 4px;
        overflow: hidden;
        font-size: 10px;
        color: $primary-color;
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
      line-height: 16px;
      color: #333;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
