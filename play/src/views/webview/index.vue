<template>
  <div
    class="webview-container"
    v-loading="isLoading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 1)"
  >
    <webview
      class="webview"
      v-if="webviewSrc"
      :src="webviewSrc"
      :key="webviewSrc"
      allowpopups
      :preload="preloadPath"
    ></webview>

    <div class="nav-main" v-if="isNavPage">
      <div class="title">产业政策服务</div>
      <div class="nav-container">
        <div
          class="nav-panel"
          v-for="(config, index) in navConfigList"
          :key="index"
        >
          <div class="label">{{ config.label }}</div>
          <div class="nav-list">
            <div
              class="nav-item"
              v-for="(nav, index) in config.navList"
              :key="index"
              @click="handleJump(nav)"
            >
              {{ nav.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="btn" v-if="historySrcList.length" @click="handleBack">
      <LsIcon
        render-svg
        icon="ls-icon-icon_fanhui_hover"
        width="28"
        height="28"
      ></LsIcon>
    </div>
  </div>
</template>

<script>
import { renderProcess } from '@lanshu/render-process';
import { LsIcon } from '@lanshu/components';

export default {
  name: 'WebviewPage',
  data() {
    return {
      webviewSrc: '',
      historySrcList: [],
      preloadPath: '',
      preloadConfig: {},
      isLoading: false,
      isNavPage: false,
      navConfigList: [
        {
          label: '政策对比',
          navList: [
            {
              label: '集成电路产业',
              link: 'PolicyComparison?compareIds=UmaK34YBBKiAvZj7pFa0,ABnw0IYBcim9gv-j4MAv,S3V-5IYBBKiAvZj75lx8',
            },
            {
              label: '5G产业',
              link: 'PolicyComparison?compareIds=Ihnu0IYBcim9gv-j2i10,kRv40IYBcim9gv-jPcul',
            },
            {
              label: '区块链产业',
              link: 'PolicyComparison?compareIds=Dh8H0YYBcim9gv-j1sXd,7xjq0IYBcim9gv-j7hSJ',
            },
          ],
        },

        {
          label: '政策谱系',
          navList: [
            {
              label: '深圳市工业和信息化产业发展专项资金管理办法',
              link: 'WeeklyReportContent/content?id=jBnu0IYBcim9gv-jPgLp',
            },
            {
              label: '江苏省水域保护办法',
              link: 'WeeklyReportContent/content?id=2xz60IYBcim9gv-jtnQN',
            },
            {
              label: '上海市智能网联汽车高精度地图管理试点规定',
              link: 'WeeklyReportContent/content?id=QRfn0IYBcim9gv-j-z47',
            },

            {
              label: '深圳发展新兴产业集群和培育发展未来产业的意见',
              link: 'WeeklyReportContent/content?id=93OE44YBBKiAvZj7tDAG',
            },
            {
              label: '广东发展战略性支柱产业集群和战略性新兴产业集群的意见',
              link: 'WeeklyReportContent/content?id=ABrz0IYBcim9gv-jbnvJ',
            },
            {
              label: '深圳龙华区养老服务从业人员补贴奖励办法',
              link: 'WeeklyReportContent/content?id=QBfn0IYBcim9gv-jjh5j',
            },
          ],
        },

        {
          label: '政策脉络',
          navList: [
            {
              label: '2022年国务院推进乡村振兴工作意见',
              link: 'WeeklyReportContent/content?id=xSaU2YYBcim9gv-jKvLz',
            },
            {
              label: '推进苏州软件和集成电路产业发展通知',
              link: 'WeeklyReportContent/content?id=p3Jb44YBBKiAvZj7p-DM',
            },
            {
              label: '2022年上海节能减排专项资金安排计划',
              link: 'WeeklyReportContent/content?id=1hbk0IYBcim9gv-jFSBi',
            },
          ],
        },
      ],
    };
  },
  components: {
    LsIcon,
  },
  watch: {
    $route() {
      this.getSrc();
      setTimeout(() => {
        this.handleWebviewListener();
      });
    },
  },
  async created() {
    this.preloadPath = window.webviewPreload;
    this.getSrc();
  },
  mounted() {
    renderProcess.webviewOpenUrl((event, url) => {
      console.log('webviewOpenUrl', url);
      this.historySrcList.push(this.webviewSrc);
      this.webviewSrc = url;
    });

    setTimeout(() => {
      this.handleWebviewListener();
    });
  },
  methods: {
    getSrc() {
      this.historySrcList = [];
      const {
        webviewSrc,
        preloadConfig = {},
        isNavPage = false,
      } = this.$route?.meta || {};

      this.isNavPage = isNavPage;
      this.isLoading = !isNavPage;
      this.webviewSrc = webviewSrc;

      this.preloadConfig = preloadConfig;
    },

    handleWebviewListener() {
      const webview = document.querySelector('.webview');

      webview.addEventListener('dom-ready', () => {
        console.log('webview dom-ready');
        const insertCSS = this.preloadConfig.insertCSS;
        if (!insertCSS) return;
        webview.insertCSS(`
          ${this.preloadConfig.insertCSS}
        `)
        webview.openDevTools();
      })

      webview.addEventListener('did-finish-load', () => {
        console.log('webview did-finish-load');
        webview.addEventListener('ipc-message', async (event) => {
          if (event.channel == 'WEBVIEW_IPC') {
            const result = event.args[0]; // 获取返回值
            if (result === 'SUCCESS') {
              console.log('登录成功');
              this.isLoading = false;
            }
          }
        });
        webview.send('WEBVIEW_LOGIN', {
          ...this.preloadConfig,
        });
      });

      webview.addEventListener('console-message', (e) => {
        const { message } = e;
        if (!message.includes('WEBVIEW_IPC')) return;
        console.log(message);
      });
    },

    handleBack() {
      const backPath = this.historySrcList.pop();
      if (backPath === 'NAV_PAGE') {
        this.isNavPage = true;
      } else {
        this.webviewSrc = this.historySrcList.pop();
      }
    },

    handleJump(nav) {
      const { webviewSrc } = this.$route?.meta || {};
      this.isLoading = true;
      setTimeout(() => {
        this.isNavPage = false;
        this.isLoading = false;
      }, 200)
      this.historySrcList.push('NAV_PAGE');
      this.webviewSrc = `${webviewSrc}${nav.link}`;
    },
  },
};
</script>

<style scoped lang="scss">
.webview-container {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

  ::v-deep .el-loading-mask {
    z-index: 4;
  }

  .webview {
    flex: 1;
    display: flex;
  }

  .btn {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    z-index: 2;
    opacity: 0.6;
  }

  .nav-main {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    background-color: #fff;

    .title {
      width: 100%;
      height: 50px;
      line-height: 50px;
      padding: 0 30px;
      box-sizing: border-box;
      box-shadow: inset 0px -1px 0px 0px #eeeeee;

      font-size: 16px;
      font-weight: bold;
      color: $main-text-color;
    }

    .nav-container {
      padding: 20px 30px;
      box-sizing: border-box;

      .nav-panel {
        margin-bottom: 40px;
        color: $main-text-color;

        .label {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .nav-list {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;

          .nav-item {
            text-align: center;
            padding: 0 20px;
            height: 40px;
            line-height: 40px;
            background: #e7eef5;
            border-radius: 4px;
            margin: 0 20px 30px 0;
            font-size: 14px;
            cursor: pointer;

            &:hover {
              background-color: #d5e3f1;
            }
          }
        }
      }
    }
  }
}
</style>
