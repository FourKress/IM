import log from './log';
const sudo = require('sudo-prompt');
const options = {
  name: 'Electron',
};

export default (shell, version) => {
  return new Promise((resolve, reject) => {
    log.info(shell);
    sudo.exec(shell, options, function (error, stdout) {
      if (error) {
        reject(error);
        log.info('sudoPrompt error:' + error);
        global.mainWindow.webContents.send('mainProcessError', {
          msg: '更新失败, 请重新打开应用',
          type: 'DIALOG',
        });
        return;
      }
      resolve(stdout);
      global.store.set('VERSION', version);
      log.info('sudoPrompt stdout: ' + stdout);
    });
  });
};
