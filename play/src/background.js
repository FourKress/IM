import { initElectron, initIpcMain } from '@lanshu/main-process';

initElectron({
  terminal: 'government',
  isDevtools: true,
  version: '0.3.19',
}).then(() => {
  initIpcMain();
});
