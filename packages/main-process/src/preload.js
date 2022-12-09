const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  changeWindow: (type) => ipcRenderer.send('changeWindow', type),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  startScreenshots: () => ipcRenderer.invoke('startScreenshots'),
  showMainWindow: () => ipcRenderer.send('showMainWindow'),
  showLoginWindow: (delay) => ipcRenderer.send('showLoginWindow', delay),
});
