<template>
  <Card id='Update-Card' title="更新升级">
    <InfoBlock :info='{}'>
      <el-checkbox class='item' v-model="autoUpdate">自动检查和安装更新</el-checkbox>
    </InfoBlock>

    <InfoBlock :info='{}'>
      <el-checkbox class='item' v-model="updateTips">更新提醒</el-checkbox>
    </InfoBlock>

    <div class='tips'>当前安装版本：1.0.01</div>

    <template v-for="(info, index) in infos">
      <InfoBlock
        :key="index"
        :info="info"
        @callback="handleCallback(info)"
      ></InfoBlock>
    </template>
  </Card>
</template>

<script>
import Card from './card';
import InfoBlock from './info-block';

export default {
  name: 'Update-Card',
  components: {
    Card,
    InfoBlock,
  },
  data() {
    return {
      autoUpdate: false,
      updateTips: false,

      infos: [
        {
          btnText: '立即升级'
        },
        {
          btnText: '更新日志'
        },
      ]
    }
  },
  methods: {
    handleCallback(info) {
      console.log(info);
    },
  }
};
</script>

<style scoped lang="scss">
.tips {
  font-size: 14px;
  color: $tips-text-color;
  margin-top: 26px;
}

.btn {
  margin-top: 26px;
  font-size: 14px;
  color: $primary-hover-color;
  cursor: pointer;
}
</style>
