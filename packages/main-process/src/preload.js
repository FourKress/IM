const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  startScreenshots: () => ipcRenderer.send('startScreenshots'),
  getScreenshots: (callback) => ipcRenderer.on('result-screenshots', callback),
});
