<template>
  <div id="client-im">
    <ImView
      v-if='mainSessionWindow.sessId'
      :key="mainSessionWindow.sessId"
      :session="mainSessionWindow"
      :recordrtc='recordrtc'
      isMainSession
      @openSettings='handleOpenSettings'
      @createGroup='handleCreateGroup'
    />
    <template v-for="item in sessionWindowList">
      <ImView :key="item.sessId" :session="item" :recordrtc='recordrtc' />
    </template>

    <Settings :visible.sync='visibleSettings' @createGroup='handleCreateGroup' />
    <GroupSettings :visible.sync='visibleGroupSettings' @createGroup='handleCreateGroup'></GroupSettings>

    <LsCardDialog :visible.sync='visibleCreate' :isModalClose='false'>
      <CreateGroupChat @close='handleGroupClose' @confirm='handleCroupConfirm'></CreateGroupChat>
    </LsCardDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Recordrtc from '../recordrtc';

import ImView from './im-view';
import Settings from './settings';
import GroupSettings from './group-settings';
import CreateGroupChat from './create-group-chat';
import { LsCardDialog } from '@lanshu/components';

export default {
  name: 'MainIM',
  components: {
    ImView,
    Settings,
    GroupSettings,
    CreateGroupChat,
    LsCardDialog
  },
  data() {
    return {
      recordrtc: null,
      visibleSettings: false,
      visibleCreate: false,
      visibleGroupSettings: false,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['mainSessionWindow', 'sessionWindowList']),
  },
  created() {},
  mounted() {
    this.recordrtc = new Recordrtc();
  },
  methods: {
    handleOpenSettings() {
      this.visibleSettings = true;
    },
    handleCreateGroup() {
      this.visibleCreate = true;
    },

    handleGroupClose() {
      this.visibleCreate = false;
    },
    handleCroupConfirm() {
      this.visibleCreate = false;
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
