const { defineConfig } = require('@vue/cli-service');
const JavaScriptObfuscator = require('webpack-obfuscator');

const isDevelopment = process.env.NODE_ENV === 'development';

const obfuscatorOptions = {
  // 压缩代码
  compact: true,
  // 是否启用控制流扁平化(降低1.5倍的运行速度)
  controlFlowFlattening: false,
  // 应用概率;在较大的代码库中，建议降低此值，因为大量的控制流转换可能会增加代码的大小并降低代码的速度。
  // controlFlowFlatteningThreshold: 0.25,
  // 随机的死代码块(增加了混淆代码的大小)
  deadCodeInjection: false,
  // 死代码块的影响概率
  // deadCodeInjectionThreshold: 0.4,
  // 此选项几乎不可能使用开发者工具的控制台选项卡
  debugProtection: true,
  // 如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
  debugProtectionInterval: true,
  // 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
  disableConsoleOutput: true,
  // 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  // 允许将数字转换为表达式
  numbersToExpressions: true,
  // 是否启用全局变量和函数名称的混淆
  renameGlobals: false,
  // 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
  rotateStringArray: true,
  splitStrings: true,
  // 混淆后的代码,不能使用代码美化,同时需要配置 compact:true;
  selfDefending: true,
  // 删除字符串文字并将它们放在一个特殊的数组中
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 1,
  transformObjectKeys: true,
  // 允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
  unicodeEscapeSequence: false,
};

class UnicodeWebpackPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'UnicodeWebpackPlugin',
      (compilation, callback) => {
        compilation.chunks.map((chunk) => {
          chunk.files.map((filename) => {
            if (
              filename.includes('.js') &&
              ['runtime', 'chunk'].every((d) => !filename.includes(d))
            ) {
              compilation.assets[filename]._value = gbk2Unicode(
                compilation.assets[filename]._value,
              );
            }
          });
        });
        callback();
      },
    );
  }
}

function gbk2Unicode(content) {
  return content.replace(/([\u0080-\uffff])/g, (str) => {
    let hex = str.charCodeAt(0).toString(16);
    for (let i = hex.length; i < 4; i++) {
      hex = '0' + hex;
    }
    return '\\u' + hex;
  });
}

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

      chainWebpackMainProcess: (config) => {
        config.when(!isDevelopment, (config) => {
          config.module
            .rule()
            .exclude.add(/node_modules(?!.*@lanshu.*(?!.*node_modules))/)
            .end()
            .test(/\.js$/)
            .use()
            .loader(JavaScriptObfuscator.loader)
            .options(obfuscatorOptions);
        });

        return config;
      },

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

        config.optimization.splitChunks({
          chunks: 'all', // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
          minSize: 10 * 1024, // 最小尺寸，30000
          automaticNameDelimiter: '-', // 打包分隔符
          cacheGroups: {
            elementUI: {
              name: 'chunk-elementUI',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
            },
            qiankun: {
              name: 'chunk-qiankun',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?qiankun(.*)/,
            },
            video: {
              name: 'chunk-video',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?video\.js(.*)/,
            },
            recordrtc: {
              name: 'chunk-recordrtc',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?recordrtc(.*)/,
            },
            localforage: {
              name: 'chunk-localforage',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?localforage(.*)/,
            },
            dayjs: {
              name: 'chunk-dayjs',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?dayjs(.*)/,
            },
            pinyin: {
              name: 'chunk-pinyin',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?pinyin(.*)/,
            },
            qrcode: {
              name: 'chunk-qrcode',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?qrcode(.*)/,
            },
            lodash: {
              name: 'chunk-lodash',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?lodash(.*)/,
            },
            vuex: {
              name: 'chunk-vuex',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?vuex(.*)/,
            },
            vue: {
              name: 'chunk-vue',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?vue(.*)/,
            },
            vueRouter: {
              name: 'chunk-vueRouter',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?vue-router(.*)/,
            },
            domToImage: {
              name: 'chunk-domToImage',
              priority: 20,
              test: /[\\/]node_modules[\\/]_?dom-to-image(.*)/,
            },
          },
        });

        config.optimization.runtimeChunk('single');

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

    plugins: isDevelopment
      ? []
      : [
          new JavaScriptObfuscator(obfuscatorOptions, [
            ('**/chunk-**.**.js', '**/runtime.**.js'),
          ]),
          new UnicodeWebpackPlugin(),
        ],
  },

  devServer: {
    client: {
      overlay: false,
    },
  },
});
