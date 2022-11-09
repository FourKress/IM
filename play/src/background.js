import { initElectron, initIpcMain } from '@lanshu/main-process';

initElectron().then(({ BrowserWindow }) => {
  // console.log(App)
  initIpcMain(BrowserWindow);
});
