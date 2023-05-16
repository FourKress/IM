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

    <div class="tips">当前安装版本：{{ updateVersion }}</div>

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
    ...mapGetters('globalStore', ['updateNotify', 'updateVersion']),
  },
  created() {
    this.selfUpdateNotify = this.updateNotify;
  },
  methods: {
    ...mapActions('globalStore', ['setUpdateNotify']),

    handleCallback(info) {
      if (info?.fnc) {
        info.fnc(info);
      }
    },
    handleChange() {
      this.setUpdateNotify(this.selfUpdateNotify);
    },

    handleUpdate() {
      this.setStartDownload(true);
      renderProcess.checkForUpdates();
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
