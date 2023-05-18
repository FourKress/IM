import { BrowserWindow } from 'electron';
import path from 'path';
import { IS_MAC, CLIENT_TYPE, WINDOW_TYPE } from './utils';
import checkDevices from './checkDevices';

const initLoginWindow = () => {
  const mainWindow = global.mainWindow;
  mainWindow.setSize(1440, 1080);
  mainWindow.setMinimumSize(1440, 1080);
  mainWindow.setResizable(false);
  mainWindow.setMaximizable(false);
  mainWindow.center();
};

const initMainWindow = () => {
  const mainWindow = global.mainWindow;
  mainWindow.setSize(1920, 1080);
  mainWindow.setResizable(true);
  mainWindow.setMaximizable(true);
  mainWindow.center();
};

const delayShowWindow = (initFn, delay) => {
  const mainWindow = global.mainWindow;
  if (IS_MAC) {
    mainWindow.setOpacity(0);
  }
  initFn();
  // 在最小化之后修改size会无效，所以要在最小化之前修改大小
  mainWindow.minimize();
  setTimeout(() => {
    if (IS_MAC) {
      mainWindow.setOpacity(1);
    }
    mainWindow.show();
    mainWindow.focus();
  }, delay);
};

export const showMainWindow = () => {
  delayShowWindow(initMainWindow, 500);
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
    close: () => targetWindow.close(),
  };
  const action = actionFnMap[type];
  action && action();
};

export const defaultWindowConfig = {
  transparent: true,
  frame: false,
  hasShadow: false,
  autoHideMenuBar: true,
  webPreferences: {
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
        width: 368,
        height: 640,
        minWidth: 368,
        minHeight: 640,
      },
      ratio: 368 / 640,
    },
  };
  const targetClient = configMap[type];
  console.log(configMap, type, targetClient);
  let TRTCWindow = new BrowserWindow({
    ...defaultWindowConfig,
    ...targetClient.size,
    alwaysOnTop: true,
  });

  TRTCWindow.setAspectRatio(targetClient.ratio);

  const isDevelopment = process.env.NODE_ENV !== 'production';
  const loadURL = isDevelopment
    ? `${process.env.WEBPACK_DEV_SERVER_URL}#/TRTC`
    : 'app://./index.html/#/TRTC';

  if (isDevelopment) {
    if (!process.env.IS_TEST) TRTCWindow.webContents.openDevTools();
  }
  await TRTCWindow.loadURL(loadURL);
  // TODO 临时打开
  TRTCWindow.webContents.openDevTools();

  // const code = `sessionStorage.setItem("authKey", "${token}")`;
  // await TRTCWindow.webContents.executeJavaScript(code).then(async () => {
  //   await TRTCWindow.loadURL(loadURL);
  // });

  global.TRTCWindow = TRTCWindow;

  TRTCWindow.on('ready-to-show', () => {
    TRTCWindow.show();
  });

  TRTCWindow.on('close', (event) => {
    const trtcCanBeClosed = global.store.get('TRTC_CAN_BE_CLOSED');
    if (!trtcCanBeClosed) {
      event.preventDefault();
      TRTCWindow.webContents.send('mainProcessError', '请先结束当前通话');
      return;
    }
  });

  TRTCWindow.on('closed', () => {
    console.log('TRTCWindow Close');
    TRTCWindow = null;
    global.TRTCWindow = null;
    global.store.delete('TRTC_SESSION');
    global.store.delete('TRTC_CAN_BE_CLOSED');
  });
};
