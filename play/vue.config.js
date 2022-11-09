const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      // 不打包，使用 require 加载
      externals: ["electron-screenshots"],
      preload: './src/preload.js'
    },
  },
});
