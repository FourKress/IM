import { removeToken } from './token';
import { renderProcess } from '@lanshu/render-process';
import { IMDestroy } from './IM-event';

export const phoneEncryption = (phoneNum) => {
  if (!phoneNum) return;
  const regExp = new RegExp(/([\s\S]{3})\d*([\s\S]{4})/);
  const replaceValue = `$1${new Array(Number(4) + 1).join('*')}$2`;
  return phoneNum.replace(regExp, replaceValue);
};

export const formatPhoneNum = (newPhoneNum, oldPhoneNum) => {
  if (oldPhoneNum?.length > newPhoneNum?.length) return;
  if (newPhoneNum) {
    const matches = /^(\d{3})(\d{4})?(\d{4})?$/.exec(
      newPhoneNum.replace(/ /g, ''),
    );
    if (matches) {
      let phoneNum = `${matches[1]} `;
      if (matches[2]) {
        phoneNum += `${matches[2]} `;
      }
      if (matches[3]) {
        phoneNum += `${matches[3]}`;
      }
      return phoneNum;
    }
  }
};

export const logOut = async () => {
  IMDestroy();
  removeToken();
  window.location.reload();
  renderProcess.showLoginWindow(500);
};

// 求次幂
const pow1024 = (num) => {
  return Math.pow(1024, num);
};

// 文件大小 字节转换单位
export const getFileSize = (fileSize) => {
  if (!fileSize) return '';
  if (fileSize < pow1024(1)) return fileSize + ' B';
  if (fileSize < pow1024(2)) return (fileSize / pow1024(1)).toFixed(2) + ' KB';
  if (fileSize < pow1024(3)) return (fileSize / pow1024(2)).toFixed(2) + ' MB';
  if (fileSize < pow1024(4)) return (fileSize / pow1024(3)).toFixed(2) + ' GB';
  return (fileSize / pow1024(4)).toFixed(2) + ' TB';
};

export const getObjectURL = (file) => {
  return window.webkitURL.createObjectURL(file);
};

export const downloadFile = (url, name) => {
  const x = new window.XMLHttpRequest();
  x.open('GET', url, true);
  x.responseType = 'blob';
  x.onload = () => {
    const url = URL.createObjectURL(x.response);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  x.send();
};
