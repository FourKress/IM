import { app, BrowserWindow } from 'electron';
import fs from 'fs';
import { electronLog, sdkLog } from './log';
import { openTRTCWindow } from './window';
import { CLIENT_TYPE, IS_DEVELOPMENT } from './utils';
import trayEvent from './trayEvent';

const { LimMain, LogLevel } = require('lim-sdk-electron');

const getEnv = () => {
  return IS_DEVELOPMENT ? 'test' : 'prod';
};

export const IMSDKInit = (appId) => {
  const limMain = new LimMain({ appId });
  const IMSDK = limMain.init({
    filePath: `${app.getPath('userData')}/`,
    env: getEnv(),
  });

  global.IMSDK = IMSDK;

  IMSDK.getMainProvider().setLogLevel(
    process.env.WEBPACK_DEV_SERVER_URL ? LogLevel.INFO : LogLevel.INFO,
  );

  IMSDK.getMainProvider().setNetworkChangeCallBack((state) => {
    electronLog.info(`setNetworkChangeCallBack: ${state}`);
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
    sdkLog.info(`${level}： ${str}`);
  });

  IMSDK.getMainProvider().setMessageSendingStateCallBack((sendState, msg) => {
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'MessageSendingStateCallBack',
      value: {
        sendState,
        msg,
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

    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (!focusedWindow) {
      trayEvent.setFlash();
    }

    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'AddReceiveNewMessage',
      value: {
        message,
        silence,
        isFocused: !!focusedWindow,
      },
    });
  });

  IMSDK.getMainProvider().setNetworkCallListener(
    async (uuid, type, data = {}, userId, userType) => {
      const hasGlobalWindow = global.TRTCWindow;
      // 已存在通话 忽略新的呼叫
      if (!!hasGlobalWindow) return;

      if (global.store.get('NETWORK_CALL_UUID') === uuid) return;
      global.store.set('NETWORK_CALL_UUID', uuid);
      electronLog.info(
        `setNetworkChangeCallBack: ${uuid} ${type} ${data} ${userId} ${userType}`,
      );
      const { platform = CLIENT_TYPE.IS_PC, roomId, avatar, nickname } = data;
      await global.store.set('TRTC_SESSION', {
        toUser: userId,
        toUserType: userType,
        userId,
        avatar,
        nickname,
      });
      await global.store.set('TRTC_CALL_INFO', {
        type,
        isBeInvited: true,
        platform,
        roomId,
        uuid,
      });
      electronLog.info('openTRTCWindow');
      await openTRTCWindow(platform);
    },
  );

  IMSDK.getMainProvider().setFriendAddRequestUpdateListener(
    (friendAddRequestCount) => {
      electronLog.info(`friendAddRequestCount: ${friendAddRequestCount}`);
      global.mainWindow.webContents.send('IMSDKListener', {
        type: 'FriendAddRequestUpdateListener',
        value: friendAddRequestCount,
      });
    },
  );

  IMSDK.getMainProvider().setFriendDelListener((userId, delUerId) => {
    electronLog.info(`FriendDelListener: ${userId} ${delUerId}`);
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'FriendDelListener',
      value: {
        userId,
        delUerId,
      },
    });
  });

  IMSDK.getMainProvider().setUserTokenExpiredCallBack(() => {
    electronLog.info('UserTokenExpiredCallBack');
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'UserTokenExpiredCallBack',
      value: '',
    });
  });

  // 改所有除了我的群昵称的信息时触发
  IMSDK.getMainProvider().setUserNicknameAvatarUpdateListener(
    (userId, nickname, avatar) => {
      electronLog.info('UserNicknameAvatarUpdateListener');
      global.mainWindow.webContents.send('IMSDKListener', {
        type: 'UserNicknameAvatarUpdateListener',
        value: {
          userId,
          nickname,
          avatar,
        },
      });
    },
  );

  // 群成员信息变更回调
  IMSDK.getMainProvider().setGroupUserAttributeChangedCallBack(
    (groupId, userId, avatar, nickname) => {
      electronLog.info('GroupUserAttributeChangedCallBack');
      global.mainWindow.webContents.send('IMSDKListener', {
        type: 'GroupUserAttributeChangedCallBack',
        value: {
          groupId,
          userId,
          avatar,
          nickname,
        },
      });
    },
  );

  IMSDK.getMainProvider().setGroupMemberDeleteCallBack((groupId) => {
    electronLog.info(`GroupMemberDeleteCallBack: ${groupId}`);
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'GroupMemberDeleteCallBack',
      value: {
        groupId,
      },
    });
  });

  IMSDK.getMainProvider().setGroupMemberCountChangesListener(
    (groupId, groupMemberCount) => {
      electronLog.info(
        `GroupMemberCountChangesListener: ${groupId} ${groupMemberCount}`,
      );
      global.mainWindow.webContents.send('IMSDKListener', {
        type: 'GroupMemberCountChangesListener',
        value: {
          groupId,
          groupMemberCount,
        },
      });
    },
  );

  IMSDK.getMainProvider().setGroupRoleManagerUpgradeListener(
    (groupRoleManager = {}) => {
      electronLog.info(`GroupRoleManagerUpgradeListener: ${groupRoleManager}`);
      global.mainWindow.webContents.send('IMSDKListener', {
        type: 'GroupRoleManagerUpgradeListener',
        value: {
          groupRoleManager,
        },
      });
    },
  );

  IMSDK.getMainProvider().setRevokeMessageCallback((revokeMessage = {}) => {
    electronLog.info(`RevokeMessageCallback: ${revokeMessage}`);
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'RevokeMessageCallback',
      value: {
        revokeMessage,
      },
    });
  });

  IMSDK.getMainProvider().setReceiptMessageCallback((receipts = []) => {
    electronLog.info(`ReceiptMessageCallback: ${receipts}`);
    global.mainWindow.webContents.send('IMSDKListener', {
      type: 'ReceiptMessageCallback',
      value: {
        receipts,
      },
    });
  });
};

export const IMSDKEvent = async (provider, event, data) => {
  electronLog.info(`${event} ${data}`);
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
  electronLog.info(`${event} ${data}`);
  try {
    const provider = global.IMSDK.getNetworkPhoneProvider();
    const res = await provider[event](...data, (uuid, state) => {
      console.log('回调：', uuid, state);
    });
    electronLog.info(JSON.stringify(res));
    return res;
  } catch (e) {
    electronLog.error(JSON.stringify(e));
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
