import { app } from 'electron';
import fs from 'fs';
import electronLog from './log';
import { openTRTCWindow } from './window';
import { clientType } from './utils';

const { LimMain, LogLevel, ModelUtil } = require('lim-sdk-electron');

export const IMSDKInit = (appId) => {
  const limMain = new LimMain({ appId });
  const IMSDK = limMain.init({
    filePath: `${app.getPath('userData')}/`,
  });

  global.IMSDK = IMSDK;

  IMSDK.getMainProvider().setLogLevel(
    process.env.WEBPACK_DEV_SERVER_URL ? LogLevel.INFO : LogLevel.DEBUG,
  );

  IMSDK.getMainProvider().setNetworkChangeCallBack((state) => {
    // state 网络状态 0：正在连接、-1：连接断开、1：连接成功
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'Network',
      value: state,
    });
  });

  IMSDK.getMainProvider().setDataSyncCallBack((state) => {
    // state 同步状态 1、同步中，2、同步完成，3、同步失败
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'DataSync',
      value: state,
    });
  });

  IMSDK.getMainProvider().setConvEventCallBack(async (convList) => {
    await global.store.set('convList', convList);
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'UpdateConvList',
      value: convList,
    });
  });

  IMSDK.getMainProvider().setConvTotalUnreadMessageCountChangeCallBack(
    (totalUnredMessageCount) => {
      global.mainWindow.webContents.send('IMSDKListener', {
        type: 'ConvTotalUnreadMessageCount',
        value: totalUnredMessageCount,
      });
    },
  );

  IMSDK.getMainProvider().setKickOutedOfflineCallBack((info) => {
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'KickOutedOffline',
      value: info,
    });
  });

  IMSDK.getMainProvider().setLogOutCallBack((level, str) => {
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'LogOutCallBack',
      value: {
        level,
        str,
      },
    });
  });

  IMSDK.getMainProvider().AddReceiveNewMessageCallBack((message, silence) => {
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'AddReceiveNewMessage',
      value: {
        message,
        silence,
      },
    });
  });

  IMSDK.getMainProvider().setNetworkCallListener(
    async (uuid, type, userId, userType) => {
      await global.store.set('trtcSession', {
        toUser: userId,
        toUserType: userType,
      });
      await global.store.set('trtcCallInfo', {
        type,
        isBeInvited: false,
        platform: ModelUtil.getModel().platform,
      });
      await openTRTCWindow(clientType.isPc);
    },
  );

  IMSDK.getMainProvider().setFriendAddRequestUpdateListener(
    (friendAddRequestCount) => {
      console.log(friendAddRequestCount, 'friendAddRequestCount');
      global.mainWindow.webContents.send('IMSDKListener', {
        type: 'FriendAddRequestUpdateListener',
        value: friendAddRequestCount,
      });
    },
  );
};

export const IMSDKEvent = async (provider, event, data) => {
  console.log(event, data);
  try {
    let res;
    if (event === 'uploadFile') {
      const file = fs.createReadStream(data[0]);
      res = await global.IMSDK[provider]()[event](file);
    } else {
      res = await global.IMSDK[provider]()[event](...data);
    }
    electronLog.info(JSON.stringify(res));
    return res;
  } catch (e) {
    electronLog.info(JSON.stringify(e));
    return e;
  }
};

export const IMSDKNetworkCallEvent = async (event, data) => {
  console.log(event, data);
  try {
    const provider = global.IMSDK.getNetworkPhoneProvider();
    const res = await provider[event](...data, (uuid, state) => {
      console.log('回调：', uuid, state);
    });
    electronLog.info(JSON.stringify(res));
    return res;
  } catch (e) {
    electronLog.info(JSON.stringify(e));
    return e;
  }
};

export const IMSDK_Destroy = async () => {
  await IMSDK.getMainProvider().destroy();
};
