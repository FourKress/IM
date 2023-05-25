<template>
  <div id="client-im">
    <div class="empty-bg" v-if="!mainSessionWindow.sessId">
      <img :src="LsAssets.emptyData" alt="">
    </div>

    <ImView
      v-if="mainSessionWindow.sessId"
      :key="mainSessionWindow.sessId"
      :session="mainSessionWindow"
      :recordrtc="recordrtc"
      isMainSession
      @moreCallback="handleMoreCallback"
    />
    <!--  协同  -->
    <template v-for="item in sessionWindowList">
      <ImView :key="item.sessId" :session="item" :recordrtc="recordrtc" />
    </template>

    <Settings
      :visible.sync="visibleSettings"
      @createGroup="handleCreateGroup"
    />
    <GroupPanel
      :visible.sync="visibleGroupSettings"
      :isMember="isMember"
      @changeGroupMember="handleChangeGroupMember"
    ></GroupPanel>

    <LsCardDialog :visible.sync="visibleGroupMember" :isModalClose="false">
      <GroupMemberChat
        :panelType="groupMemberPanelType"
        @close="handleGroupClose"
        @confirm="handleCroupConfirm"
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
import { IM_HEADER_MORE_BTN_KEY, IM_GROUP_MEMBER_PANEL_TYPE } from '@lanshu/utils';

export default {
  name: 'MainIM',
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
      isMember: false,
      visibleSettings: false,
      visibleGroupMember: false,
      visibleGroupSettings: false,
      groupMemberPanelType: IM_GROUP_MEMBER_PANEL_TYPE.IS_CREATE,
      defaultMembers: [],
      defaultGroup: null,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['mainSessionWindow', 'sessionWindowList', 'actionWindow']),
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
  },
  methods: {
    ...mapActions('IMStore', ['setActionWindow', 'setMainSessionWindow']),

    handleMoreCallback(data) {
      const { command, session } = data;
      this.setActionWindow(session);
      this.defaultMembers = [session];
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
      const { type, members } = data;
      console.log(type, members);
      this.defaultMembers = members;
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
      console.log(session)
      if(session) {
        this.setMainSessionWindow(session);
      }
      this.handleGroupClose();
    },
  },
};
</script>

<style scoped lang="scss">
#client-im {
  flex: 1;
  height: 100%;
  border-left: 1px solid $split-line-color;
  box-shadow: 4px 0 10px -4px rgb(51 51 51 / 10%);
  min-width: 500px;
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
  transform: translate3d(0, 0, 0);

  border-radius: 0 10px 0 0;
  position: relative;

  .empty-bg {
    width: 100%;
    height: 100%;
    background: $bg-IM-color;
    position: absolute;
    z-index: -1;

    img {
      display: block;
      width: 200px;
      height: 200px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
