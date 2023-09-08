import {
  initElectron,
  initIpcMain,
  CLIENT_TERMINAL,
} from '@lanshu/main-process';

initElectron({
  terminal: CLIENT_TERMINAL.IS_GOVERNMENT,
  isDevtools: false,
  version: '0.0.1',
  clientName: '北象IM',
}).then(() => {
  initIpcMain();
});
