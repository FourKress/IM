import log from './log';
const sudo = require('sudo-prompt');
const options = {
  name: 'Electron',
};

export default (shell) => {
  return new Promise((resolve, reject) => {
    log.info(shell);
    sudo.exec(shell, options, function (error, stdout) {
      if (error) {
        reject(error);
        console.log('error:' + error);
        return;
      }
      resolve(stdout);
      console.log('stdout: ' + stdout);
    });
  });
};
