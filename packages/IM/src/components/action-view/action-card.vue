<template>
  <div>
    <el-dropdown placement="top" trigger="click">
      <LsIcon render-svg icon="xx_srk_gd"></LsIcon>
      <input
        ref="fileInput"
        style="display: none"
        :accept="accept"
        id="file"
        type="file"
        multiple="multiple"
        name="file"
        @change="handleFileChange"
      />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <div class="send-down-row" @click="handleUploadFile(false)">
            <LsIcon render-svg icon="pop_cd_tp"></LsIcon>
            <span>图片/视频</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item>
          <div class="send-down-row" @click="handleUploadFile(true)">
            <LsIcon render-svg icon="pop_cd_wj"></LsIcon>
            <span>文件</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item>
          <div class="send-down-row">
            <LsIcon render-svg icon="pop_cd_sb"></LsIcon>
            <span>OCR识别</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item>
          <div class="send-down-row">
            <LsIcon render-svg icon="pop_cd_mp"></LsIcon>
            <span>名片</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <LsCardDialog :visible.sync="visibleFileDialog" :isModalClose="false">
      <FileDialog
        :files="files"
        @close="handleFileClose"
        @confirm="handleFileConfirm"
      />
    </LsCardDialog>
  </div>
</template>

<script>
import { LsCardDialog, LsIcon } from '@lanshu/components';
import FileDialog from './file-dialog';
import { checkMsgType } from '@lanshu/utils';

export default {
  name: 'Action-card',
  components: {
    LsCardDialog,
    LsIcon,
    FileDialog,
  },
  data() {
    return {
      accept: '',
      visibleFileDialog: false,
      files: [],
    };
  },
  methods: {
    handleUploadFile(isFile) {
      this.$refs.fileInput.value = '';
      this.accept = isFile ? '' : 'image/*,audio/*,video/*';
      this.$nextTick(() => {
        this.$refs.fileInput.click();
      });
    },
    handleFileChange(event) {
      const files = event?.target?.files;
      if (!files?.length) return;
      this.files = [...files];
      this.visibleFileDialog = true;
    },
    handleFileClose() {
      this.visibleFileDialog = false;
      this.files = [];
    },
    handleFileConfirm(fileList) {
      this.visibleFileDialog = false;
      this.$emit('actionComplete', {
        value: fileList,
        type: checkMsgType.isSendFile,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.send-down-row {
  display: flex;
  align-items: center;

  .ls-icon-wrap {
    width: 14px;
    height: 14px;
    margin-right: 11px;
  }
}
</style>
