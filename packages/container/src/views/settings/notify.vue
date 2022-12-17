<template>
  <Card id='Notify-Card' title="通知">
    <div>
      <div class="row">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >
          全部新消息通知
        </el-checkbox>

        <el-checkbox-group
          v-model="checkedMsg"
          @change="handleCheckedCitiesChange"
        >
          <div class="group-item" v-for="msg in msgGroup">
            <el-checkbox :label="msg" :key="msg">
              {{ msg }}
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>

      <div class="row" v-for="msg in msgList">
        <el-checkbox :label="msg.label" :key="msg.label" v-model="msg.checked">
          {{ msg.label }}
        </el-checkbox>
      </div>
    </div>
  </Card>
</template>

<script>
import Card from './card';

export default {
  name: 'Notify-Card',
  components: {
    Card,
  },
  data() {
    return {
      msgGroup: ['单聊消息', '群聊消息', '语音通话通知', '视频通话通知'],
      msgList: [
        {
          label: '新消息通知声音',
          checked: false,
        },
        {
          label: '新消息图标闪动',
          checked: false,
        },
        {
          label: '新消息桌面右下角预览',
          checked: false,
        },
      ],
      checkAll: false,
      checkedMsg: [],
      isIndeterminate: false,
    };
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedMsg = val ? this.msgGroup : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.msgGroup.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.msgGroup.length;
    },
  },
};
</script>

<style scoped lang="scss">
.row {
  margin-top: 26px;
}

.group-item {
  margin: 16px 0 0 26px;

  ::v-deep .el-checkbox__label {
    //color: $minor-text-color;
  }
}
</style>
