import { IMEvent } from '@lanshu/im';
import { removeToken } from './token';
import { renderProcess } from '@lanshu/render-process';
import router from './router';

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
  await IMEvent.IMLogout();
  // IMEvent.IMDestroy();
  removeToken();
  renderProcess.showLoginWindow(500);
};
