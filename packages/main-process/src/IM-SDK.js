import { app } from 'electron';
import fs from 'fs';
import electronLog from './log';
import { openTRTCWindow } from './window';
import { CLIENT_TYPE } from './utils';

const { LimMain, LogLevel } = require('lim-sdk-electron');

export const IMSDKInit = (appId) => {
  const limMain = new LimMain({ appId });
  const IMSDK = limMain.init({
    filePath: `${app.getPath('userData')}/`,
  });

  global.IMSDK = IMSDK;

  IMSDK.getMainProvider().setLogLevel(
    process.env.WEBPACK_DEV_SERVER_URL ? LogLevel.INFO : LogLevel.INFO,
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
    const { msgType, sessId } = message;

    // 通话结束、取消、超时未接听或者拒绝
    if ([671, 672, 673, 674].includes(msgType)) {
      global.mainWindow.webContents.send('IMSDKListener', {
        type: 'RefreshMsg',
        value: sessId,
      });
      const TRTCWindow = global.TRTCWindow;
      if (!TRTCWindow) return;
      TRTCWindow.webContents.send('TRTCListener', {
        type: 'Close',
        value: msgType,
      });
    }
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'AddReceiveNewMessage',
      value: {
        message,
        silence,
      },
    });
  });

  IMSDK.getMainProvider().setNetworkCallListener(
    async (uuid, type, data, userId, userType) => {
      if (global.store.get('networkCallUUID') === uuid) return;
      global.store.set('networkCallUUID', uuid);
      console.log('setNetworkCallListener', uuid, type, data, userId, userType);
      const userInfo = await IMSDK.getUserProvider().getUserAttrbute(userId);
      const { avatar, nickname } = userInfo.data || {};
      await global.store.set('trtcSession', {
        toUser: userId,
        toUserType: userType,
        userId,
        avatar,
        nickname,
      });
      const { platform = CLIENT_TYPE.IS_PC, roomId } = data || {};
      await global.store.set('trtcCallInfo', {
        type,
        isBeInvited: true,
        platform,
        roomId,
        uuid,
      });
      console.log('openTRTCWindow');
      await openTRTCWindow(platform);
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
      let filePath = data[0];
      const isBase64 = filePath.includes('base64,');
      if (isBase64) {
        const writePath = `${app.getPath(
          'userData',
        )}\\temp_image_${Date.now()}.png`;
        const base64 = filePath.replace(/^data:image\/\w+;base64,/, '');
        const dataBuffer = Buffer.from(base64, 'base64');
        await fs.writeFileSync(writePath, dataBuffer);
        filePath = writePath;
      }
      console.log(filePath);
      const file = fs.createReadStream(filePath);
      res = await global.IMSDK[provider]()[event](file);
      if (isBase64) {
        fs.unlinkSync(filePath);
      }
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

export const IMSDKNetworkCallRefresh = (sessId) => {
  setTimeout(() => {
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'RefreshMsg',
      value: sessId,
    });
  }, 500);
};

export const IMSDK_Destroy = async () => {
  await IMSDK.getMainProvider().destroy();
};
