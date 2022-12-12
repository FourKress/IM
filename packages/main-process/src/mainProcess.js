import { ipcMain, app, shell } from 'electron';

import { handleFileOpen } from './utils';
import { initScreenshots } from './screenshots';
import { showLoginWindow, showMainWindow, changeWindow } from './window';

const initIpcMain = (mainWindow) => {
  app.whenReady().then(() => {
    ipcMain.on('changeWindow', (event, type) => {
      changeWindow(mainWindow, type);
    });

    ipcMain.handle('dialog:openFile', handleFileOpen);

    // 添加截图功能
    initScreenshots(mainWindow);

    ipcMain.on('showMainWindow', () => {
      showMainWindow(mainWindow);
    });

    ipcMain.on('showLoginWindow', (event, delay) => {
      showLoginWindow(mainWindow, delay);
    });

    ipcMain.on('openUrl', async (event, url) => {
      await shell.openExternal(url);
    });
  });
};

export { initIpcMain };
