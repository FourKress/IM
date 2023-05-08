import { ipcMain, app, shell } from 'electron';
import { handleFileOpen, calcFileSize, deleteFile } from './utils';
import { initScreenshots } from './screenshots';
import {
  showLoginWindow,
  showMainWindow,
  changeWindow,
  openTRTCWindow,
} from './window';
import { unregisterHotKeyAll, initHotKeys, handleHotKey } from './hotKey';
import {
  IMSDKEvent,
  IMSDK_Destroy,
  IMSDKNetworkCallEvent,
  IMSDKNetworkCallRefresh,
  IMSDKInit,
} from './IM-SDK';
import electronLog from 'electron-log';
import increment from './increment';

const initIpcMain = () => {
  app.whenReady().then(async () => {
    // win环境 开启通知
    if (process.platform === 'win32') {
      app.setAppUserModelId('蓝数IM');
    }

    showLoginWindow();
    // showMainWindow();

    // 初始化截图
    initScreenshots();

    ipcMain.on('changeWindow', async (_event, type, win) => {
      if (type === 'close' && win === 'main') {
        await IMSDK_Destroy();
      }
      changeWindow(type, win);
    });

    ipcMain.handle('openFile', (_event, type) => handleFileOpen(type));

    ipcMain.handle('IMSDKIPC', (_event, provider, event, data) =>
      IMSDKEvent(provider, event, data),
    );

    ipcMain.handle('IMSDKNetworkCall', (_event, event, data) =>
      IMSDKNetworkCallEvent(event, data),
    );

    ipcMain.on('IMSDKNetworkCallRefresh', (_event, data) =>
      IMSDKNetworkCallRefresh(data),
    );

    ipcMain.on('showMainWindow', (_event, config) => {
      const { appId } = config;
      IMSDKInit(appId);
      initHotKeys();
      showMainWindow();
    });

    ipcMain.on('showLoginWindow', (_event, delay) => {
      unregisterHotKeyAll();
      showLoginWindow(delay);
    });

    ipcMain.on('openUrl', async (_event, url) => {
      await shell.openExternal(url);
    });

    ipcMain.on('cleanFile', async (_event, path) => {
      await deleteFile(path);
    });

    ipcMain.handle('getFileSize', async (_event, dirPath) => {
      return await calcFileSize(dirPath);
    });

    ipcMain.on('setHotKey', async (_event, params) => {
      await handleHotKey(params);
    });

    ipcMain.handle('getStore', async (_event, key) => {
      return await global.store.get(key);
    });

    ipcMain.on('setStore', async (_event, key, data) => {
      await global.store.set(key, data);
    });

    ipcMain.on(
      'openTRTCWindow',
      async (_event, type) => await openTRTCWindow(type),
    );

    ipcMain.handle('hasWindow', (_event, win) => {
      return !!global[win];
    });

    ipcMain.on('setAutoStart', async (_event, isAutoStart) => {
      global.store.set('AUTO_START', isAutoStart);
      app.setLoginItemSettings({
        openAtLogin: isAutoStart,
      });
    });

    // 触发检查更新并且下载
    ipcMain.on('checkForUpdates', async (_event) => {
      console.log('检查更新');
      electronLog.info('检查更新, 增量更新');
      await increment({
        upDateUrl: 'http://192.168.88.253:7654/app.zip',
        upDateExe: 'http://192.168.88.253:7654/update.exe',
      });
    });
  });
};

export { initIpcMain };
