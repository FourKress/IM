<template>
  <Card id='HotKey-Card' title="快捷键">
    <InfoBlock :info="{ title: '消息' }">
      <div class="row">
        <el-select
          type="text"
          placeholder="选择快捷键"
          @change="handleChange"
          v-model="msgHotKey"
        />
      </div>
    </InfoBlock>

    <InfoBlock :info="{ title: '截图' }">
      <div class="row">
        <el-input
          type="text"
          placeholder="点击设置快捷键"
          @change="handleChange"
          v-model="msgHotKey"
        />
        <span class='btn'>更改</span>
      </div>
    </InfoBlock>

    <InfoBlock :info="{ title: '搜索' }">
      <div class="row">
        <el-input
          type="text"
          placeholder="点击设置快捷键"
          @change="handleChange"
          v-model="msgHotKey"
        />
        <span class='btn'>更改</span>
      </div>
    </InfoBlock>

    <InfoBlock :info="{ title: '显示/隐藏窗口' }">
      <div class="row">
        <el-input
          type="text"
          placeholder="点击设置快捷键"
          @change="handleChange"
          v-model="msgHotKey"
        />
        <span class='btn'>更改</span>
      </div>
    </InfoBlock>

    <div class='reset'>全部还原为默认设置</div>
  </Card>
</template>

<script>
import Card from './card';
import InfoBlock from './info-block';

export default {
  name: 'HotKey-Card',
  components: {
    Card,
    InfoBlock,
  },
  data() {
    return {
      msgHotKey: '',
    }
  },
  methods: {
    handleChange(val) {
      console.log(val);
    }
  }
};
</script>

<style scoped lang="scss">
.row {
  width: 486px;
  margin-top: 4px;
  position: relative;

  ::v-deep .el-select {
    width: 100%;
  }

  ::v-deep .el-input__inner {
    padding-right: 53px;
  }

  .btn {
    position: absolute;
    right: 16px;
    top: 10px;
    font-size: 14px;
    color: $primary-hover-color;
    cursor: pointer;
  }
}
.reset {
  font-size: 14px;
  color: $primary-hover-color;
  margin-top: 26px;
  cursor: pointer;
}
</style>
