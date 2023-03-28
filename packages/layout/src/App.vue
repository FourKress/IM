<template>
  <div id="app">
    <MainLayout />
  </div>
</template>

<script>
import MainLayout from './components/layout';
import { IMSDKCallBackEvents } from '@lanshu/im';
import { renderProcess } from '@lanshu/render-process';

export default {
  name: 'App',
  components: {
    MainLayout,
  },
  data() {
    return {
      keys: [],
    };
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
      IMSDKCallBackEvents[type](value);
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
}

html,
body {
  height: 100%;
  scroll-behavior: smooth;
  user-select: none;
  font-family: 'Alibaba PuHuiTi R';
}

#app {
  font-family: 'Alibaba PuHuiTi R';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform: translate3d(0, 0, 0);
  color: $main-text-color;

  //min-width: 1366px;
  height: 100%;

  overflow: hidden;
  //width: 1680px;
  //height: 1050px;

  //width: 1034px;
  //height: 776px;
  box-sizing: border-box;
  background: #d8d8d8;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  //border: 1px solid #FFFFFF;
}
</style>
