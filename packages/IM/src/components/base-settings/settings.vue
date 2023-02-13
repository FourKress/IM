<template>
  <div class="im-settings" v-if="visible">
    <div class="top">
      <span class="label">设置</span>
      <LsIcon class="close-icon" width='14' height='14' render-svg w icon="a-icon_close2x" @click="handleClose"></LsIcon>
    </div>

    <div class="row">
      <div class="item" @click="createGroup">
        <span class="label">创建群聊</span>
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
      <div class="item">
        <span class="label">聊天记录</span>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>

    <div class="clear-btn" @click="handleDeleteHistoryMsg">清空聊天记录</div>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';

export default {
  name: 'IM-Settings',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  components: {
    LsIcon,
  },
  data() {
    return {
      value: true,
      value2: false,
    };
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
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
  },
};
</script>

<style scoped lang="scss">
.im-settings {
  width: 300px;
  min-width: 300px;
  background-color: $bg-white-color;
  padding: 22px 20px 0 20px;
  border-left: 1px solid $split-line-color;

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
