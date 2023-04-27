<template>
  <div class="group-panel-settings">
    <div class="row">
      <RowChat title="群名称" @click="createGroup">
        <el-input placeholder="请输入" size="small"></el-input>
      </RowChat>
<!--      <RowChat title="群公告" @click="createGroup">-->
<!--        <el-input placeholder="请输入" size="small"></el-input>-->
<!--      </RowChat>-->
      <RowChat label="群二维码" @click="createGroup" show-right-btn />
    </div>

    <div class="row">
<!--      <RowChat title="我的群备注" @click="createGroup">-->
<!--        <el-input placeholder="请输入" size="small"></el-input>-->
<!--      </RowChat>-->
      <RowChat title="我的群昵称" @click="createGroup">
        <el-input placeholder="请输入" size="small"></el-input>
      </RowChat>
    </div>

    <MsgTopAndSilence />

    <div class="row">
      <RowChat label="群管理" @callback="openGroupManager" show-right-btn />
      <RowChat label="聊天记录" @click="createGroup" show-right-btn />
    </div>

    <div class="clear-btn" @click="handleDeleteHistoryMsg">清空聊天记录</div>
    <div class="clear-btn" @click="handleOutGroup">退出群聊</div>
    <div class="clear-btn" @click="handleRemoveGroup">解散群聊</div>

    <Manager
      :visible.sync="visibleDrawer"
      @groupRecord="handleGroupRecord"
      @groupTransfer="handleGroupTransfer"
    />

    <Record :visible.sync="visibleRecord" />

    <GroupTransfer
      :visible.sync="visibleGroupTransfer"
      @confirm="handleConfirmTransfer"
    ></GroupTransfer>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';
import { IMGetUserProfile } from '../../IM-SDK';
import RowChat from './row-chat';
import Manager from './manager';
import Record from './record';
import GroupTransfer from './group-transfer';
import MsgTopAndSilence from '../base-settings/msgTopAndSilence';
import { mapGetters } from "vuex";

export default {
  name: 'Group-settings',
  components: {
    LsIcon,
    RowChat,
    Manager,
    Record,
    GroupTransfer,
    MsgTopAndSilence,
  },
  data() {
    return {
      visibleDrawer: false,
      visibleRecord: false,
      visibleGroupTransfer: false,
    };
  },
  computed: {
    ...mapGetters('IMStore', ['actionWindow']),
  },
  mounted() {
    this.getGroupInfo()
  },
  methods: {
    getGroupInfo() {
      console.log(this.actionWindow)
      IMGetUserProfile(this.actionWindow.toUser)
    },
    createGroup() {
      this.$emit('createGroup');
    },
    handleDeleteHistoryMsg() {
      this.$Lconfirm({
        title: '确定清空聊天记录？',
        content: '聊天记录将在你的所有设备同步清空，不会影响其他群成员',
      }).then(() => {});
    },
    handleOutGroup() {
      this.$Lconfirm({
        title: '确定退出群聊？',
        // 你是群主，需要把群主转让后才能退出群聊
        content:
          '你要退出“群聊名称”吗？退出后将无法查看历史记录且不会再收到此群聊的消息',
      }).then(() => {});
    },
    handleRemoveGroup() {
      this.$Lconfirm({
        title: '确定解散群聊？',
        content: '解散会移出所有群成员，且无法再查看此群聊的历史记录',
      }).then(() => {});
    },
    openGroupManager() {
      this.visibleDrawer = true;
    },

    handleGroupRecord() {
      this.visibleRecord = true;
    },
    handleGroupTransfer() {
      this.visibleGroupTransfer = true;
    },
    handleConfirmTransfer() {
      console.log(123);
    },
  },
};
</script>

<style scoped lang="scss">
.group-panel-settings {
  position: relative;
  height: calc(100% - 42px);
  box-sizing: border-box;
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
