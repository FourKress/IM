<template>
  <div class='member'>
    <div class="input-row">
      <div class="query-icon">
        <LsIcon icon="navi_ss_icon" width="14" height="14" render-svg></LsIcon>
      </div>
      <div class="input-panel">
        <el-input type="text" v-model="memberName" placeholder="搜索群成员" />
      </div>
    </div>
    <div class='tips'>共40位成员</div>

    <div class='action'>
      <span class='add btn' @click='changeMember(IMGroupMemberPanelType.isAdd)'>
        <LsIcon render-svg width='14' height='14' icon='navi_ss_add'></LsIcon>
      </span>
      <span class='del btn' @click='changeMember(IMGroupMemberPanelType.isDel)'>
         <LsIcon render-svg width='14' height='14' icon='a-icon_jianhao2x'></LsIcon>
      </span>
    </div>

    <div class='list'>
      <div class="scroll-view">
        <div class="item" v-for="(item, index) in selectList">
          <div class="img">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="name">
            <span>{{ item.nickname }} 阿诗丹顿的点点滴滴滴滴答答大大大</span>
          </div>
          <div class="tag">
            <span>群组是</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LsIcon } from '@lanshu/components';
import {IMGroupMemberPanelType} from '@lanshu/utils';

export default {
  name: 'Member',
  components: {
    LsIcon,
  },
  data() {
    return {
      IMGroupMemberPanelType,
      memberName: '',
      isAdd: false,
      selectList: [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
    }
  },
  methods: {
    changeMember(type) {
      this.$emit('changeGroupMember', type);
    }
  }
};
</script>

<style scoped lang='scss'>
.member {
  width: 100%;
  height: calc(100% - 62px);
  box-sizing: border-box;
  margin-top: 26px;
  display: flex;
  flex-direction: column;

  ::-webkit-scrollbar {
    display: none;
  }
}
.input-row {
  width: 100%;
  height: 36px;
  box-sizing: border-box;
  background-color: $bg-white-color;
  border-radius: 6px;
  border: 1px solid $split-line-color;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .query-icon {
    width: 14px;
    height: 14px;
    transform: translateY(-2px);
  }

  .input-panel {
    flex: 1;
    height: 20px;
    padding: 0 8px;
    font-size: 14px;

    ::v-deep .el-input {
      border: none;

      .el-input__inner {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        padding: 0;
      }
      input::placeholder {
        color: $tips-text-color;
        font-size: 14px;
      }
    }
  }
}

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
    margin-left: 10px;
    background: $bg-white-color;
    border-radius: 5px;
    border: 1px dashed $split-line-color;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.list {
  margin-left: 10px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  transform: translate3d(0, 0, 0);

  .scroll-view {
    .item {
      width: 100%;
      height: 34px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;

      &:last-child {
        margin-bottom: 0;
      }

      .img {
        width: 34px;
        height: 34px;
        margin-right: 10px;
        border-radius: 6px;
        overflow: hidden;
        background-color: #333333;

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      .name {
        flex: 1;
        height: 22px;
        line-height: 22px;
        padding-right: 10px;
        font-size: 14px;
        color: $main-text-color;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .tag {
        width: 48px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        background: #FFF3D7;
        border-radius: 3px;
        font-size: 12px;
        color: #2B83FA;
      }
    }
  }
}
</style>
