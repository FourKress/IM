const electronAPI = window?.electronAPI ?? {};

const changeWindow = electronAPI?.changeWindow;
const openFile = electronAPI?.openFile;
const startScreenshots = electronAPI?.startScreenshots;
const showMainWindow = electronAPI?.showMainWindow;
const showLoginWindow = electronAPI?.showLoginWindow;
const openUrl = electronAPI?.openUrl;
const cleanFile = electronAPI?.cleanFile;
const getFileSize = electronAPI?.getFileSize;
const setHotKey = electronAPI?.setHotKey;
const getStore = electronAPI?.getStore;
const setStore = electronAPI?.setStore;
const updateClient = electronAPI?.updateClient;

export {
  changeWindow,
  openFile,
  startScreenshots,
  showMainWindow,
  showLoginWindow,
  openUrl,
  cleanFile,
  getFileSize,
  setHotKey,
  getStore,
  setStore,
  updateClient,
};
