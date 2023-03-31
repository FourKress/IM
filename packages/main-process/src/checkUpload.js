import { autoUpdater } from 'electron-updater';
import { ipcMain } from 'electron';
import electronLog from 'electron-log';

const checkUpdate = async () => {
  // 设置日志打印
  autoUpdater.logger = electronLog;
  autoUpdater.logger.transports.file.level = 'info';

  autoUpdater.setFeedURL('http://192.168.88.253:7654');

  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.autoDownload = false;
  autoUpdater.allowDowngrade = true;

  // 检测更新
  await autoUpdater.checkForUpdates();

  // 监听error事件
  autoUpdater.on('error', (err) => {
    console.log(err);
  });

  // 监听update-available事件，发现有新版本时触发
  autoUpdater.on('update-available', () => {
    console.log('found new version');
  });

  // 当没有可用更新的时候触发。
  autoUpdater.on('update-not-available', () => {
    console.log('update-not-available');
  });

  // 默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false

  // 监听update-downloaded事件，新版本下载完成时触发
  autoUpdater.on('update-downloaded', () => {
    global.mainWindow.webContents.send('updateClient', 'updateClient');
  });

  ipcMain.on('startUpdate', (_event, value) => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.on('checkForUpdates', async (_event, value) => {
    await autoUpdater.checkForUpdates();
  });
};

export default checkUpdate;
