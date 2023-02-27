const { LimMain, LogLevel } = require('lim-sdk-electron');

export const IMSDKInit = (appId) => {
  const limMain = new LimMain({ appId });
  const IMSDK = limMain.init();

  global.IMSDK = IMSDK;

  IMSDK.getMainProvider().setLogLevel(
    process.env.WEBPACK_DEV_SERVER_URL ? LogLevel.INFO : LogLevel.ERROR,
  );

  IMSDK.getMainProvider().setNetworkChangeCallBack((state) => {
    // state 网络状态 0：正在连接、-1：连接断开、1：连接成功
    console.log('Network', state);
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'Network',
      state,
    });
  });

  IMSDK.getMainProvider().setDataSyncCallBack((state) => {
    // state 同步状态 1、同步中，2、同步完成，3、同步失败
    console.log('DataSync', state);
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'DataSync',
      state,
    });
  });
};

export const IMSDKEvent = (provider, event, data) => {
  return global.IMSDK[provider]()[event](...data);
};
