const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  changeWindow: (type) => ipcRenderer.send('changeWindow', type),
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
});
