import { JSEncrypt } from 'jsencrypt';
import { getPublicKey } from './apis';
import { renderProcess } from '@lanshu/render-process';

// 使用公匙进行数据加密码
export const encryptData = async (data) => {
  let publicKey = await renderProcess.getStore('PUBLIC_KEY');
  if (!publicKey) {
    const { data } = await getPublicKey();
    publicKey = data;
  }
  await renderProcess.setStore('PUBLIC_KEY', publicKey);

  const rsaEncrypt = new JSEncrypt();
  rsaEncrypt.setPublicKey(publicKey);

  const encrypted = rsaEncrypt.encrypt(data);
  return encrypted;
};
