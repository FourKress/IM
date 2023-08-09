import { app, protocol } from 'electron';
import downloadFile from './downloadFile';
import { electronLog } from './log';
import { calcFileSize } from './utils';

const fs = require('fs');
const path = require('path');

const registerFileProtocol = () => {
  protocol.interceptFileProtocol('cache', (req, callback) => {
    const url = req.url.substr(9);
    callback(decodeURI(url));
  });
};

export const initCache = () => {
  const storeCacheDir = global.store.get('CACHE_DIR');
  let cacheDir = path.resolve(app.getPath('userData'), 'my-cache');
  if (storeCacheDir) {
    cacheDir = storeCacheDir;
  }
  global.store.set('CACHE_DIR', cacheDir);

  if (fs.existsSync(cacheDir)) {
    electronLog.info('找到缓存文件夹');
  } else {
    electronLog.info('未找到缓存文件夹');
    fs.mkdirSync(cacheDir);
  }
  registerFileProtocol();
};

export const getCacheDirInfo = async () => {
  const cacheDir = global.store.get('CACHE_DIR');
  const { error, fileSize } = await calcFileSize(cacheDir);
  return {
    dir: cacheDir,
    size: error ? 0 : fileSize,
  };
};

export const setCacheDir = (dirPath) => {
  global.store.set('CACHE_DIR', dirPath);
};

export const getCacheFilePath = (fileName) => {
  try {
    const cacheDir = global.store.get('CACHE_DIR');
    const filePath = path.resolve(cacheDir, fileName);
    if (fs.existsSync(filePath)) {
      electronLog.info(`找到缓存文件 ${fileName}`);
      return `cache:///${filePath}`;
    } else {
      electronLog.info(`未找到缓存文件 ${fileName}`);
      return '';
    }
  } catch (e) {
    electronLog.info(`查找缓存文件失败 ${fileName}`);
    return '';
  }
};

export const saveCacheFile = (data) => {
  return new Promise(async (resolve, reject) => {
    const cacheDir = global.store.get('CACHE_DIR');
    const { url, fileName } = data;
    const type = url.split('/').pop().split('.')[1];
    const path = await downloadFile({
      url,
      targetPath: cacheDir,
      fileName: type ? `${fileName}.${type}` : fileName,
    }).catch((err) => {
      electronLog.error(`saveCacheFile ${err}`);
      reject();
    });
    electronLog.info(`saveCacheFile ${path}`);
    resolve();
  });
};

export const getCacheFile2Base64 = (fileName) => {
  const bitmap = fs.readFileSync(fileName);
  const base64str = Buffer.from(bitmap).toString('base64'); // base64编码
  return `data:image/png;base64,${base64str}`;
};
