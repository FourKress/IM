<template>
  <div class="group-panel-settings">
    <div class="row">
      <div class="item" @click="createGroup">
        <div class="info">
          <span class="title">群名称</span>
          <el-input placeholder='请输入' size='small'></el-input>
        </div>
      </div>
      <div class="item" @click="createGroup">
        <div class="info">
          <span class="title">群公告</span>
          <el-input placeholder='请输入' size='small'></el-input>
        </div>
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
          <el-input placeholder='请输入' size='small'></el-input>
        </div>
      </div>
      <div class="item" @click="createGroup">
        <div class="info">
          <span class="title">我的群昵称</span>
          <el-input placeholder='请输入' size='small'></el-input>
        </div>
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

    <el-drawer
      custom-class="group-manager"
      destroy-on-close
      :show-close="false"
      :wrapperClosable="false"
      :modal="false"
      :size="300"
      :close-on-press-escape="false"
      :visible.sync="visibleDrawer"
    >
      <span slot="title" class="manage-title">
        <LsIcon
          class="title-icon"
          width="14"
          height="28"
          icon="a-icon_gengduo22x"
          @click="handleCloseDrawer"
        ></LsIcon>
        群管理
      </span>
      <div class="drawer-content">
        <div class="tips">共40位成员</div>

        <div class="action">
           <span
             class="add btn"
             @click="changeMember(IMGroupMemberPanelType.isAdd)"
           >
            <LsIcon
              render-svg
              width="14"
              height="14"
              icon="navi_ss_add"
            ></LsIcon>
          </span>
          <span
            class="add btn"
            @click="changeMember(IMGroupMemberPanelType.isAdd)"
          >
            <LsIcon
              render-svg
              width="14"
              height="14"
              icon="navi_ss_add"
            ></LsIcon>
          </span>


          <span
            class="add btn"
            @click="changeMember(IMGroupMemberPanelType.isAdd)"
          >
            <LsIcon
              render-svg
              width="14"
              height="14"
              icon="navi_ss_add"
            ></LsIcon>
          </span>
          <span
            class="del btn"
            @click="changeMember(IMGroupMemberPanelType.isDel)"
          >
            <LsIcon
              render-svg
              width="14"
              height="14"
              icon="a-icon_jianhao2x"
            ></LsIcon>
          </span>
        </div>

        <div class="row">
          <div class="item" @click="createGroup">
            <div class="info">
              <span class="title">谁可以编辑群信息</span>
              <el-select placeholder='请选择' size='small'></el-select>
            </div>
          </div>
          <div class="item" @click="createGroup">
            <div class="info">
              <span class="title">谁可以添加群成员、分享群</span>
              <el-select placeholder='请选择' size='small'></el-select>
            </div>
          </div>
          <div class="item" @click="createGroup">
            <div class="info">
              <span class="title">谁可以在本群发言</span>
              <el-select placeholder='请选择' size='small'></el-select>
            </div>
          </div>
          <div class="item" @click="createGroup">
            <div class="info">
              <span class="title">谁可以发起语音、视频通话</span>
              <el-select placeholder='请选择' size='small'></el-select>
            </div>
          </div>
          <div class="item" @click="createGroup">
            <div class="info">
              <span class="title">谁可以发送文件</span>
              <el-select placeholder='请选择' size='small'></el-select>
            </div>
          </div>
          <div class="item" @click="createGroup">
            <div class="info">
              <span class="title">谁可以@所有人</span>
              <el-select placeholder='请选择' size='small'></el-select>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="item" @click="createGroup">
            <div class="info">
              <span class="title">谁可以收到进群通知</span>
              <el-select placeholder='请选择' size='small'></el-select>
            </div>
          </div>
          <div class="item" @click="createGroup">
            <div class="info">
              <span class="title">谁可以收到退群通知</span>
              <el-select placeholder='请选择' size='small'></el-select>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="item">
            <div class="info">
              <span class="title">进群验证</span>
              <span class="label">1212</span>
            </div>
            <span class="check-btn">
              <el-switch
                v-model="value"
                active-color="#0066FF"
                inactive-color="#C9CDD4"
              ></el-switch>
            </span>
          </div>
          <div class="item">
            <div class="info">
              <span class="title">允许被搜索</span>
              <span class="label">1212</span>
            </div>
            <span class="check-btn">
              <el-switch
                v-model="value2"
                active-color="#0066FF"
                inactive-color="#C9CDD4"
              ></el-switch>
            </span>
          </div>
        </div>

        <div class="row">
          <div class="item">
            <span class="label">查看进退群记录</span>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="item">
            <span class="label">转让群主</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>

<!--        <el-drawer-->
<!--          custom-class="group-manager"-->
<!--          destroy-on-close-->
<!--          :show-close="false"-->
<!--          :wrapperClosable="false"-->
<!--          :modal="false"-->
<!--          :size="300"-->
<!--          :close-on-press-escape="false"-->
<!--          :visible.sync="visibleDrawer2"-->
<!--        >-->
<!--          <span>12121212</span>-->
<!--        </el-drawer>-->
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';

export default {
  name: 'Group-settings',
  components: {
    LsIcon,
  },
  data() {
    return {
      visibleDrawer: false,
      value2: false,
      value: true,
      visibleDrawer2: true,
    };
  },
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
    openGroupManager() {
      this.visibleDrawer = true;
    },

    handleCloseDrawer() {
      this.visibleDrawer = false;
    },
  },
};
</script>

<style scoped lang="scss">
.group-panel-settings {
  position: relative;
  height: calc(100% - 42px);
  box-sizing: border-box;

  ::v-deep .el-drawer__wrapper {
    width: 300px;
    position: absolute;
    top: -54px;
    left: -20px;

    .el-drawer__header {
      margin-bottom: 10px;
    }

    .manage-title {
      display: flex;
      align-items: center;
      color: $main-text-color;
      font-size: 16px;
      font-weight: bold;

      .title-icon {
        width: 14px;
        height: 28px;
        margin-right: 16px;
        color: $minor-text-color;
        transform-origin: center;
        transform: rotateZ(180deg);
        cursor: pointer;
      }
    }

    .drawer-content {
      padding: 0 20px;

      .tips {
        margin: 20px 0;
        font-size: 14px;
        color: $minor-text-color;
      }

      .action {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .btn {
          width: 36px;
          height: 36px;
          margin-right: 10px;
          background: $bg-white-color;
          border-radius: 5px;
          border: 1px dashed $split-line-color;
          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
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
    width: 100%;
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
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      font-size: 14px;

      ::v-deep .el-input, .el-select {
        width: 100%;
      }

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
