const electronAPI = window?.electronAPI ?? {};

const changeWindow = electronAPI?.changeWindow;
const openFile = electronAPI?.openFile;
const startScreenshots = electronAPI?.startScreenshots;
const showMainWindow = electronAPI?.showMainWindow;
const showLoginWindow = electronAPI?.showLoginWindow;

export {
  changeWindow,
  openFile,
  startScreenshots,
  showMainWindow,
  showLoginWindow,
};
