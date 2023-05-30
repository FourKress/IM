import { app, protocol, BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

import { defaultWindowConfig } from './window';
import store from './datastore';
import trayEvent from './trayEvent';

global.store = store;

const isDevelopment = process.env.NODE_ENV !== 'production';

console.log(
  'process.env.WEBPACK_DEV_SERVER_URL',
  process.env.WEBPACK_DEV_SERVER_URL,
);

async function createWindow() {
  const win = new BrowserWindow({
    ...defaultWindowConfig,
    width: 440,
    height: 600,
    show: false,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    await win.loadURL('app://./index.html');
  }
  // TODO 临时打开
  win.webContents.openDevTools();

  global.mainWindow = win;

  win.hookWindowMessage(278, () => {
    win.setEnabled(false);
    setTimeout(() => {
      win.setEnabled(true);
    }, 100);
    return true;
  });

  win.on('close', (event) => {
    const hasGlobalWindow = global.TRTCWindow;
    if (!!hasGlobalWindow) {
      event.preventDefault();
      win.webContents.send('mainProcessError', '请先结束当前通话');
      return;
    }
  });

  win.on('closed', () => {
    global.mainWindow = null;
  });

  win.on('ready-to-show', () => {
    win.show();
    // 每次启动程序，就检查更新
    // checkUpload();
  });
}

const initElectron = (terminal) => {
  global.store.set('CLIENT_TERMINAL', terminal);
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

        //设置托盘
        trayEvent.setTray();

        // 创建窗口
        await createWindow();

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
