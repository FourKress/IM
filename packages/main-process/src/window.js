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
  delayShowWindow(initMainWindow, 200);
};

export const showLoginWindow = (delay) => {
  if (delay) {
    delayShowWindow(initLoginWindow, delay);
  } else {
    initLoginWindow();
  }
};

export const changeWindow = (type) => {
  const mainWindow = global.mainWindow;
  const actionFnMap = {
    min: () => mainWindow.minimize(),
    max: () =>
      mainWindow.isMaximized()
        ? mainWindow.unmaximize()
        : mainWindow.maximize(),
    full: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()),
    close: () => mainWindow.close(),
  };
  const action = actionFnMap[type];
  action && action();
};
