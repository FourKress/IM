import { globalShortcut, ipcMain } from 'electron';
import Screenshots from 'electron-screenshots';

export const initScreenshots = (mainWindow) => {
  const screenshots = new Screenshots({
    singleWindow: true,
  });

  globalShortcut.register('ctrl+shift+a', async () => {
    await handleStartCapture();
  });

  async function handleStartCapture() {
    if (mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    }
    globalShortcut.register('esc', async () => {
      await screenshots.endCapture();
    });
    await screenshots.startCapture();

    return new Promise((resolve) => {
      screenshots.on('ok', (e, buffer, bounds) => {
        const b64 = Buffer.from(buffer).toString('base64');
        resolve(b64);
      });
      screenshots.on('cancel', () => {
        console.log('capture', 'cancel1');
        resolve();
      });
      screenshots.on('save', (e, buffer, bounds) => {
        const b64 = Buffer.from(buffer).toString('base64');
        resolve(b64);
      });
    });
  }

  ipcMain.handle('startScreenshots', handleStartCapture);
};
