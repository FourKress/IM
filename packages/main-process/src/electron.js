import { app, protocol, BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import * as path from 'path';
import { defaultWindowConfig } from './window';
import store from './datastore';
import checkUpload from './checkUpload';
import { IMSDKInit } from './IM-SDK';
import trayAction from './trayEvent';

global.store = store;

const isDevelopment = process.env.NODE_ENV !== 'production';

console.log(
  'process.env.WEBPACK_DEV_SERVER_URL',
  process.env.WEBPACK_DEV_SERVER_URL,
);

async function createWindow() {
  const win = new BrowserWindow({
    ...defaultWindowConfig,
    icon: './icons/icon.ico',
    width: 1440,
    height: 1080,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    await win.loadURL('app://./index.html');
  }

  global.mainWindow = win;

  win.on('closed', () => {
    global.mainWindow = null;
  });

  win.on('ready-to-show', () => {
    win.show();
    // 每次启动程序，就检查更新
    checkUpload();
  });
}

const initElectron = (appId) => {
  return new Promise((resolve, reject) => {
    try {
      protocol.registerSchemesAsPrivileged([
        { scheme: 'app', privileges: { secure: true, standard: true } },
      ]);

      // if (process.platform === 'darwin') {
      //   app.dock.setIcon(path.join(__dirname, '../icons/icon_512x512.png'));
      // }

      const gotTheLock = app.requestSingleInstanceLock();
      if (!gotTheLock) {
        app.quit();
      } else {
        app.on('second-instance', (event, argv) => {
          // 当运行第二个实例时,将会聚焦到myWindow这个窗口
          if (global.mainWindow) {
            global.mainWindow.show();
            if (global.mainWindow.isMinimized()) {
              global.mainWindow.restore();
            }
            global.mainWindow.focus();
          }
        });
      }

      app.on('window-all-closed', () => {
        app.quit();
      });

      app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) await createWindow();
      });

      app.on('ready', async () => {
        if (isDevelopment && !process.env.IS_TEST) {
          try {
            await installExtension(VUEJS_DEVTOOLS);
          } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
          }
        }

        trayAction();

        await createWindow();

        IMSDKInit(appId);

        resolve({
          App: app,
          BrowserWindow: global.mainWindow,
        });
      });

      if (isDevelopment) {
        if (process.platform === 'win32') {
          process.on('message', (data) => {
            if (data === 'graceful-exit') {
              app.quit();
            }
          });
        } else {
          process.on('SIGTERM', () => {
            app.quit();
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

export { initElectron };
