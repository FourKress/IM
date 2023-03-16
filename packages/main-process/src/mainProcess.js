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
import { IMSDKEvent, IMSDK_Destroy } from './IM-SDK';

const initIpcMain = () => {
  app.whenReady().then(() => {
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

    ipcMain.on('openTRTCWindow', async (_event) => await openTRTCWindow());
  });
};

export { initIpcMain };
