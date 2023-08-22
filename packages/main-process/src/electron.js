import { app, protocol, BrowserWindow } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

import { createMainWindow } from './window';
import store from './datastore';
import trayEvent from './trayEvent';
import { electronLog } from './log';
import { IS_DEVELOPMENT } from './utils';

global.store = store;

const initElectron = (config) => {
  const {
    terminal,
    isDevtools = false,
    version = '0.0.1',
    windowsSize = '',
  } = config;

  const autoLogin = global.store.get('AUTO_LOGIN') || {};
  const { status = false, token = '', expirationTime = 0 } = autoLogin;
  const nowTimer = Date.now();
  if (status && token) {
    const isExpiration = nowTimer - expirationTime > 7 * 24 * 60 * 60 * 1000;
    if (isExpiration) {
      global.store.set('AUTO_LOGIN', {
        status: true,
        token: '',
        expirationTime: 0,
      });
    }
  }

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
        if (BrowserWindow.getAllWindows().length === 0)
          await createMainWindow();
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
        await createMainWindow();

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
