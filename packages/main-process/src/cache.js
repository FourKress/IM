import { app, protocol, screen } from 'electron';
import downloadFile from './downloadFile';
import electronLog from './log';
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

  console.log(
    screen.getPrimaryDisplay().scaleFactor,
    screen.getPrimaryDisplay().size,
  );
  screen.on('display-metrics-changed', function (ev, display) {
    console.log(ev, display);
  });

  if (fs.existsSync(cacheDir)) {
    console.log('找到缓存文件夹');
  } else {
    console.log('未找到缓存文件夹');
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
      console.log('找到缓存文件');
      return `cache:///${filePath}`;
    } else {
      console.log('未找到缓存文件');
      return '';
    }
  } catch (e) {
    console.log('查找缓存文件失败');
    return '';
  }
};

export const saveCacheFile = async (data) => {
  const cacheDir = global.store.get('CACHE_DIR');
  const { url, fileName } = data;
  const type = url.split('/').pop().split('.')[1];
  const path = await downloadFile({
    url,
    targetPath: cacheDir,
    fileName: type ? `${fileName}.${type}` : fileName,
  }).catch((err) => {
    console.log(err);
    electronLog.info(err);
  });
  console.log('path', path);
};
