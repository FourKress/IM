<template>
  <div class="im-settings" :style="isPosition && positionCss" v-if="visible">
    <div class="top">
      <span class="label">设置</span>
      <LsIcon
        class="close-icon"
        width="14"
        height="14"
        render-svg
        icon="a-icon_close2x"
        @click="handleClose"
      ></LsIcon>
    </div>

    <div class="row" v-if="isNotMe">
      <div class="item" @click="createGroup">
        <span class="label">创建群聊</span>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>

    <MsgTopAndSilence />

    <div class="row">
      <div class="item" @click="openHistoryMsg">
        <span class="label">聊天记录</span>
        <i class="el-icon-arrow-right" @click="openHistoryMsg"></i>
      </div>
    </div>

    <HistoryMsg :visibleDrawer.sync="visibleHistoryMsgDrawer" />

    <div class="clear-btn" @click="handleDeleteHistoryMsg">清空聊天记录</div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { LsIcon } from '@lanshu/components';
import { IMClearMessage } from '../../IM-SDK';
import MsgTopAndSilence from './msgTopAndSilence';
import HistoryMsg from '../group-panel/history-msg';

export default {
  name: 'IM-Settings',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    isPosition: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LsIcon,
    MsgTopAndSilence,
    HistoryMsg,
  },
  data() {
    return {
      visibleHistoryMsgDrawer: false,
      positionCss: {
        position: 'absolute',
        top: 0,
        right: 0,
      },
    };
  },
  computed: {
    ...mapGetters('IMStore', ['actionWindow', 'userInfo']),

    isNotMe() {
      return this.userInfo.userId !== this.actionWindow.toUser;
    },
  },
  watch: {
    visible(val) {
      if (!val) return;
      this.visibleHistoryMsgDrawer = false;
    },
  },
  methods: {
    ...mapActions('IMStore', ['setRefreshMsg']),

    handleClose() {
      this.$emit('update:visible', false);
    },
    createGroup() {
      this.$emit('createGroup');
    },
    handleDeleteHistoryMsg() {
      this.$LConfirm({
        title: '确定清空聊天记录？',
        content: '聊天记录清空后无法恢复，确认清空吗？',
      }).then(() => {
        IMClearMessage(this.actionWindow.sessId).then(() => {
          this.setRefreshMsg(Date.now());
          this.$message.success('清空聊天记录成功');
          console.log('clearMessage Success');
        });
      });
    },

    openHistoryMsg() {
      this.visibleHistoryMsgDrawer = true;
    },
  },
};
</script>

<style scoped lang="scss">
.im-settings {
  height: 100%;
  width: 299px;
  min-width: 299px;
  background-color: $bg-white-color;
  padding: 22px 20px 0 20px;
  border-left: 1px solid $split-line-color;
  position: relative;
  box-sizing: border-box;

  .top {
    width: 100%;
    height: 22px;
    line-height: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .label {
      font-size: 16px;
      color: $main-text-color;
      font-weight: bold;
      cursor: pointer;
    }

    .close-icon {
      cursor: pointer;
    }
  }

  .row {
    padding: 26px 0 6px 0;
    border-bottom: 1px solid $split-line-color;

    &:first-child {
      padding-top: 16px;
      border-top: none;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      cursor: pointer;

      .label {
        font-size: 14px;
        color: $main-text-color;
      }

      .more-icon {
        width: 6px;
        height: 12px;
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
}
</style>
