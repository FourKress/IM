<template>
  <div class="group-panel-settings">
    <div class="row">
      <RowChat title="群名称">
        <el-input
          placeholder="请输入"
          size="small"
          v-model="groupInfo.nickname"
          :disabled="groupRoleManager.whoCanSetGroupInfo > groupRole"
          @change="handleChangeGroupName"
        ></el-input>
      </RowChat>
      <!--      <RowChat title="群公告" @click="createGroup">-->
      <!--        <el-input placeholder="请输入" size="small"></el-input>-->
      <!--      </RowChat>-->
      <RowChat label="群二维码" @callback="showGroupQrcode" show-right-btn />
    </div>

    <div class="row">
      <RowChat title="我的群备注">
        <el-input
          placeholder="请输入"
          size="small"
          v-model="groupInfo.remark"
          @change="handleChangeRemark"
        ></el-input>
      </RowChat>
      <RowChat title="我的群昵称">
        <el-input
          placeholder="请输入"
          size="small"
          v-model="groupInfo.alias"
          @change="handleChangeAlias"
        ></el-input>
      </RowChat>
    </div>

    <MsgTopAndSilence />

    <div class="row">
      <RowChat label="群管理" @callback="openGroupManager" show-right-btn />
      <RowChat
        label="聊天记录"
        @callback="openGroupHistoryMsg"
        show-right-btn
      />
    </div>

    <div class="clear-btn" @click="handleDeleteHistoryMsg">清空聊天记录</div>
    <div class="clear-btn" @click="handleOutGroup">退出群聊</div>
    <div
      class="clear-btn"
      @click="handleRemoveGroup"
      v-if="groupRole === GROUP_ROLE_TYPE.IS_OWNER"
    >
      解散群聊
    </div>

    <Manager
      :visibleDrawer.sync="visibleDrawer"
      :groupRole="groupRole"
      v-on="$listeners"
      @groupRecord="handleGroupRecord"
      @groupTransfer="handleGroupTransfer"
    />

    <Record :visibleDrawer.sync="visibleRecord" />

    <GroupTransfer
      :visibleDrawer.sync="visibleGroupTransfer"
      @confirm="handleConfirmTransfer"
    ></GroupTransfer>

    <HistoryMsg :visibleDrawer.sync="visibleHistoryMsgDrawer" />

    <LsCardDialog :visible.sync="groupQrcodeVisible">
      <LsQrcodePanel
        :position="qrcodePosition"
        tips="加入群聊  二维码7天内有效"
        :qrcodeInfo="{
          ...actionWindow,
          qrcodeId: actionWindow.toUser,
          qrcodeType: 'group',
        }"
      />
    </LsCardDialog>
  </div>
</template>

<script>
import { LsIcon, LsCardDialog, LsQrcodePanel } from '@lanshu/components';
import {
  IMGetGroupAttribute,
  IMSetGroupAttribute,
  IMSetGroupAlias,
  IMGetMyGroupMemberInfo,
  IMClearMessage,
  IMGetGroupRoleManagerList,
  IMOwnerTransfer,
  IMExitGroupChat,
  IMDissolveGroupChat,
  IMSetGroupRemark,
} from '../../IM-SDK';
import RowChat from './row-chat';
import Manager from './manager';
import Record from './record';
import GroupTransfer from './group-transfer';
import MsgTopAndSilence from '../base-settings/msgTopAndSilence';
import HistoryMsg from './history-msg.vue';
import { mapActions, mapGetters } from 'vuex';
import { GROUP_ROLE_TYPE } from '@lanshu/utils';

export default {
  name: 'Group-settings',
  components: {
    LsIcon,
    RowChat,
    Manager,
    Record,
    GroupTransfer,
    MsgTopAndSilence,
    LsCardDialog,
    LsQrcodePanel,
    HistoryMsg,
  },
  data() {
    return {
      GROUP_ROLE_TYPE,
      visibleDrawer: false,
      visibleHistoryMsgDrawer: false,
      visibleRecord: false,
      visibleGroupTransfer: false,
      groupInfo: {},
      groupRole: null,
      groupRoleManager: {},
      groupQrcodeVisible: false,
      qrcodePosition: {},
      groupNickname: '',
    };
  },
  computed: {
    ...mapGetters('IMStore', ['actionWindow', 'refreshGroupRoleManager']),
    isGroupManager() {
      return [GROUP_ROLE_TYPE.IS_MANAGE, GROUP_ROLE_TYPE.IS_OWNER].includes(
        this.groupRole,
      );
    },
  },
  watch: {
    refreshGroupRoleManager() {
      this.getGroupRoleManagerList();
      this.getMyGroupMemberInfo();
    },
  },
  mounted() {
    this.getGroupRoleManagerList();
    this.getGroupInfo();
    this.getMyGroupMemberInfo();
  },
  methods: {
    ...mapActions('IMStore', [
      'setRefreshGroupRoleManager',
      'setMainSessionWindow',
    ]),

    async getGroupInfo() {
      const res = await IMGetGroupAttribute(this.actionWindow.toUser);
      const { nickname, avatar, groupId, remark } = res?.data || {};
      this.groupNickname = nickname;
      this.groupInfo = {
        ...this.groupInfo,
        nickname,
        avatar,
        groupId,
        remark,
      };
    },
    getGroupRoleManagerList() {
      IMGetGroupRoleManagerList(this.actionWindow.toUser)
        .then((res) => {
          console.log(res.data);
          this.groupRoleManager = res?.data || {};
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getMyGroupMemberInfo() {
      const res = await IMGetMyGroupMemberInfo(this.actionWindow.toUser);
      const { alias, role } = res?.data || {};
      this.groupRole = role;
      this.groupInfo = {
        ...this.groupInfo,
        alias,
      };
    },

    createGroup() {
      this.$emit('createGroup');
    },

    showGroupQrcode(event) {
      this.groupQrcodeVisible = true;
      const { clientY, clientX } = event;
      this.qrcodePosition = {
        top: `${clientY}px`,
        left: `${clientX - 400}px`,
      };
    },

    handleChangeGroupName(val) {
      if (!val) {
        this.groupInfo.nickname = this.groupNickname;
        return;
      }
      IMSetGroupAttribute(this.groupInfo.groupId, val, this.groupInfo.avatar);
    },

    handleChangeAlias(val) {
      IMSetGroupAlias(this.groupInfo.groupId, val);
    },

    async handleChangeRemark(val) {
      await IMSetGroupRemark(this.groupInfo.groupId, val);
      this.setMainSessionWindow({
        ...this.actionWindow,
        nickname: val,
      });
    },

    handleDeleteHistoryMsg() {
      this.$LConfirm({
        title: '确定清空聊天记录？',
        content: '聊天记录将在你的所有设备同步清空，不会影响其他群成员',
      }).then(() => {
        IMClearMessage(this.actionWindow.sessId).then(() => {
          this.setRefreshMsg(Date.now());
          this.$message.success('清空聊天记录成功');
          console.log('clearMessage Success');
        });
      });
    },
    handleOutGroup() {
      if (this.groupRole === GROUP_ROLE_TYPE.IS_OWNER) {
        this.$LConfirm({
          title: '提示',
          content: '你是群主，需要把群主转让后才能退出群聊',
          confirmBtnText: '去转让',
        }).then(() => {
          this.handleGroupTransfer();
        });
        return;
      }
      this.$LConfirm({
        title: '确定退出群聊？',
        content: `你要退出“${this.actionWindow.nickname}”吗？退出后将无法查看历史记录且不会再收到此群聊的消息`,
      }).then(() => {
        IMExitGroupChat(this.groupInfo.groupId).then(() => {
          this.setMainSessionWindow({});
        });
      });
    },
    handleRemoveGroup() {
      this.$LConfirm({
        title: '确定解散群聊？',
        content: '解散会移出所有群成员，且无法再查看此群聊的历史记录',
      }).then(() => {
        IMDissolveGroupChat(this.groupInfo.groupId).then(() => {
          this.setMainSessionWindow({});
        });
      });
    },
    openGroupManager() {
      this.visibleDrawer = true;
    },

    openGroupHistoryMsg() {
      this.visibleHistoryMsgDrawer = true;
    },

    handleGroupRecord() {
      this.visibleRecord = true;
    },
    handleGroupTransfer() {
      this.visibleGroupTransfer = true;
    },
    handleConfirmTransfer(userId) {
      console.log(userId);
      IMOwnerTransfer(this.groupInfo.groupId, userId).then(() => {
        this.setRefreshGroupRoleManager(Date.now());
        this.$message.success('群主转让成功');
      });
    },
  },
};
</script>

<style scoped lang="scss">
.group-panel-settings {
  height: calc(100% - 42px);
  box-sizing: border-box;
  padding: 0 20px;
  overflow-x: hidden;
  overflow-y: auto;
}
.row {
  padding: 26px 0 6px 0;
  border-bottom: 1px solid $split-line-color;

  &:first-child {
    padding-top: 16px;
    border-top: none;
  }

  .check-btn {
    width: 28px;
    height: 16px;

    ::v-deep {
      .el-switch {
        transform-origin: center;
        transform: scale(0.8) translate(-7px, -6px);
      }
    }
  }
}

.clear-btn {
  width: 260px;
  height: 40px;
  background: $bg-grey-color;
  border-radius: 6px;
  margin: 15px auto 0;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  color: #f65951;
  cursor: pointer;
}
</style>
