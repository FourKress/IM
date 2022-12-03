const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  changeWindow: (type) => ipcRenderer.send('changeWindow', type),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  startScreenshots: () => ipcRenderer.invoke('startScreenshots'),
});
