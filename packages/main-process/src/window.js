import { BrowserWindow } from 'electron';
import path from 'path';

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
  mainWindow.setMinimumSize(1366, 768);
  mainWindow.setResizable(true);
  mainWindow.setMaximizable(true);
  mainWindow.center();
};

const delayShowWindow = (initFn, delay) => {
  const mainWindow = global.mainWindow;
  // mainWindow.setOpacity(0);
  initFn();
  // 在最小化之后修改size会无效，所以要在最小化之前修改大小
  mainWindow.minimize();
  setTimeout(() => {
    // mainWindow.setOpacity(1);
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
    main: global.mainWindow,
    trtc: global.TRTCWindow,
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
    nodeIntegration: true,
    contextIsolation: false,
    preload: process.env.WEBPACK_DEV_SERVER_URL
      ? path.join(process.cwd(), './src/preload.js')
      : path.join(__dirname, 'preload.js'),
  },
  center: true,
};

export const openTRTCWindow = async () => {
  const TRTCWindow = new BrowserWindow({
    ...defaultWindowConfig,
    parent: global.mainWindow,
    width: 640,
    height: 360,
    // minWidth: 360,
    // minHeight: 640,
  });

  const isDevelopment = process.env.NODE_ENV !== 'production';
  const loadURL = isDevelopment
    ? `${process.env.WEBPACK_DEV_SERVER_URL}#/TRTC`
    : 'app://./index.html/#/TRTC';

  if (isDevelopment) {
    // if (!process.env.IS_TEST) TRTCWindow.webContents.openDevTools();
  }
  await TRTCWindow.loadURL(loadURL);

  // const code = `sessionStorage.setItem("authKey", "${token}")`;
  // await TRTCWindow.webContents.executeJavaScript(code).then(async () => {
  //   await TRTCWindow.loadURL(loadURL);
  // });

  global.TRTCWindow = TRTCWindow;

  TRTCWindow.on('ready-to-show', () => {
    TRTCWindow.show();
  });

  TRTCWindow.on('closed', () => {
    console.log('TRTCWindow Close');
    global.TRTCWindow = null;
    global.store.delete('trtcUserInfo');
    global.store.delete('trtcMsg');
    global.store.delete('trtcSession');
  });
};
