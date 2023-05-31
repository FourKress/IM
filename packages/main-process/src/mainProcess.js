import { ipcMain, app, shell, BrowserWindow } from 'electron';
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
import {
  getCacheDirInfo,
  getCacheFilePath,
  initCache,
  saveCacheFile,
  setCacheDir,
} from './cache';

const initIpcMain = () => {
  app.whenReady().then(async () => {
    // win环境 开启通知
    if (process.platform === 'win32') {
      app.setAppUserModelId('蓝数IM');
    }

    // 初始化缓存
    initCache();

    showLoginWindow();

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

    ipcMain.on('IMSDK_INIT', async (_event, appId) => {
      await IMSDKInit(appId);
    });

    ipcMain.on('showMainWindow', (_event, config) => {
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
    ipcMain.on('checkForUpdates', async (_event, config) => {
      console.log('检查更新', config);
      electronLog.info('检查更新, 增量更新');
      electronLog.info(config);
      const { version, fetchUrl } = config;

      await increment({
        upDateUrl: `${fetchUrl}app.zip`,
        upDateExe: `${fetchUrl}update.exe`,
        version,
      });
    });

    ipcMain.handle('getCacheFilePath', (_event, fileName) => {
      return getCacheFilePath(fileName);
    });

    ipcMain.on('saveCacheFile', async (_event, data) => {
      await saveCacheFile(data);
    });

    ipcMain.handle('getCacheDirInfo', async (_event) => {
      return await getCacheDirInfo();
    });

    ipcMain.on('setCacheDir', async (_event, path) => {
      setCacheDir(path);
    });

    ipcMain.on('showItemInFolder', async (_event, path) => {
      await shell.showItemInFolder(path);
    });

    ipcMain.on('previewAssets', async (_event, path) => {
      await shell.openPath(path);
    });

    ipcMain.handle('getFocusedWindow', (_event, win) => {
      return !!BrowserWindow.getFocusedWindow();
    });
  });
};

export { initIpcMain };
