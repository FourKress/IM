<template>
  <Card id='About-Card' title="关于北象">
    <div class="tips">蓝数软件 © 版权所有 Copyright Reserved</div>

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
  name: 'About-Card',
  components: {
    Card,
    InfoBlock,
  },
  data() {
    return {
      infos: [
        {
          btnText: '进入官网'
        },
        {
          btnText: '联系我们'
        },
        {
          btnText: '投诉建议'
        },
        {
          btnText: '《用户服务协议》'
        },
        {
          btnText: '《隐私政策》'
        },
      ]
    }
  },
  methods: {
    handleCallback(info) {
      console.log(info);
    },
  },
};
</script>

<style scoped lang="scss">
.tips {
  font-size: 14px;
  color: $tips-text-color;
  margin-top: 26px;
}
</style>
