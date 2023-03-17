// const { contextBridge, ipcRenderer } = require('electron');
//
// contextBridge.exposeInMainWorld('electronAPI', {
//   changeWindow: (type) => ipcRenderer.send('changeWindow', type),
//   openFile: (type) => ipcRenderer.invoke('openFile', type),
//   startScreenshots: () => ipcRenderer.invoke('startScreenshots'),
//   showMainWindow: (config) => ipcRenderer.send('showMainWindow', config),
//   showLoginWindow: (delay) => ipcRenderer.send('showLoginWindow', delay),
//   openUrl: (url) => ipcRenderer.send('openUrl', url),
//   cleanFile: (path) => ipcRenderer.send('cleanFile', path),
//   getFileSize: (path) => ipcRenderer.invoke('getFileSize', path),
//   setHotKey: (params) => ipcRenderer.send('setHotKey', params),
//   setStore: (key, data) => ipcRenderer.send('setStore', key, data),
//   getStore: (key) => ipcRenderer.invoke('getStore', key),
//   updateClient: (callback) => ipcRenderer.on('updateClient', callback),
//   IMSDKIPC: (provider, event, ...data) =>
//     ipcRenderer.invoke('IMSDKIPC', provider, event, data),
//   IMSDKListener: (callback) => ipcRenderer.on('IMSDKListener', callback),
// });

const { ipcRenderer } = require('electron');

window.electronAPI = {
  changeWindow: (type, win) => ipcRenderer.send('changeWindow', type, win),
  openFile: (type) => ipcRenderer.invoke('openFile', type),
  startScreenshots: () => ipcRenderer.invoke('startScreenshots'),
  showMainWindow: (config) => ipcRenderer.send('showMainWindow', config),
  showLoginWindow: (delay) => ipcRenderer.send('showLoginWindow', delay),
  openUrl: (url) => ipcRenderer.send('openUrl', url),
  cleanFile: (path) => ipcRenderer.send('cleanFile', path),
  getFileSize: (path) => ipcRenderer.invoke('getFileSize', path),
  setHotKey: (params) => ipcRenderer.send('setHotKey', params),
  setStore: (key, data) => ipcRenderer.send('setStore', key, data),
  getStore: (key) => ipcRenderer.invoke('getStore', key),
  updateClient: (callback) => ipcRenderer.on('updateClient', callback),
  IMSDKIPC: (provider, event, ...data) =>
    ipcRenderer.invoke('IMSDKIPC', provider, event, data),
  IMSDKListener: (callback) => ipcRenderer.on('IMSDKListener', callback),
  openTRTCWindow: () => ipcRenderer.send('openTRTCWindow'),
  TRTCListener: (callback) => ipcRenderer.on('TRTCListener', callback),
};
