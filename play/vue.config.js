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
