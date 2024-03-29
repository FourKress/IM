const { defineConfig } = require('@vue/cli-service');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  pluginOptions: {
    electronBuilder: {
      // 不打包，使用 require 加载
      externals: [
        'electron-screenshots',
        'lim-sdk-electron',
        'trtc-electron-sdk',
      ],
      preload: {
        preload: './src/preload.js',
      },
      nodeIntegration: true,

      customFileProtocol: '../',

      chainWebpackRendererProcess: (config) => {
        config.externals({
          'trtc-electron-sdk': 'commonjs2 trtc-electron-sdk',
        });
        config.module
          .rule()
          .test(/\.node$/)
          .use()
          .loader('native-ext-loader')
          .options({
            emit: true,
            rewritePath: 'node_modules/trtc-electron-sdk/build/Release',
          });

        config.plugin('html').tap((args) => {
          args[0].title = '北象IM';
          return args;
        });

        return config;
      },

      builderOptions: {
        appId: 'com.lanshu.app',
        productName: '北象IM', //项目名，也是生成的安装文件名，即Demo.exe
        copyright: 'Copyright © 2023', //版权信息
        directories: {
          output: 'build', //输出文件路径
        },
        icon: './icons/icon.ico',
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications',
            },
            {
              x: 130,
              y: 150,
              type: 'file',
            },
          ],
        },

        nsis: {
          oneClick: false, // 是否一键安装
          allowElevation: true, // 允许请求提升。若为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, //是否允许修改安装目录
          installerIcon: './icons/icon.ico', // 安装时图标
          uninstallerIcon: './icons/icon.ico', //卸载时图标
          installerHeaderIcon: './icons/icon.ico', // 安装时头部图标
          createDesktopShortcut: true, // 是否创建桌面图标
          createStartMenuShortcut: true, // 是否创建开始菜单图标
          shortcutName: '北象IM', // 快捷方式名称
          runAfterFinish: true, //是否安装完成后运行
        },
        win: {
          icon: './icons/icon.ico', //图标路径
          target: [
            {
              target: 'nsis', //利用nsis制作安装程序
              arch: [
                'x64', //64位
                // 'ia32', //32位
              ],
            },
          ],
          extraFiles: [
            {
              from: 'node_modules/trtc-electron-sdk/build/Release/',
              to: './resources',
              filter: ['**/*'],
            },
            {
              from: './icons',
              to: './resources/icons',
            },
          ],
        },

        mac: {
          extraFiles: [
            {
              from: 'node_modules/trtc-electron-sdk/build/Release/trtc_electron_sdk.node',
              to: './Resources',
            },
            {
              from: 'node_modules/trtc-electron-sdk/build/mac-framework/',
              to: './Frameworks',
            },
          ],
        },

        afterPack: 'node_modules/@lanshu/main-process/src/afterPack.js',
      },
    },
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@lanshu/layout/src/assets/styles/theme.scss";`,
      },
    },
  },

  configureWebpack: {
    devtool: isDevelopment ? 'eval-source-map' : false,
    experiments: {
      topLevelAwait: true,
    },
  },

  devServer: {
    client: {
      overlay: false,
    },
  },
});
