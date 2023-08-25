import { initElectron, initIpcMain } from '@lanshu/main-process';

initElectron({
  terminal: 'government',
  isDevtools: false,
  version: '0.0.1',
}).then(() => {
  initIpcMain();
});
