<template>
  <div id="lanshu-app">
    <MainLayout />

    <LsCardDialog :visible.sync="visibleUpdate" :is-modal-close="false">
      <LsUpdate :startDownload="startDownload" />
    </LsCardDialog>
  </div>
</template>

<script>
import MainLayout from './components/layout';
import { IMSDKCallBackEvents } from '@lanshu/im';
import { renderProcess } from '@lanshu/render-process';
import { LsUpdate, LsCardDialog } from '@lanshu/components';
import { mapGetters } from 'vuex';

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
    ...mapGetters('globalStore', ['updateVersion', 'startDownload'])
  },
  watch: {
    updateVersion() {
      this.visibleUpdate = true;
    },
    startDownload() {
      this.visibleUpdate = true;
    }
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
  methods: {},
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: 'Alibaba-PuHuiTi-R';
}

html,
body {
  height: 100%;
  scroll-behavior: smooth;
  user-select: none;
  border-radius: 16px;
  overflow: hidden;
}

#lanshu-app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform: translate3d(0, 0, 0);
  color: $main-text-color;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background: #d8d8d8;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
</style>
