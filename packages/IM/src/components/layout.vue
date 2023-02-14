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
      @changeGroupMember='handleChangeGroupMember'
    ></GroupPanel>

    <LsCardDialog :visible.sync="visibleGroupMember" :isModalClose="false">
      <GroupMemberChat
        :panelType='groupMemberPanelType'
        @close="handleGroupClose"
        @confirm="handleCroupConfirm"
      ></GroupMemberChat>
    </LsCardDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
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
    };
  },
  computed: {
    ...mapGetters('IMStore', ['mainSessionWindow', 'sessionWindowList']),
  },
  watch: {
    mainSessionWindow: {
      deep: true,
      handler() {
        console.log(213);
        this.visibleSettings = false;
        this.visibleGroupSettings = false;
      }
    }
  },
  created() {},
  mounted() {
    this.recordrtc = new Recordrtc();
  },
  methods: {
    handleMoreCallback(type) {
      switch (type) {
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
        default: break;
      }
    },

    handleChangeGroupMember(type) {
      console.log(type);
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
    },
    handleCroupConfirm() {
      this.visibleGroupMember = false;
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
