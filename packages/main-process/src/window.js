import { BrowserWindow } from 'electron';
import path from 'path';
import { IS_MAC, CLIENT_TYPE, WINDOW_TYPE, IS_DEVELOPMENT } from './utils';
import checkDevices from './checkDevices';
import { getScreenInfo } from './screen';
import { electronLog } from './log';
import { shieldHotKeys } from './hotKey';

const initLoginWindow = () => {
  const mainWindow = global.mainWindow;
  mainWindow.setMinimumSize(440, 600);
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  }
  mainWindow.setSize(440, 600);
  mainWindow.setResizable(false);
  mainWindow.setMaximizable(false);
  mainWindow.center();
};

const initMainWindow = () => {
  const { width, height } = getScreenInfo();
  electronLog.info(`screenInfo ${width} ${height}`);
  const mainWindow = global.mainWindow;
  mainWindow.setSize(width, height);
  mainWindow.setResizable(true);
  mainWindow.setMaximizable(true);
  mainWindow.setMinimumSize(1024, 640);
  mainWindow.center();
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
    close: () =>
      type === WINDOW_TYPE.IS_MAIN ? targetWindow.hide() : targetWindow.close(),
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
