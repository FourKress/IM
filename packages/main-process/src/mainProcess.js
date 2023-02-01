import { ipcMain, app, shell, globalShortcut } from 'electron';

import { handleFileOpen, calcFileSize, deleteFile } from './utils';
import { initScreenshots } from './screenshots';
import { showLoginWindow, showMainWindow, changeWindow } from './window';
import { unregisterHotKeyAll, initHotKeys, handleHotKey } from './hotKey';

const initIpcMain = () => {
  app.whenReady().then(() => {
    // 初始化截图
    initScreenshots();

    ipcMain.on('changeWindow', (event, type) => {
      changeWindow(type);
    });

    ipcMain.handle('openFile', (event, type) => handleFileOpen(type));

    ipcMain.on('showMainWindow', (event, config) => {
      initHotKeys();
      showMainWindow();
    });

    ipcMain.on('showLoginWindow', (event, delay) => {
      unregisterHotKeyAll();
      showLoginWindow(delay);
    });

    ipcMain.on('openUrl', async (event, url) => {
      await shell.openExternal(url);
    });

    ipcMain.on('cleanFile', async (event, path) => {
      await deleteFile(path);
    });

    ipcMain.handle('getFileSize', async (event, dirPath) => {
      return await calcFileSize(dirPath);
    });

    ipcMain.on('setHotKey', async (event, params) => {
      await handleHotKey(params);
    });

    ipcMain.handle('getStore', async (event, key) => {
      return await global.store.get(key);
    });

    ipcMain.on('setStore', async (event, key, data) => {
      await global.store.set(key, data);
    });
  });
};

export { initIpcMain };
