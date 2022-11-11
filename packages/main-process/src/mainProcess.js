import { ipcMain, app, dialog, globalShortcut } from 'electron';
import Screenshots from 'electron-screenshots';

const initIpcMain = (mainWindow) => {
  app.whenReady().then(() => {
    ipcMain.on('changeWindow', (event, type) => {
      const actionFnMap = {
        min: () => mainWindow.minimize(),
        max: () =>
          mainWindow.isMaximized()
            ? mainWindow.unmaximize()
            : mainWindow.maximize(),
        full: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()),
        close: () => mainWindow.close(),
      };
      const action = actionFnMap[type];
      action && action();
    });

    async function handleFileOpen() {
      const { canceled, filePaths } = await dialog.showOpenDialog();
      if (!canceled) {
        return false;
      }
      return filePaths[0];
    }

    ipcMain.handle('dialog:openFile', handleFileOpen);

    const screenshots = new Screenshots();

    screenshots.on('ok', (e, buffer, bounds) => {
      const b64 = Buffer.from(buffer).toString('base64');
      mainWindow.webContents.send('result-screenshots', b64);
    });
    screenshots.on('cancel', () => {
      console.log('capture', 'cancel1');
    });
    screenshots.on('save', (e, buffer, bounds) => {
      const b64 = Buffer.from(buffer).toString('base64');
    });

    ipcMain.on('startScreenshots', async () => {
      globalShortcut.register('esc', async () => {
        await screenshots.endCapture();
      });

      await screenshots.startCapture();
    });
  });
};

export { initIpcMain };
