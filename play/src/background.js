import { initElectron, initIpcMain } from '@lanshu/main-process';

initElectron({
  terminal: 'government',
  isDevtools: true,
  version: 'NEVER',
}).then(() => {
  initIpcMain();
});
