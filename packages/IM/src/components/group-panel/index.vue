<template>
  <div
    class="im-group-settings"
    :style="isPosition && positionCss"
    v-if="visible"
  >
    <div class="top">
      <div class="left">
        <span
          class="btn"
          :class="selfIsMember && 'active'"
          @click="handleChooseTab(true)"
        >
          群成员
        </span>
        <span
          class="btn"
          :class="!selfIsMember && 'active'"
          @click="handleChooseTab(false)"
        >
          群设置
        </span>
      </div>
      <LsIcon
        class="close-icon"
        width="14"
        height="14"
        render-svg
        icon="a-icon_close2x"
        @click="handleClose"
      ></LsIcon>
    </div>

    <Member v-if="selfIsMember" v-on="$listeners" @checkMember="handleFriend" />
    <Settings v-on="$listeners" v-else @checkMember="handleFriend" />

    <LsCardDialog :visible.sync="showFriendDialog">
      <LsFriendPanel
        :friend-info="friendInfo"
        :position="position"
        :config="friendPanelConfig"
        @update="handleCloseDialog"
        @sendApply="handleSendApply"
        @sendMsg="handleSendMsg"
        @sendVideo="handleSendVideo"
        @sendAudio="handleSendAudio"
      />
    </LsCardDialog>
  </div>
</template>

<script>
import { FriendMixins } from '@lanshu/utils';
import { LsCardDialog, LsFriendPanel, LsIcon } from '@lanshu/components';
import { mapGetters } from 'vuex';
import Settings from './settings';
import Member from './member';
import { IMGetOneFriend, IMGetUserProfile } from '../../IM-SDK';

export default {
  name: 'Group-panel',
  mixins: [FriendMixins],
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    isMember: {
      type: Boolean,
      default: true,
      required: true,
    },
    isPosition: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LsCardDialog,
    LsFriendPanel,
    LsIcon,
    Settings,
    Member,
  },
  computed: {
    ...mapGetters('IMStore', ['userInfo']),
  },
  data() {
    return {
      selfIsMember: true,
      positionCss: {
        position: 'absolute',
        top: 0,
        right: 0,
      },
      friendPanelConfig: {},
    };
  },
  watch: {
    visible() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.selfIsMember = this.isMember;
      this.tabType = this.isMember;
    },
    handleClose() {
      this.$emit('update:visible', false);
    },

    handleChooseTab(isMember) {
      if (isMember === this.selfIsMember) return;
      this.selfIsMember = isMember;
    },

    async handleFriend(member, event) {
      const { userId } = member;
      await this.openFriendDialog(event, async () => {
        const friendInfo = (await IMGetOneFriend(userId))?.data || {};
        if (friendInfo?.userId) {
          this.friendPanelConfig = this.isGroup
            ? { isPass: true }
            : { isDetails: true };
        } else {
          this.friendPanelConfig = { isApply: true };
        }

        const userProfile = (await IMGetUserProfile(userId))?.data || {};
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
.im-group-settings {
  width: 299px;
  min-width: 299px;
  height: 100%;
  background-color: $bg-white-color;
  border-left: 1px solid $split-line-color;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;

  .top {
    width: 100%;
    height: 48px;
    line-height: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 13px 20px;
    box-shadow: 0 0 0 1px $split-line-color;

    .left {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      font-size: 16px;
      color: $main-text-color;
      font-weight: bold;

      .btn {
        margin-left: 23px;
        cursor: pointer;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        transition: all 0.3s;

        &::after {
          content: '';
          width: 20px;
          height: 3px;
          background: #fff;
          border-radius: 3px;
          margin-top: 4px;
          transition: all 0.3s;
        }

        &:first-child {
          margin-left: 0;
        }

        &.active {
          color: $primary-color;

          &::after {
            background: $primary-color;
          }
        }
      }
    }

    .close-icon {
      cursor: pointer;
    }
  }
}
</style>
