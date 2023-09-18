<template>
  <Card id="Basic-Card" title="通用">
    <InfoBlock :info="{ title: '启动' }">
      <div class="row">
        <el-checkbox v-model="autoStartChecked" @change="handleAutoStartChange">
          开机自动启动客户端
        </el-checkbox>
      </div>
    </InfoBlock>

    <InfoBlock :info="{ title: '会话气泡显示模式' }">
      <div class="row">
        <el-radio-group v-model="bubbleModel" @change="handleChange">
          <el-radio :label="SESSION_BUBBLE_MODEL.IS_LEFT">左对齐模式</el-radio>
          <el-radio :label="SESSION_BUBBLE_MODEL.IS_BETWEEN">
            左右对话模式
          </el-radio>
        </el-radio-group>
      </div>
    </InfoBlock>
  </Card>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';
import Card from './card';
import InfoBlock from './info-block';
import { SESSION_BUBBLE_MODEL } from '@lanshu/utils';

export default {
  name: 'Basic-Card',
  components: {
    Card,
    InfoBlock,
  },
  data() {
    return {
      SESSION_BUBBLE_MODEL,
      bubbleModel: SESSION_BUBBLE_MODEL.IS_BETWEEN,
      autoStartChecked: false,
    };
  },
  async mounted() {
    this.bubbleModel =
      (await renderProcess.getStore('SESSION_BUBBLE_MODEL')) ||
      SESSION_BUBBLE_MODEL.IS_BETWEEN;
    this.autoStartChecked =
      (await renderProcess.getStore('AUTO_START')) || false;
  },
  methods: {
    handleChange(val) {
      renderProcess.setStore('SESSION_BUBBLE_MODEL', val);
    },
    handleAutoStartChange(val) {
      renderProcess.setAutoStart(val);
    },
  },
};
</script>

<style scoped></style>
