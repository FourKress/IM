import downloadFile from './downloadFile';
import electronLog from './log';
// import sudoPrompt from './sudoPrompt';
import { app } from 'electron';
const fse = require('fs-extra');
const path = require('path');
const AdmZip = require('adm-zip');
const exec = require('child_process').exec;

export default async (data) => {
  const resourcesPath = process.resourcesPath;
  const userDataPath = app.getPath('userData');
  const { upDateExe, upDateUrl } = data;

  electronLog.info(data);
  electronLog.info(resourcesPath);
  electronLog.info(userDataPath);

  if (!fse.pathExistsSync(path.join(userDataPath, './update.exe'))) {
    electronLog.info('下载exe');
    await downloadFile({
      url: upDateExe,
      targetPath: userDataPath,
    }).catch((err) => {
      console.log(err);
      electronLog.info(err);
    });
  }
  // 提权的方案，这里简写了，正式项目请自行选择位置放update.exe
  const downloads = app.getPath('downloads');
  downloadFile({ url: upDateUrl, targetPath: downloads })
    .then(async (filePath) => {
      electronLog.info('下载更新包');
      electronLog.info(filePath);
      const zip = new AdmZip(filePath);
      zip.extractAllToAsync(downloads, true, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        fse.removeSync(filePath);
        // 临时提权运行exe，exe中关闭主进程，替换安装c盘中的asar（提权是为了处理c盘，如果安装其他盘，可以直接用node.exec运行exe替换）
        // 由于提权后的exe打开electron，导致其启动后也会是管理员权限，故需降权进行启动，explorer.exe
        electronLog.info(
          `"${path.join(
            app.getPath('userData'),
            './update.exe',
          )}" "${resourcesPath}" "${downloads}" "Lanshu.exe" "${app.getPath(
            'exe',
          )}"`,
        );
        // sudoPrompt(
        //   `"${path.join(
        //     app.getPath('userData'),
        //     './update.exe',
        //   )}" "${resourcesPath}" "${downloads}" "Lanshu.exe" "${app.getPath(
        //     'exe',
        //   )}"`,
        // );

        exec(
          `"${path.join(
            app.getPath('userData'),
            './update.exe',
          )}" "${resourcesPath}" "${downloads}" "Lanshu.exe" "${app.getPath(
            'exe',
          )}"`,
          function (error, stdout, stderr) {
            if (error) {
              console.error('error: ' + error);
              electronLog.info(error);
              return;
            }
            electronLog.info('stdout');
            electronLog.info(stdout);
            console.log('stdout: ' + stdout);
          },
        );
      });
    })
    .catch((err) => {
      electronLog.info(err);
      console.log(err);
    });
};
