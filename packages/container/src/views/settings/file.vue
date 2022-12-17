<template>
  <Card id='File-Card' title="文件">
    <div>
      <InfoBlock :info="{ title: '下载保存位置' }">
        <div class="file-row">
          <el-input
            type="text"
            placeholder="请选择下载保存位置…"
            @change="handleChange"
            v-model="downloadFilePath"
          />
          <span class='btn'>更改</span>
        </div>
      </InfoBlock>

      <div class="row" v-for="msg in msgList">
        <el-checkbox :label="msg.label" :key="msg.label" v-model="msg.checked">
          {{ msg.label }}
        </el-checkbox>
      </div>

      <InfoBlock :info="{ title: '缓存保存位置' }">
        <div class="file-row">
          <el-input
            type="text"
            placeholder="请选择缓存保存位置…"
            @change="handleChange"
            v-model="cacheFilePath"
          />
          <span class='btn'>更改</span>
        </div>
      </InfoBlock>

      <InfoBlock :info="{ title: '空间清理' }">
        <div>
          <div class='clean-row'>
            <span>清理历史下载文件</span>
            <span class='btn'>清理 1.32GB 文件</span>
          </div>
          <div class='clean-row'>
            <span>清理软件运行缓存</span>
            <span class='btn'>清理 201.33MB 缓存</span>
          </div>
        </div>
      </InfoBlock>
    </div>
  </Card>
</template>

<script>
import Card from './card';
import InfoBlock from './info-block';

export default {
  name: 'File-Card',
  components: {
    Card,
    InfoBlock,
  },
  data() {
    return {
      downloadFilePath: '231312312',
      cacheFilePath: '',

      msgList: [
        {
          label: '下载前询问每个文件的保存位置',
          checked: false,
        },
        {
          label: '自动下载100MB以内文件',
          checked: false,
        },
      ],
    };
  },
  methods: {
    handleCallback(info) {
      console.log(info);
    },
    handleChange(val) {
      console.log(val);
    },
  },
};
</script>

<style scoped lang="scss">
.file-row {
  width: 486px;
  margin-top: 4px;
  position: relative;

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

.row {
  margin-top: 26px;
}

.clean-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  color: $minor-text-color;

  &:last-child {
    margin-top: 10px;
  }

  .btn {
    margin-left: 10px;
    color: $primary-hover-color;
    cursor: pointer;
  }
}
</style>
