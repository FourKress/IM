import { initElectron, initIpcMain } from '@lanshu/main-process';

initElectron({
  terminal: 'government',
  isDevtools: true,
  version: 'NEVER',
  windowsSize: {
    width: 1600,
    height: 900,
  },
}).then(() => {
  initIpcMain();
});
