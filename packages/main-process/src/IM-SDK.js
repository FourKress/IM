import electronLog from './log';

const { LimMain, LogLevel } = require('lim-sdk-electron');

export const IMSDKInit = (appId) => {
  const limMain = new LimMain({ appId });
  const IMSDK = limMain.init();

  global.IMSDK = IMSDK;

  // IMSDK.getMainProvider().setLogLevel(
  //   process.env.WEBPACK_DEV_SERVER_URL ? LogLevel.INFO : LogLevel.ERROR,
  // );
  IMSDK.getMainProvider().setLogLevel(LogLevel.DEBUG);

  IMSDK.getMainProvider().setNetworkChangeCallBack((state) => {
    // state 网络状态 0：正在连接、-1：连接断开、1：连接成功
    console.log('Network', state);
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'Network',
      value: state,
    });
  });

  IMSDK.getMainProvider().setDataSyncCallBack((state) => {
    // state 同步状态 1、同步中，2、同步完成，3、同步失败
    console.log('DataSync', state);
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'DataSync',
      value: state,
    });
  });

  IMSDK.getMainProvider().setConvEventCallBack((convList) => {
    console.log('UpdateConvList', convList);
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'UpdateConvList',
      value: convList,
    });
  });

  IMSDK.getMainProvider().setConvTotalUnreadMessageCountChangeCallBack(
    (totalUnredMessageCount) => {
      console.log('ConvTotalUnreadMessageCount', totalUnredMessageCount);
      global.mainWindow.webContents.send('IMSDKListener', {
        type: 'ConvTotalUnreadMessageCount',
        value: totalUnredMessageCount,
      });
    },
  );

  IMSDK.getMainProvider().setKickOutedOfflineCallBack((info) => {
    console.log('KickOutedOffline', info);
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'KickOutedOffline',
      value: info,
    });
  });

  IMSDK.getMainProvider().setLogOutCallBack((level, str) => {
    console.log('LogOutCallBack', { level, str });
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'LogOutCallBack',
      value: {
        level,
        str,
      },
    });
  });

  IMSDK.getMainProvider().AddReceiveNewMessageCallBack((message, silence) => {
    console.log('AddReceiveNewMessage', { message, silence });
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'AddReceiveNewMessage',
      value: {
        message,
        silence,
      },
    });
  });
};

export const IMSDKEvent = async (provider, event, data) => {
  electronLog.info(
    `global.IMSDK[${provider}]()[${event}](${JSON.stringify(data)})`,
  );
  electronLog.info(global.IMSDK[provider]()[event]);
  // const result = await global.IMSDK[provider]()[event](...data);
  // electronLog.info(result);
  // return result;
  let result;
  try {
    const res = await global.IMSDK[provider]()[event](...data);
    electronLog.info(JSON.stringify(res));
    result = res;
  } catch (e) {
    electronLog.info(JSON.stringify(e));
    result = e;
  }
  return result;

  // return new Promise((resolve, reject) => {
  //   global.IMSDK[provider]()
  //     [event](...data)
  //     .then((res) => {
  //       electronLog.info(res);
  //       resolve(res);
  //     })
  //     .catch((err) => {
  //       electronLog.info(err);
  //       reject(err);
  //     });
  // });
};

export const IMSDK_Destroy = async () => {
  await IMSDK.getMainProvider().destroy();
};
