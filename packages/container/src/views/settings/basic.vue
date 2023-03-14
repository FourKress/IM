<template>
  <Card id='Basic-Card' title="通用">
    <InfoBlock :info="{ title: '启动' }">
      <div class="row">
        <el-checkbox v-model="autoStartChecked">开机自动启动北象</el-checkbox>
      </div>
    </InfoBlock>

<!--    <InfoBlock :info="{ title: '会话气泡显示模式' }">-->
<!--      <div class="row">-->
<!--        <el-radio v-model="sessionBubbleModel" label='left'>左对齐模式</el-radio>-->
<!--        <el-radio v-model="sessionBubbleModel" label='between'>左右对话模式</el-radio>-->
<!--      </div>-->
<!--    </InfoBlock>-->
  </Card>
</template>

<script>
import Card from './card';
import InfoBlock from './info-block';

export default {
  name: 'Basic-Card',
  components: {
    Card,
    InfoBlock,
  },
  data() {
    return {
      autoStartChecked: false,
      sessionBubbleModel: 'between',
    }
  }
};
</script>

<style scoped></style>
