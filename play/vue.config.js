const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      // 不打包，使用 require 加载
      externals: ['electron-screenshots'],
      preload: './src/preload.js',
      // nodeIntegration: true,
      // nodeModulesPath: '../node_modules',

      builderOptions: {
        appId: 'com.lanshu.app',
        productName: 'Lanshu', //项目名，也是生成的安装文件名，即aDemo.exe
        copyright: 'Copyright © 2023', //版权信息
        directories: {
          output: 'build', //输出文件路径
        },
        icon: './icons/icon_512x512.png',
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
        publish: [
          {
            provider: 'generic',
            url: 'http://192.168.88.115:7777/',
          },
        ],
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "${path.resolve(
          __dirname,
          './node_modules/@lanshu/layout/src/assets/styles/theme.scss',
        )}";`,
      },
    },
  },
});
