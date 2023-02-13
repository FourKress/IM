<template>
  <div >
    <div class="row">
      <div class="item" @click="createGroup">
        <div class="info">
          <span class="title">群名称</span>
          <span class="label">1212</span>
        </div>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="item" @click="createGroup">
        <div class="info">
          <span class="title">群公告</span>
          <span class="label">1212</span>
        </div>
        <i class="el-icon-arrow-right"></i>
      </div>
      <!--      <div class="item" @click="createGroup">-->
      <!--        <span class="label">群二维码</span>-->
      <!--        <i class="el-icon-arrow-right"></i>-->
      <!--      </div>-->
    </div>

    <div class="row">
      <div class="item" @click="createGroup">
        <div class="info">
          <span class="title">我的群备注</span>
          <span class="label">1212</span>
        </div>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="item" @click="createGroup">
        <div class="info">
          <span class="title">我的群昵称</span>
          <span class="label">1212</span>
        </div>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>

    <!--    <div class="row">-->
    <!--      <div class="item">-->
    <!--        <span class="label">消息置顶</span>-->
    <!--        <span class="check-btn">-->
    <!--          <el-switch-->
    <!--            v-model="value"-->
    <!--            active-color="#0066FF"-->
    <!--            inactive-color="#C9CDD4"-->
    <!--          ></el-switch>-->
    <!--        </span>-->
    <!--      </div>-->
    <!--      <div class="item">-->
    <!--        <span class="label">消息免打扰</span>-->
    <!--        <span class="check-btn">-->
    <!--          <el-switch-->
    <!--            v-model="value2"-->
    <!--            active-color="#0066FF"-->
    <!--            inactive-color="#C9CDD4"-->
    <!--          ></el-switch>-->
    <!--        </span>-->
    <!--      </div>-->
    <!--    </div>-->

    <div class="row">
      <div class="item" @click="openGroupManager">
        <span class="label">群管理</span>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="item">
        <span class="label">聊天记录</span>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>

    <div class="clear-btn" @click="handleDeleteHistoryMsg">清空聊天记录</div>
    <div class="clear-btn" @click="handleOutGroup">退出群聊</div>
    <div class="clear-btn" @click="handleRemoveGroup">解散群聊</div>
  </div>
</template>

<script>
export default {
  name: 'Group-settings',
  methods: {
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
    openGroupManager() {},
  },
};
</script>

<style scoped lang="scss">
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

    .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      font-size: 14px;

      .title {
        color: $minor-text-color;
        margin-bottom: 6px;
      }
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
</style>
