<template>
  <div id="lanshu-app">
    <MainLayout />

    <LsCardDialog :visible.sync="visibleUpdate" background-color="rgba(0,0,0,.5)" :is-modal-close="false">
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
import { WINDOW_TYPE } from '@lanshu/utils';

export default {
  name: 'App',
  components: {
    MainLayout,
    LsUpdate,
    LsCardDialog,
  },
  data() {
    return {
      keys: [],
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
        this.setUserErrorMsg();
        this.$Lconfirm({
          title: '提示',
          content: msg,
        }).then(async () => {
          const hasWindow = await renderProcess.hasWindow('TRTCWindow');
          if (hasWindow) {
            renderProcess.changeWindow(
              this.WIN_ACTION_TYPE.IS_CLOSE,
              WINDOW_TYPE.IS_TRTC,
            );
          }
          await ClientLogOut();
        });
      }
    },
  },
  created() {
    renderProcess.updateClient((event, value) => {
      this.$Lconfirm({
        title: '应用更新',
        content: '发现新版本，是否更新？',
      }).then(() => {
        event.sender.send('startUpdate', 'startUpdate');
      });
    });
    renderProcess.IMSDKListener((event, data) => {
      const { type, value } = data;
      console.log(type, value);
      IMSDKCallBackEvents[type](this, value);
    });
    renderProcess.mainProcessError((event, msg) => {
      this.$message.warning(msg);
    });
  },
  mounted() {
    this.handleGetVersion();

    document.addEventListener('keydown', (event) => {
      const code = event.code;
      const keys = [
        'ShiftRight',
        'ShiftLeft',
        'ControlRight',
        'ControlLeft',
        'KeyR',
        'KeyI',
      ];
      if (keys.includes(code)) {
        this.keys.push(code);
        if (this.keys.every((d) => keys.includes(d))) {
          // event.preventDefault();
          return;
        }
      }
    });
    document.addEventListener('keyup', () => {
      this.keys = [];
    });
  },
  methods: {
    ...mapActions('globalStore', [
      'setUserErrorMsg',
      'setUpdateNotify',
      'setUpdateInfo',
    ]),

    async handleGetVersion() {
      // TODO 检查是否有新版本 强制OR非强制
      const isUpdate = false;
      const updateInfo = {
        version: '3.2.3',
        isForced: false,
      };
      if (!isUpdate) return;
      this.setUpdateInfo(updateInfo);
      if (!updateInfo?.isForced) {
        this.setUpdateNotify(true);
      }
      this.visibleUpdate = true;
    },

    handleCancelUpdate () {
      this.visibleUpdate = false;
    }
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
