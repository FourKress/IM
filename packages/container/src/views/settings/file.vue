<template>
  <Card id="File-Card" title="文件">
    <div>
      <InfoBlock :info="{ title: '缓存保存位置' }">
        <div class="file-row">
          <el-input
            type="text"
            readonly
            placeholder="请选择缓存保存位置…"
            v-model="cacheDirPath"
          />
          <span class="btn" @click="selectFilePath">更改</span>
        </div>
      </InfoBlock>

      <InfoBlock :info="{ title: '空间清理' }">
        <div>
          <div class="clean-row">
            <span>清理软件运行缓存</span>
            <span class="btn" @click="handleClean">
              清理
              {{ cacheFileSize ? cacheFileSize : `${cacheFileSize}KB` }} 缓存
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
      cacheDirPath: '',
      cacheFileSize: 0,
    };
  },
  async mounted() {
    const { dir, size } = await renderProcess.getCacheDirInfo();
    this.cacheDirPath = dir;
    this.cacheFileSize = size;
  },
  methods: {
    async selectFilePath() {
      const dirPath = await renderProcess.openFileDialog('openDirectory');
      if (dirPath) {
        this.cacheDirPath = dirPath;
      }
      await renderProcess.setCacheDir(dirPath);
      await window.$lanshuStore.clear();
      const { error, fileSize } = await renderProcess.getFileSize(dirPath);
      if (!error) {
        this.cacheFileSize = fileSize;
      }
    },
    async handleClean() {
      if (!this.cacheFileSize) return;
      await window.$lanshuStore.clear();
      await renderProcess.cleanFile(this.cacheDirPath);
      this.cacheFileSize = 0;
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
