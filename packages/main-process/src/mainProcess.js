import { ipcMain, app, shell } from 'electron';

import { handleFileOpen, calcFileSize, deleteFile } from './utils';
import { initScreenshots } from './screenshots';
import { showLoginWindow, showMainWindow, changeWindow } from './window';
import { unregisterHotKeyAll, initHotKeys, handleHotKey } from './hotKey';
import { IMSDKEvent } from './IM-SDK';

const initIpcMain = () => {
  app.whenReady().then(() => {
    // 初始化截图
    initScreenshots();

    ipcMain.on('changeWindow', (_event, type) => {
      changeWindow(type);
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
  });
};

export { initIpcMain };
