<template>
  <Card id="File-Card" title="文件">
    <div>
      <InfoBlock :info="{ title: '缓存保存位置' }">
        <div class="file-row">
          <el-input
            type="text"
            readonly
            placeholder="请选择缓存保存位置…"
            v-model="cacheFilePath"
          />
          <span class="btn" @click="selectFilePath">更改</span>
        </div>
      </InfoBlock>

      <InfoBlock :info="{ title: '空间清理' }">
        <div>
          <div class="clean-row">
            <span>清理软件运行缓存</span>
            <span class="btn" @click="handleClean">
              清理 {{ fileSize ? fileSize : `${fileSize}KB` }} 缓存
            </span>
          </div>
        </div>
      </InfoBlock>
    </div>
  </Card>
</template>

<script>
import Card from './card';
import InfoBlock from './info-block';
import { renderProcess } from '@lanshu/render-process';

export default {
  name: 'File-Card',
  components: {
    Card,
    InfoBlock,
  },
  data() {
    return {
      cacheFilePath: '',
      fileSize: 0,
    };
  },
  methods: {
    async selectFilePath() {
      const filePath = await renderProcess.openFile('openDirectory');
      if (filePath) {
        this.cacheFilePath = filePath;
      }
      const { error, fileSize } = await renderProcess.getFileSize(filePath);
      if (!error) {
        this.fileSize = fileSize;
      }
    },
    async handleClean() {
      if (!this.fileSize) return;
      await renderProcess.cleanFile(this.cacheFilePath);
      this.fileSize = 0;
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
