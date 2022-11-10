const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  changeWindow: (type) => ipcRenderer.send('changeWindow', type),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  startScreenshots: () => ipcRenderer.send('startScreenshots'),
  getScreenshots: (callback) => ipcRenderer.on('result-screenshots', callback),
});
