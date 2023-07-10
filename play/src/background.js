import { initElectron, initIpcMain } from '@lanshu/main-process';

initElectron({
  terminal: 'government',
  isDevtools: false,
  version: '0.4.10',
}).then(() => {
  initIpcMain();
});
