import { globalShortcut, ipcMain } from 'electron';
import Screenshots from 'electron-screenshots';

export const handleStartCapture = async (screenshots) => {
  const mainWindow = global.mainWindow;

  if (mainWindow.isFullScreen()) {
    mainWindow.setFullScreen(false);
  }
  globalShortcut.register('esc', async () => {
    globalShortcut.unregister('esc');
    await screenshots.endCapture();
  });
  await screenshots.startCapture();

  return new Promise((resolve) => {
    screenshots.on('ok', (e, buffer, bounds) => {
      globalShortcut.unregister('esc');
      const b64 = Buffer.from(buffer).toString('base64');
      resolve(b64);
    });
    screenshots.on('cancel', () => {
      globalShortcut.unregister('esc');
      resolve();
    });
    screenshots.on('save', (e, buffer, bounds) => {
      globalShortcut.unregister('esc');
      const b64 = Buffer.from(buffer).toString('base64');
      resolve(b64);
    });
  });
};

export const initScreenshots = () => {
  const screenshots = new Screenshots({
    singleWindow: true,
  });

  global.screenshots = screenshots;

  ipcMain.handle('startScreenshots', () => handleStartCapture(screenshots));
};
