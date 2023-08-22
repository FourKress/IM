import { app, BrowserWindow } from 'electron';
import path from 'path';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { IS_MAC, CLIENT_TYPE, WINDOW_TYPE, IS_DEVELOPMENT } from './utils';
import checkDevices from './checkDevices';
import { getScreenInfo } from './screen';
import { electronLog } from './log';
import { shieldHotKeys } from './hotKey';
import trayEvent from './trayEvent';

const initLoginWindow = () => {
  const mainWindow = global.mainWindow;
  mainWindow.setMinimumSize(360, 490);
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    global.store.set('IS_MAX', true);
  }
  mainWindow.setSize(360, 490);
  mainWindow.setResizable(false);
  mainWindow.setMaximizable(false);
  mainWindow.center();
};

const initMainWindow = () => {
  let renderWidth, renderHeight;
  const screenHistory = global.store.get('SCREEN_HISTORY');
  const isMax = global.store.get('IS_MAX');
  if (screenHistory) {
    const { width, height } = screenHistory;
    renderWidth = width;
    renderHeight = height;
  } else {
    const { width, height } = getScreenInfo();
    renderWidth = width;
    renderHeight = height;
  }
  electronLog.info(`screenInfo ${renderWidth} ${renderHeight}`);
  const mainWindow = global.mainWindow;
  mainWindow.setSize(renderWidth, renderHeight);
  mainWindow.setResizable(true);
  mainWindow.setMaximizable(true);
  mainWindow.setMinimumSize(1024, 640);
  mainWindow.center();
  if (isMax) {
    setTimeout(() => {
      mainWindow.maximize();
    }, 10);
  }
};

const delayShowWindow = (initFn, delay) => {
  const mainWindow = global.mainWindow;
  if (!IS_MAC) {
    mainWindow.setOpacity(0);
  }
  initFn();
  // 在最小化之后修改size会无效，所以要在最小化之前修改大小
  mainWindow.minimize();
  setTimeout(() => {
    if (!IS_MAC) {
      mainWindow.setOpacity(1);
    }
    mainWindow.show();
    mainWindow.focus();
  }, delay);
};

export const showMainWindow = () => {
  delayShowWindow(initMainWindow, 1000);
};

export const showLoginWindow = (delay) => {
  if (delay) {
    delayShowWindow(initLoginWindow, delay);
  } else {
    initLoginWindow();
  }
};

export const changeWindow = (type, win) => {
  const windowMap = {
    [WINDOW_TYPE.IS_MAIN]: global.mainWindow,
    [WINDOW_TYPE.IS_TRTC]: global.TRTCWindow,
  };
  const targetWindow = windowMap[win];
  const actionFnMap = {
    min: () => targetWindow.minimize(),
    max: () =>
      targetWindow.isMaximized()
        ? targetWindow.unmaximize()
        : targetWindow.maximize(),
    full: () => targetWindow.setFullScreen(!targetWindow.isFullScreen()),
    close: () => {
      if (win === WINDOW_TYPE.IS_TRTC) {
        global.store.set('TRTC_CAN_BE_CLOSED', true);
        targetWindow.close();
        return;
      }
      if (win === WINDOW_TYPE.IS_MAIN) {
        global.store.set('WIN_CAN_BE_CLOSED', true);
        app.quit();
        return;
      }
    },
    hide: () => targetWindow.hide(),
    show: () => targetWindow.show(),
  };
  const action = actionFnMap[type];
  action && action();
};

export const defaultWindowConfig = () => {
  return {
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      // TODO 暂时关闭
      // devTools: global.store.get('IS_DEVTOOLS'),
      devTools: true,
      webviewTag: true,
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
      preload: process.env.WEBPACK_DEV_SERVER_URL
        ? path.join(process.cwd(), './src/preload.js')
        : path.join(__dirname, 'preload.js'),
    },
    center: true,
    icon: './icons/icon.ico',
  };
};

const handleMaximize = (status) => {
  mainWindow.webContents.send('maximizeStatus', status);
  global.store.set('IS_MAX', status);
};

export const createMainWindow = async () => {
  const win = new BrowserWindow({
    ...defaultWindowConfig(),
    width: 360,
    height: 490,
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
    const autoLogin = global.store.get('AUTO_LOGIN') || {};
    const { status = false, token = '' } = autoLogin;
    if (!status || !token) {
      win.show();
    }
  });

  win.webContents.on('did-attach-webview', (event, webContents) => {
    webContents.setWindowOpenHandler((details) => {
      if (!details.url) return;
      mainWindow.webContents.send('webviewOpenUrl', details.url);
      return { action: 'deny' };
    });
  });

  win.on('maximize', () => {
    handleMaximize(true);
  });
  win.on('unmaximize', () => {
    handleMaximize(false);
  });
  win.on('resized', () => {
    const [width, height] = win.getSize();
    global.store.set('SCREEN_HISTORY', {
      width,
      height,
    });
  });
  // 屏蔽浏览器快捷键
  shieldHotKeys(win);
};

export const openTRTCWindow = async (type = CLIENT_TYPE.IS_PC) => {
  await checkDevices();

  const configMap = {
    [CLIENT_TYPE.IS_PC]: {
      size: {
        width: 640,
        height: 360,
        minWidth: 640,
        minHeight: 360,
      },
      ratio: 16 / 9,
    },
    [CLIENT_TYPE.IS_MOBILE]: {
      size: {
        width: 360,
        height: 640,
        minWidth: 368,
        minHeight: 640,
      },
      ratio: 360 / 640,
    },
  };
  const targetClient = configMap[type];

  let TRTCWindow = new BrowserWindow({
    ...defaultWindowConfig(),
    ...targetClient.size,
    alwaysOnTop: true,
  });

  TRTCWindow.setAspectRatio(targetClient.ratio);

  const loadURL = IS_DEVELOPMENT
    ? `${process.env.WEBPACK_DEV_SERVER_URL}#/TRTC`
    : 'app://./index.html/#/TRTC';

  if (global.store.get('IS_DEVTOOLS')) {
    TRTCWindow.webContents.openDevTools();
  }
  await TRTCWindow.loadURL(loadURL);

  global.TRTCWindow = TRTCWindow;

  TRTCWindow.hookWindowMessage(278, () => {
    TRTCWindow.setEnabled(false);
    setTimeout(() => {
      TRTCWindow.setEnabled(true);
    }, 100);
    return true;
  });

  TRTCWindow.on('ready-to-show', () => {
    TRTCWindow.show();
  });

  TRTCWindow.on('close', (event) => {
    const trtcCanBeClosed = global.store.get('TRTC_CAN_BE_CLOSED');
    if (!trtcCanBeClosed) {
      event.preventDefault();
      return;
    }
  });

  TRTCWindow.on('closed', () => {
    electronLog.info('TRTCWindow Close');
    TRTCWindow = null;
    global.TRTCWindow = null;
    global.store.set('TRTC_SESSION', null);
    global.store.set('TRTC_CAN_BE_CLOSED', false);
  });

  // 屏蔽浏览器快捷键
  shieldHotKeys(TRTCWindow);
};
