import log from './log';

const sudo = require('sudo-prompt');
const options = {
  name: 'Lanshu',
};

export default (shell, version) => {
  return new Promise((resolve, reject) => {
    const currentVersion = global.store.get('VERSION');

    log.info(shell);
    log.info(currentVersion);
    log.info(version);

    global.store.set('VERSION', version);

    sudo.exec(shell, options, function (error, stdout) {
      log.info('sudoPrompt action');

      if (error) {
        log.info('sudoPrompt error:' + error);
        global.store.set('VERSION', currentVersion);
        global.mainWindow.webContents.send('mainProcessError', {
          msg: '更新失败, 请重新打开应用',
          type: 'DIALOG',
        });

        reject(error);
        return;
      }
      log.info('sudoPrompt stdout: ' + stdout);
      resolve(stdout);
    });
  });
};
