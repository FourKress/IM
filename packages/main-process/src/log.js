import log from 'electron-log';
import { app } from 'electron';
import { IS_DEVELOPMENT } from './utils';

class Log {
  constructor() {
    this.baseLog = log.create('base');
    this.sdkLog = log.create('sdk');

    this.setConfig(this.baseLog, 'base');
    this.setConfig(this.sdkLog, 'sdk');
  }

  setConfig(log, name) {
    log.transports.file.level = 'info';
    log.transports.file.maxSize = 1002430; // 10M
    log.transports.file.format =
      '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';

    let date = new Date();
    date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    log.transports.file.file = `${app.getPath(
      'userData',
    )}/electron_log/${date}-${
      IS_DEVELOPMENT ? 'development' : 'production'
    }-${name}.log`;
  }
}

const LogInstance = new Log();

export const electronLog = LogInstance.baseLog;
export const sdkLog = LogInstance.sdkLog;
