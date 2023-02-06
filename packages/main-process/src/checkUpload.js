import { autoUpdater } from 'electron-updater';
import { ipcMain } from 'electron';

const checkUpdate = async () => {
  autoUpdater.setFeedURL('http://192.168.88.115:7777/');

  autoUpdater.autoInstallOnAppQuit = false;

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
};

export default checkUpdate;
