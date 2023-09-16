<template>
  <div id="lanshu-app">
    <MainLayout />

    <LsCardDialog
      :visible.sync="visibleUpdate"
      background-color="rgba(0,0,0,.5)"
      :is-modal-close="false"
    >
      <LsUpdate :startDownload="startDownload" @cancel="handleCancelUpdate" />
    </LsCardDialog>
  </div>
</template>

<script>
import MainLayout from './components/layout';
import { ClientLogOut, IMSDKCallBackEvents } from '@lanshu/im';
import { renderProcess } from '@lanshu/render-process';
import { LsUpdate, LsCardDialog } from '@lanshu/components';
import { mapActions, mapGetters } from 'vuex';
import { WINDOW_TYPE, WIN_ACTION_TYPE, fetchVersion } from '@lanshu/utils';

export default {
  name: 'App',
  components: {
    MainLayout,
    LsUpdate,
    LsCardDialog,
  },
  data() {
    return {
      visibleUpdate: false,
    };
  },
  computed: {
    ...mapGetters('globalStore', ['startDownload', 'userErrorMsg']),
  },
  watch: {
    startDownload() {
      this.visibleUpdate = true;
    },
    userErrorMsg(msg) {
      if (msg) {
        this.setUserErrorMsg(null);
        if (this.$route.name === 'Login') {
          this.$message.error(msg);
          return;
        }
        this.$LConfirm({
          title: '提示',
          content: msg,
        }).then(async () => {
          const hasWindow = await renderProcess.hasWindow('TRTCWindow');
          if (hasWindow) {
            renderProcess.changeWindow(
              WIN_ACTION_TYPE.IS_CLOSE,
              WINDOW_TYPE.IS_TRTC,
            );
          }
          await ClientLogOut();
        });
      }
    },
    $route: {
      handler: async function (val) {
        if (val.name === 'Login') {
          const trtcSession = await renderProcess.getStore('TRTC_SESSION');
          if (trtcSession) return;
          await this.handleGetVersion();
        }
      },
      deep: true,
    },
  },
  async created() {
    const synergyHistory = await window.$localStore.getItem('synergyHistory');
    await this.setSynergyHistory(!!synergyHistory ? synergyHistory : []);
    const searchHistory = await window.$localStore.getItem('searchHistory');
    await this.setSearchHistory(!!searchHistory ? searchHistory : []);

    renderProcess.IMSDKListener((event, data) => {
      const { type, value } = data;
      IMSDKCallBackEvents[type](this, value);
    });
    renderProcess.mainProcessError((event, info) => {
      const { msg, type } = info;
      if (type === 'MESSAGE') {
        this.$message.warning(msg);
        return;
      }
      this.$LConfirm({
        title: '提示',
        content: msg,
        showCancelBtn: false,
      }).then(() => {
        renderProcess.changeWindow(
          WIN_ACTION_TYPE.IS_CLOSE,
          WINDOW_TYPE.IS_MAIN,
        );
      });
    });
  },
  mounted() {
    document.addEventListener(
      'dragstart',
      function (event) {
        event.preventDefault();
        return false;
      },
      true,
    );
  },
  methods: {
    ...mapActions('IMStore', ['setSynergyHistory']),
    ...mapActions('globalStore', [
      'setUserErrorMsg',
      'setUpdateNotify',
      'setUpdateInfo',
      'setSearchHistory',
    ]),

    async handleGetVersion() {
      if (process.env.NODE_ENV === 'development') return;
      const updateInfo = await fetchVersion();
      if (!updateInfo?.version) return;
      this.visibleUpdate = true;
    },

    handleCancelUpdate() {
      this.visibleUpdate = false;
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: 'Alibaba-PuHuiTi-R';
}

body {
  height: 100vh;
  width: 100vw;
  scroll-behavior: smooth;
  user-select: none;
  overflow: hidden;
  box-sizing: border-box;
}

#lanshu-app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform: translate3d(0, 0, 0);
  color: $main-text-color;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
