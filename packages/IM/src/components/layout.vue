<template>
  <div id="client-im" ref="ClientIM">
    <div class="empty-bg" v-if="!mainSessionWindow.sessId">
      <div class="empty-container">
        <img :src="LsAssets.notMsg" alt="" />
        <span class="tips">暂无消息</span>
      </div>
    </div>

    <ImView
      v-if="mainSessionWindow.sessId"
      :key="mainSessionWindow.sessId || ''"
      :session="mainSessionWindow"
      :recordrtc="recordrtc"
      @moreCallback="handleMoreCallback"
    />

    <Settings
      :visible.sync="visibleSettings"
      :isPosition="isPosition"
      @createGroup="handleCreateGroup"
    />
    <GroupPanel
      :visible.sync="visibleGroupSettings"
      :isMember="isMember"
      :isPosition="isPosition"
      @changeGroupMember="handleChangeGroupMember"
    ></GroupPanel>

    <LsCardDialog :visible.sync="visibleGroupMember" :isModalClose="false">
      <GroupMemberChat
        :panelType="groupMemberPanelType"
        @close="handleGroupClose"
        @confirm="handleCroupConfirm"
        :rawMembers="rawMembers"
        :defaultMembers="defaultMembers"
        :defaultGroup="defaultGroup"
      ></GroupMemberChat>
    </LsCardDialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Recordrtc from '../recordrtc';
import ImView from './im-view';
import Settings from './base-settings/settings';
import GroupMemberChat from './base-settings/group-member-chat';
import GroupPanel from './group-panel/index';
import { LsCardDialog, LsAssets } from '@lanshu/components';
import {
  IM_HEADER_MORE_BTN_KEY,
  IM_GROUP_MEMBER_PANEL_TYPE,
  SESSION_USER_TYPE,
} from '@lanshu/utils';

export default {
  name: 'MainIM',
  props: {
    isSettings: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      isSettings: this.isSettings,
    };
  },
  components: {
    ImView,
    Settings,
    GroupPanel,
    GroupMemberChat,
    LsCardDialog,
  },
  data() {
    return {
      LsAssets,
      recordrtc: null,
      IM_HEADER_MORE_BTN_KEY,
      IM_GROUP_MEMBER_PANEL_TYPE,
      SESSION_USER_TYPE,
      isMember: false,
      visibleSettings: false,
      visibleGroupMember: false,
      visibleGroupSettings: false,
      groupMemberPanelType: IM_GROUP_MEMBER_PANEL_TYPE.IS_CREATE,
      defaultMembers: [],
      defaultGroup: null,
      rawMembers: [],
      isPosition: false,
      resizeObserver: null,
    };
  },
  computed: {
    ...mapGetters('IMStore', [
      'mainSessionWindow',
      'actionWindow',
      'sessionList',
    ]),

    sessionMembers() {
      return this.sessionList.filter(
        (d) => d.toUserType === SESSION_USER_TYPE.IS_BASIC,
      );
    },
  },
  watch: {
    mainSessionWindow: {
      deep: true,
      handler(val, oldVal) {
        if (val.sessId === oldVal.sessId) return;
        this.visibleSettings = false;
        this.visibleGroupSettings = false;
      },
    },
  },
  created() {},
  mounted() {
    this.recordrtc = new Recordrtc();

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        this.isPosition = cr.width <= 700;
      }
    });
    this.resizeObserver = resizeObserver;
    this.resizeObserver.observe(this.$refs.ClientIM);
  },
  methods: {
    ...mapActions('IMStore', ['setActionWindow', 'setMainSessionWindow']),

    handleMoreCallback(data) {
      const { command, session } = data;
      this.setActionWindow(session);
      this.defaultMembers = [session];
      this.rawMembers = this.sessionMembers;
      switch (command) {
        case this.IM_HEADER_MORE_BTN_KEY.IS_OPEN_SET:
          this.visibleSettings = true;
          break;
        case this.IM_HEADER_MORE_BTN_KEY.IS_CREATE_GROUP:
          this.handleCreateGroup();
          break;
        case this.IM_HEADER_MORE_BTN_KEY.IS_OPEN_GROUP_MEMBER:
          this.handleOpenGroupSet(true);
          break;
        case this.IM_HEADER_MORE_BTN_KEY.IS_OPEN_GROUP_SET:
          this.handleOpenGroupSet(false);
          break;
        default:
          break;
      }
    },

    handleChangeGroupMember(data) {
      const { type, defaultMembers, members = this.sessionMembers } = data;
      console.log(type, defaultMembers, members);
      this.defaultMembers = defaultMembers;
      this.rawMembers = members;
      this.defaultGroup = this.actionWindow;
      this.groupMemberPanelType = type;
      this.visibleGroupMember = true;
    },

    handleCreateGroup() {
      this.groupMemberPanelType = this.IM_GROUP_MEMBER_PANEL_TYPE.IS_CREATE;
      this.visibleGroupMember = true;
    },
    handleOpenGroupSet(isMember) {
      this.visibleGroupSettings = true;
      this.isMember = isMember;
    },

    handleGroupClose() {
      this.visibleGroupMember = false;
      this.defaultMembers = [];
      this.defaultGroup = null;
    },
    handleCroupConfirm(session) {
      if (session) {
        this.setMainSessionWindow(session);
      }
      this.handleGroupClose();
    },
  },

  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.observe(this.$refs.ClientIM);
    }
  },
};
</script>

<style scoped lang="scss">
#client-im {
  flex: 1 1 0;
  height: 100%;
  border-left: 2px solid $split-line-color;
  min-width: 400px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
  transform: translate3d(0, 0, 0);
  position: relative;

  .empty-bg {
    width: 100%;
    height: 100%;
    background: $bg-IM-color;
    position: absolute;
    z-index: -1;

    .empty-container {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
        display: block;
        width: 141px;
        height: 124px;
      }

      .tips {
        padding-top: 16px;
        font-size: 14px;
        color: $minor-text-color;
      }
    }
  }
}
</style>
