import { initElectron, initIpcMain } from '@lanshu/main-process';

initElectron('government').then(() => {
  initIpcMain();
});
