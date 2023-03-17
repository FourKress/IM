import { ipcMain, app, shell, systemPreferences } from 'electron';

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

// 检查并申请设备权限：麦克风、摄像头、屏幕录制
async function checkAndApplyDeviceAccessPrivilege() {
  const cameraPrivilege = systemPreferences.getMediaAccessStatus('camera');
  console.log(
    `checkAndApplyDeviceAccessPrivilege before apply cameraPrivilege: ${cameraPrivilege}`,
  );
  if (cameraPrivilege !== 'granted') {
    await systemPreferences.askForMediaAccess('camera');
  }

  const micPrivilege = systemPreferences.getMediaAccessStatus('microphone');
  console.log(
    `checkAndApplyDeviceAccessPrivilege before apply micPrivilege: ${micPrivilege}`,
  );
  if (micPrivilege !== 'granted') {
    await systemPreferences.askForMediaAccess('microphone');
  }

  const screenPrivilege = systemPreferences.getMediaAccessStatus('screen');
  console.log(
    `checkAndApplyDeviceAccessPrivilege before apply screenPrivilege: ${screenPrivilege}`,
  );
}

const initIpcMain = () => {
  app.whenReady().then(async () => {
    await checkAndApplyDeviceAccessPrivilege();

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
