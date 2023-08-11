import { app, protocol, BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

import { defaultWindowConfig } from './window';
import store from './datastore';
import trayEvent from './trayEvent';
import { electronLog } from './log';
import { shieldHotKeys } from './hotKey';
import { IS_DEVELOPMENT } from './utils';

global.store = store;

async function createWindow() {
  const win = new BrowserWindow({
    ...defaultWindowConfig(),
    width: 440,
    height: 600,
    show: false,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
  } else {
    createProtocol('app');
    await win.loadURL('app://./index.html');
  }

  if (global.store.get('IS_DEVTOOLS')) {
    win.webContents.openDevTools();
  }

  global.mainWindow = win;

  let hookTimer = 0;
  win.hookWindowMessage(278, () => {
    win.setEnabled(false);
    // 禁止头部右键点击
    hookTimer && clearTimeout(hookTimer);
    hookTimer = setTimeout(() => {
      win.setEnabled(true);
    }, 100);
    return true;
  });

  win.on('close', (event) => {
    const winCanBeClosed = global.store.get('WIN_CAN_BE_CLOSED');
    if (!winCanBeClosed) {
      win.hide();
      event.preventDefault();
      return;
    } else {
      const hasGlobalWindow = global.TRTCWindow;
      if (!!hasGlobalWindow) {
        global.store.set('WIN_CAN_BE_CLOSED', false);
        event.preventDefault();
        const errorMsg = {
          msg: '请先结束当前通话',
          type: 'MESSAGE',
        };
        win.webContents.send('mainProcessError', errorMsg);
        global.TRTCWindow.webContents.send('mainProcessError', errorMsg);
        return;
      }
    }
  });

  win.on('closed', () => {
    global.mainWindow = null;
    global.store.set('WIN_CAN_BE_CLOSED', false);
  });

  win.on('focus', () => {
    trayEvent.clearFlash();
  });

  win.on('ready-to-show', () => {
    win.show();
  });

  win.webContents.on('did-attach-webview', (event, webContents) => {
    webContents.setWindowOpenHandler((details) => {
      if (!details.url) return;
      mainWindow.webContents.send('webviewOpenUrl', details.url);
      return { action: 'deny' };
    });
  });

  // 屏蔽浏览器快捷键
  shieldHotKeys(win);
}

const initElectron = (config) => {
  const {
    terminal,
    isDevtools = false,
    version = '0.0.1',
    windowsSize = '',
  } = config;

  global.store.set('DEFAULT_WINDOWS_SIZE', windowsSize);
  global.store.set('IS_DEVTOOLS', IS_DEVELOPMENT || isDevtools);
  global.store.set('CLIENT_TERMINAL', terminal);
  global.store.set('TRTC_CAN_BE_CLOSED', false);
  global.store.set('WIN_CAN_BE_CLOSED', false);
  electronLog.info(`VERSION: ${global.store.get('VERSION')}`);

  if (global.store.get('UPDATE_NOTIFY') === undefined) {
    global.store.set('UPDATE_NOTIFY', true);
  }

  if (!global.store.get('VERSION')) {
    global.store.set('VERSION', version);
  }

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
        if (IS_DEVELOPMENT) {
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

      if (IS_DEVELOPMENT) {
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
