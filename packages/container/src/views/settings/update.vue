<template>
  <Card id="Update-Card" title="更新升级">
    <!--    <InfoBlock :info='{}'>-->
    <!--      <el-checkbox class='item' v-model="autoUpdate">自动检查和安装更新</el-checkbox>-->
    <!--    </InfoBlock>-->

    <InfoBlock :info="{}">
      <el-checkbox
        class="item"
        v-model="selfUpdateNotify"
        @change="handleChange"
      >
        更新提醒
      </el-checkbox>
    </InfoBlock>

    <div class="tips">当前安装版本：{{ currentVersion }}</div>
    <div class="tips" v-if="updateInfo.version">
      最新版本：
      <el-badge is-dot>{{ updateInfo.version }} </el-badge>
    </div>

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
import { mapActions, mapGetters } from 'vuex';
import { renderProcess } from '@lanshu/render-process';
import { Apis, compareVersion } from '@lanshu/utils';

export default {
  name: 'Update-Card',
  components: {
    Card,
    InfoBlock,
  },
  data() {
    return {
      autoUpdate: false,
      selfUpdateNotify: false,
      currentVersion: '',
      infos: [
        {
          btnText: '立即更新',
          fnc: (info) => this.handleUpdate(info),
        },
        {
          btnText: '更新日志',
        },
      ],
    };
  },
  computed: {
    ...mapGetters('globalStore', ['updateNotify', 'updateInfo']),
  },
  async created() {
    this.selfUpdateNotify = await renderProcess.getStore('UPDATE_NOTIFY');
    this.currentVersion = await renderProcess.getStore('VERSION');
  },
  methods: {
    ...mapActions('globalStore', [
      'setUpdateNotify',
      'setStartDownload',
      'setUpdateInfo',
    ]),

    handleCallback(info) {
      if (info?.fnc) {
        info.fnc(info);
      }
    },
    async handleChange() {
      await renderProcess.setStore('UPDATE_NOTIFY', this.selfUpdateNotify);
      if (this.updateInfo.version) {
        this.setUpdateNotify(this.selfUpdateNotify);
      }
    },

    handleUpdate() {
      const { fetchUrl, version } = this.updateInfo;
      if (fetchUrl && version) {
        this.setStartDownload(true);
        renderProcess.checkForUpdates({ fetchUrl, version });
      } else {
        this.handleGetVersion();
      }
    },

    async handleGetVersion() {
      const res = await Apis.queryLastAvailableByAppCode({
        appCode: 'PC',
      });
      const updateData = res?.data;
      if (!updateData) return;

      const { version, model, decDirectory, title, content } = updateData;

      const isNewVersion = compareVersion(version, this.currentVersion) === 1;
      if (!isNewVersion) {
        this.$message.warning('当前已是最新版本');
        return;
      }

      const updateInfo = {
        version,
        isForced: model === 1,
        fetchUrl: decDirectory,
        title,
        content,
      };
      this.setUpdateInfo(updateInfo);

      const UPDATE_NOTIFY = await renderProcess.getStore('UPDATE_NOTIFY');
      if (!updateInfo?.isForced && UPDATE_NOTIFY) {
        this.setUpdateNotify(true);
      }
      this.setStartDownload(true);
      renderProcess.checkForUpdates({ fetchUrl: decDirectory, version });
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

.btn {
  margin-top: 26px;
  font-size: 14px;
  color: $primary-hover-color;
  cursor: pointer;
}
</style>
