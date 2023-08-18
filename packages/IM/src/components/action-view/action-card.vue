<template>
  <div>
    <el-dropdown placement="top" trigger="click">
      <el-tooltip class="item" effect="dark" content="更多" placement="top">
        <LsIcon render-svg icon="xx_srk_gd"></LsIcon>
      </el-tooltip>
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
          <span @click="handleUploadFile(false)">
            <LsIcon size="14" color="#777" icon="pop_cd_tp"></LsIcon>
            <span>图片/视频</span>
          </span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="handleUploadFile(true)">
            <LsIcon size="14" color="#777" icon="pop_cd_wj"></LsIcon>
            <span>文件</span>
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <LsCardDialog :visible.sync="visibleFileDialog" :isModalClose="false">
      <FileDialog
        :files="files"
        :session="session"
        @close="handleFileClose"
        @confirm="handleFileConfirm"
      />
    </LsCardDialog>
  </div>
</template>

<script>
import { LsCardDialog, LsIcon } from '@lanshu/components';
import FileDialog from './file-dialog';
import { CHECK_MSG_TYPE, SESSION_USER_TYPE } from '@lanshu/utils';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Action-card',
  props: {
    session: {
      type: Object,
      default: () => {},
      require: true,
    },
    groupRole: {
      type: Number,
      default: -1,
    },
    groupRoleManager: {
      type: Object,
      default: () => {},
    },
  },
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
  computed: {
    ...mapGetters('IMStore', ['dragFileList']),
    isGroup() {
      return this.session?.toUserType === SESSION_USER_TYPE.IS_GROUP;
    },
    noGroupAuth() {
      return (
        this.isGroup && this.groupRoleManager.whoCanSendFile > this.groupRole
      );
    },
  },
  watch: {
    dragFileList(val) {
      console.log(val, 'dragFileList');
      const { sessId, files } = val;
      if (sessId !== this.session.sessId) return;
      if (sessId && files?.length) {
        this.files = [...files];
        this.visibleFileDialog = true;
        this.$nextTick(() => {
          this.setDragFileList({});
        });
      }
    },
  },
  methods: {
    ...mapActions('IMStore', ['setDragFileList']),

    handleUploadFile(isFile) {
      if (this.noGroupAuth) {
        this.$message.warning('暂无权限！');
        return;
      }

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
      this.$emit('actionComplete', {
        value: fileList,
        type: CHECK_MSG_TYPE.IS_SEND_FILE,
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
