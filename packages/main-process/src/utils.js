import { dialog } from 'electron';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

/**
 * 文件大小 字节转换单位
 * @param size
 * @returns {string|*}
 */
export const filterSize = (size) => {
  if (!size) return '';
  if (size < pow1024(1)) return size + 'B';
  if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + 'KB';
  if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + 'MB';
  if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + 'GB';
  return (size / pow1024(4)).toFixed(2) + 'TB';
};

// 求次幂
function pow1024(num) {
  return Math.pow(1024, num);
}

export const handleFileOpen = async (args) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    global.mainWindow,
    {
      properties: [args],
    },
  );
  if (canceled) {
    return false;
  }
  return filePaths[0];
};

export const handleSaveFileOpen = async () => {
  const { canceled, filePath } = await dialog.showSaveDialog(
    global.mainWindow,
    {
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
    },
  );
  if (canceled) {
    return false;
  }
  return filePath;
};

export const copyFile = async (sourcePath, targetPath) => {
  await fs.copyFileSync(sourcePath, targetPath);
};

export const calcFileSize = async (dirPath) => {
  let fileSize = 0;
  let error = null;
  async function calc(dirPath) {
    try {
      const statObj = await stat(dirPath);
      if (statObj.isDirectory()) {
        const files = await readdir(dirPath);
        let dirs = files.map((item) => {
          return path.join(dirPath, item);
        });
        let index = 0;
        async function next() {
          if (index < dirs.length) {
            let current = dirs[index++];
            await calc(current);
            await next();
          }
        }
        return await next();
      } else {
        fileSize += statObj.size;
      }
    } catch (err) {
      error = err;
    }
  }
  await calc(dirPath);
  return {
    error,
    fileSize: filterSize(fileSize),
  };
};

export const deleteFile = (path) => {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path);
    files.forEach((file, index) => {
      const curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFile(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }
};

export const IS_MAC = process.platform === 'darwin';

export const CLIENT_TYPE = {
  IS_PC: 1,
  IS_MOBILE: 2,
};

export const WINDOW_TYPE = {
  IS_MAIN: 1,
  IS_TRTC: 2,
};
