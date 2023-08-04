<template>
  <Card id="Update-Card" title="更新升级">
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
      <el-badge is-dot>{{ updateInfo.version }}</el-badge>
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
import { fetchVersion } from '@lanshu/utils';

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
      // TODO 检查处理音视频通话
      const { fetchUrl, version } = this.updateInfo;
      if (fetchUrl && version) {
        this.setStartDownload(true);
        renderProcess.checkForUpdates({ fetchUrl, version });
      } else {
        this.handleGetVersion();
      }
    },

    async handleGetVersion() {
      const updateInfo = await fetchVersion(true);
      if (!updateInfo?.version) return;
      this.setStartDownload(true);
      const { fetchUrl, version } = updateInfo;
      renderProcess.checkForUpdates({ fetchUrl, version });
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
