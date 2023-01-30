import { initElectron, initIpcMain } from '@lanshu/main-process';

initElectron().then(() => {
  // console.log(App)
  initIpcMain();
});
