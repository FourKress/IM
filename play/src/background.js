import { initElectron, initIpcMain } from '@lanshu/main-process';

initElectron({
  terminal: 'government',
  isDevtools: false,
  version: 'NEVER',
}).then(() => {
  initIpcMain();
});
