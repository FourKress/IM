<template>
  <div id="client-im">
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
import { LsCardDialog } from '@lanshu/components';
import { IMHeaderMoreBtnKey, IMGroupMemberPanelType } from '@lanshu/utils';

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
      recordrtc: null,
      IMHeaderMoreBtnKey,
      IMGroupMemberPanelType,
      isMember: false,
      visibleSettings: false,
      visibleGroupMember: false,
      visibleGroupSettings: false,
      groupMemberPanelType: IMGroupMemberPanelType.isCreate,
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
      handler() {
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
        case this.IMHeaderMoreBtnKey.isOpenSet:
          this.visibleSettings = true;
          break;
        case this.IMHeaderMoreBtnKey.isCreateGroup:
          this.handleCreateGroup();
          break;
        case this.IMHeaderMoreBtnKey.isOpenGroupMember:
          this.handleOpenGroupSet(true);
          break;
        case this.IMHeaderMoreBtnKey.isOpenGroupSet:
          this.handleOpenGroupSet(false);
          break;
        default:
          break;
      }
    },

    handleChangeGroupMember(data) {
      const { type, members, group } = data;
      console.log(type, members, group);
      this.defaultMembers = members;
      this.defaultGroup = this.actionWindow;
      this.groupMemberPanelType = type;
      this.visibleGroupMember = true;
    },

    handleCreateGroup() {
      this.groupMemberPanelType = this.IMGroupMemberPanelType.isCreate;
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
}
</style>
