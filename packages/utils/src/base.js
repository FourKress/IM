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

export const compareVersion = function (version1, version2) {
  const n = version1.length,
    m = version2.length;
  let i = 0,
    j = 0;
  while (i < n || j < m) {
    let x = 0;
    for (; i < n && version1[i] !== '.'; ++i) {
      x = x * 10 + version1[i].charCodeAt() - '0'.charCodeAt();
    }
    ++i; // 跳过点号
    let y = 0;
    for (; j < m && version2.charAt(j) !== '.'; ++j) {
      y = y * 10 + version2[j].charCodeAt() - '0'.charCodeAt();
    }
    ++j; // 跳过点号
    if (x !== y) {
      return x > y ? 1 : -1;
    }
  }
  return 0;
};

export const dataURLtoBlob = (dataUrl) => {
  let arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bStr = atob(arr[1]),
    n = bStr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bStr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const setHeaderClassName = (className) => {
  const hearerSearch = document.querySelector('#client-header');
  if (hearerSearch) {
    // 控制头部拖拽效果
    hearerSearch.className = `${className}`;
  }
};
