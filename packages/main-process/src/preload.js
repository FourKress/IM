const { ipcRenderer } = require('electron');

window.electronAPI = {
  changeWindow: (type, win) => ipcRenderer.send('changeWindow', type, win),
  openFileDialog: (type) => ipcRenderer.invoke('openFileDialog', type),
  saveFileDialog: (fileName) => ipcRenderer.invoke('saveFileDialog', fileName),
  startScreenshots: () => ipcRenderer.invoke('startScreenshots'),
  showMainWindow: (config) => ipcRenderer.send('showMainWindow', config),
  showLoginWindow: (delay) => ipcRenderer.send('showLoginWindow', delay),
  openUrl: (url) => ipcRenderer.send('openUrl', url),
  cleanFile: (path) => ipcRenderer.send('cleanFile', path),
  getFileSize: (path) => ipcRenderer.invoke('getFileSize', path),
  setHotKey: (params) => ipcRenderer.send('setHotKey', params),
  setStore: (key, data) => ipcRenderer.send('setStore', key, data),
  getStore: (key) => ipcRenderer.invoke('getStore', key),
  IMSDK_INIT: (appId) => ipcRenderer.send('IMSDK_INIT', appId),
  IMSDKIPC: (provider, event, ...data) =>
    ipcRenderer.invoke('IMSDKIPC', provider, event, data),
  IMSDKNetworkCall: (event, ...data) =>
    ipcRenderer.invoke('IMSDKNetworkCall', event, data),
  IMSDKNetworkCallRefresh: (data) =>
    ipcRenderer.send('IMSDKNetworkCallRefresh', data),
  IMSDKListener: (callback) => ipcRenderer.on('IMSDKListener', callback),
  openTRTCWindow: (type) => ipcRenderer.send('openTRTCWindow', type),
  TRTCListener: (callback) => ipcRenderer.on('TRTCListener', callback),
  hasWindow: (win) => ipcRenderer.invoke('hasWindow', win),
  mainProcessError: (callback) => ipcRenderer.on('mainProcessError', callback),
  downloadProgress: (callback) => ipcRenderer.on('downloadProgress', callback),
  setAutoStart: (key, data) => ipcRenderer.send('setAutoStart', key, data),
  checkForUpdates: (config) => ipcRenderer.send('checkForUpdates', config),
  activeSearch: (callback) => ipcRenderer.on('activeSearch', callback),
  getCacheFilePath: (fileName) =>
    ipcRenderer.invoke('getCacheFilePath', fileName),
  getCacheFile2Base64: (fileName) =>
    ipcRenderer.invoke('getCacheFile2Base64', fileName),
  saveCacheFile: (key, data) => ipcRenderer.send('saveCacheFile', key, data),
  getCacheDirInfo: () => ipcRenderer.invoke('getCacheDirInfo'),
  setCacheDir: (key, data) => ipcRenderer.send('setCacheDir', key, data),
  showItemInFolder: (key, data) =>
    ipcRenderer.send('showItemInFolder', key, data),
  previewAssets: (key, data) => ipcRenderer.send('previewAssets', key, data),
  getFocusedWindow: (win) => ipcRenderer.invoke('getFocusedWindow', win),
  webviewOpenUrl: (url) => ipcRenderer.on('webviewOpenUrl', url),
  copyFile: (sourcePath, targetPath) =>
    ipcRenderer.invoke('copyFile', sourcePath, targetPath),
};
