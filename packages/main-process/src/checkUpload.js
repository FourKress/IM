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

  // 监听error事件
  autoUpdater.on('error', (err) => {
    console.log(err);
    electronLog.info('更新时error');
    electronLog.info(err);
    global.mainWindow.webContents.send('mainProcessError', err);
  });

  // 监听update-available事件，发现有新版本时触发
  autoUpdater.on('update-available', () => {
    autoUpdater.downloadUpdate();
  });

  // 当没有可用更新的时候触发。
  autoUpdater.on('update-not-available', () => {
    electronLog.info('当前没有可用更新');
    global.mainWindow.webContents.send('mainProcessError', '当前没有可用更新');
  });

  autoUpdater.on('download-progress', (res) => {
    electronLog.info(res);
    global.mainWindow.webContents.send('downloadProgress', res);
  });

  // 监听update-downloaded事件，新版本下载完成时触发
  autoUpdater.on('update-downloaded', () => {
    electronLog.info('新版本下载完成，安装更新');
    autoUpdater.quitAndInstall();
  });

  // 触发检查更新并且下载
  ipcMain.on('checkForUpdates', async (_event) => {
    console.log('检查更新');
    electronLog.info('检查更新');
    await autoUpdater.checkForUpdates();
  });
};

export default checkUpdate;
