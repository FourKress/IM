import { initElectron, initIpcMain } from '@lanshu/main-process';

initElectron({
  terminal: 'government',
  isDevtools: true,
  version: '0.4.5',
}).then(() => {
  initIpcMain();
});
