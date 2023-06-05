<template>
  <Card id='Privacy-Card' title='隐私'>
    <InfoBlock :info="{ title: '添加联系人' }">
      <div class="row">
        <el-checkbox class='item' v-model="checkedFirst">允许通过手机号搜索到我</el-checkbox>
        <el-checkbox class='item' v-model="checkedSecond">允许通过个人二维码搜索到我</el-checkbox>
        <el-checkbox class='item' v-model="checkedThird">加我为联系人时需要验证</el-checkbox>
      </div>
    </InfoBlock>
  </Card>
</template>

<script>
import Card from './card';
import InfoBlock from './info-block';

export default {
  name: 'Privacy-Card',
  components: {
    Card,
    InfoBlock
  },
  data() {
    return {
      checkedFirst: false,
      checkedSecond: false,
      checkedThird: false,
    }
  }
};
</script>

<style scoped lang='scss'>
.row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  .item {
    margin-top: 10px;

    &:first-child {
      margin-top: 0;
    }
  }
}
</style>
