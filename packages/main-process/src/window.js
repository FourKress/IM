const initLoginWindow = (windowObj) => {
  windowObj.setSize(1440, 1080);
  windowObj.setMinimumSize(1440, 1080);
  windowObj.setResizable(false);
  windowObj.setMaximizable(false);
  windowObj.center();
};

const initMainWindow = (windowObj) => {
  windowObj.setSize(1920, 1080);
  windowObj.setMinimumSize(1366, 768);
  windowObj.setResizable(true);
  windowObj.setMaximizable(true);
  windowObj.center();
};

const delayShowWindow = (mainWindow, initFn, delay) => {
  mainWindow.setOpacity(0);
  initFn(mainWindow);
  // 在最小化之后修改size会无效，所以要在最小化之前修改大小
  mainWindow.minimize();
  setTimeout(() => {
    mainWindow.setOpacity(1);
    mainWindow.show();
    mainWindow.focus();
  }, delay);
};

export const showMainWindow = (mainWindow) => {
  delayShowWindow(mainWindow, initMainWindow, 200);
};

export const showLoginWindow = (mainWindow, delay) => {
  if (delay) {
    delayShowWindow(mainWindow, initLoginWindow, delay);
  } else {
    initLoginWindow(mainWindow);
  }
};

export const changeWindow = (mainWindow, type) => {
  const actionFnMap = {
    min: () => mainWindow.minimize(),
    max: () =>
      mainWindow.isMaximized()
        ? mainWindow.unmaximize()
        : mainWindow.maximize(),
    full: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()),
    close: () => mainWindow.close(),
  };
  console.log(type);
  const action = actionFnMap[type];
  action && action();
};
