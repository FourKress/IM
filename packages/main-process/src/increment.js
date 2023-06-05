import downloadFile from './downloadFile';
import electronLog from './log';
import sudoPrompt from './sudoPrompt';
import { app } from 'electron';
const fse = require('fs-extra');
const path = require('path');
const AdmZip = require('adm-zip');
// const exec = require('child_process').exec;

let exeProgress = 0;
let zipProgress = 0;

export default async (data) => {
  const resourcesPath = process.resourcesPath;
  const userDataPath = app.getPath('userData');
  const { upDateExe, upDateUrl, version } = data;

  electronLog.info(data);
  electronLog.info(resourcesPath);
  electronLog.info(userDataPath);

  if (!fse.pathExistsSync(path.join(userDataPath, './update.exe'))) {
    electronLog.info('下载exe');
    await downloadFile(
      {
        url: upDateExe,
        targetPath: userDataPath,
      },
      (result) => {
        exeProgress = Math.ceil(Number(result) / 2);
        global.mainWindow.webContents.send('downloadProgress', exeProgress);
      },
    ).catch((err) => {
      console.log(err);
      electronLog.info(err);
      global.mainWindow.webContents.send('downloadProgress', null);
      return;
    });
  }
  // 提权的方案，这里简写了，正式项目请自行选择位置放update.exe
  const downloads = app.getPath('downloads');
  electronLog.info('下载zip');
  downloadFile({ url: upDateUrl, targetPath: downloads }, (result) => {
    zipProgress = Math.ceil(exeProgress ? Number(result) / 2 : Number(result));
    global.mainWindow.webContents.send(
      'downloadProgress',
      exeProgress + zipProgress,
    );
  })
    .then(async (filePath) => {
      electronLog.info(filePath);
      const zip = new AdmZip(filePath);
      zip.extractAllToAsync(downloads, true, (err) => {
        if (err) {
          console.error(err);
          return;
        }

        global.mainWindow.webContents.send('downloadProgress', 100);

        fse.removeSync(filePath);
        // 临时提权运行exe，exe中关闭主进程，替换安装c盘中的asar（提权是为了处理c盘，如果安装其他盘，可以直接用node.exec运行exe替换）
        // 由于提权后的exe打开electron，导致其启动后也会是管理员权限，故需降权进行启动，explorer.exe
        electronLog.info(
          `"${path.join(
            app.getPath('userData'),
            './update.exe',
          )}" "${resourcesPath}" "${downloads}" "蓝数IM.exe" "${app.getPath(
            'exe',
          )}"`,
        );
        sudoPrompt(
          `"${path.join(
            app.getPath('userData'),
            './update.exe',
          )}" "${resourcesPath}" "${downloads}" "蓝数IM.exe" "${app.getPath(
            'exe',
          )}"`,
          version,
        );

        // exec(
        //   `"${path.join(
        //     app.getPath('userData'),
        //     './update.exe',
        //   )}" "${resourcesPath}" "${downloads}" "蓝数IM.exe" "${app.getPath(
        //     'exe',
        //   )}"`,
        //   function (error, stdout, stderr) {
        //     if (error) {
        //       console.error('error: ' + error);
        //       electronLog.info(error);
        //       return;
        //     }
        //     electronLog.info('stdout');
        //     electronLog.info(stdout);
        //     console.log('stdout: ' + stdout);
        //   },
        // );
      });
    })
    .catch((err) => {
      electronLog.info(err);
      console.log(err);
      global.mainWindow.webContents.send('downloadProgress', null);
    });
};
