// 手机号加密
export const phoneEncryption = (phoneNum) => {
  if (!phoneNum) return;
  const regExp = new RegExp(/([\s\S]{3})\d*([\s\S]{4})/);
  const replaceValue = `$1${new Array(Number(4) + 1).join('*')}$2`;
  return phoneNum.replace(regExp, replaceValue);
};

// 手机号格式化
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

// 取消手机号格式化
export const unFormatPhoneNum = (phoneNum) => {
  if (!phoneNum) return phoneNum;
  return phoneNum.replace(/ /g, '');
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

// 设置header的class,用于控制窗体拖动
export const setHeaderClassName = (className) => {
  const hearerSearch = document.querySelector('#header-container');
  if (hearerSearch) {
    // 控制头部拖拽效果
    hearerSearch.className = `${className}`;
  }
};

// 格式化sessId，去掉冒号
export const formatSessId = (sessId) => {
  return sessId.replace(':', '');
};

export const removeAllDialogDom = () => {
  const cardDialogList = document.querySelectorAll('.ls-card-dialog');
  const dialogList = document.querySelectorAll('.ls-dialog');
  const removeList = [...cardDialogList, ...dialogList];

  if (removeList?.length) {
    removeList.forEach((d) => {
      document.body.removeChild(d);
    });
  }
};
