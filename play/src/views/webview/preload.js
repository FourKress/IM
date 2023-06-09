const { ipcRenderer } = require('electron');

const handleSetInputValue = (dom, value) => {
  return new Promise((resolve) => {
    const inputEmailEvt = new InputEvent('input', {
      inputType: 'insertText',
      data: value,
      dataTransfer: null,
      isComposing: false,
    });
    dom.value = value;
    dom.dispatchEvent(inputEmailEvt);
    resolve(true);
  });
};

const sleep = (sleepTime) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, sleepTime);
  });
};

ipcRenderer.on('WEBVIEW_LOGIN', (_event, config = {}) => {
  setTimeout(async () => {
    const {
      userEl,
      userName,
      passwordEl,
      password,
      rememberEl = '',
      agreementEl = '',
      loginBtnEl,
      awaitTime,
    } = config;

    if (!userName) {
      await sleep(awaitTime);
      ipcRenderer.sendToHost('WEBVIEW_IPC', `SUCCESS`);
    }

    const inputEmailDom = document.querySelector(userEl);
    const inputPasswordDom = document.querySelector(passwordEl);

    console.log(`WEBVIEW_IPC: isLogin: ${!!inputEmailDom}`);

    if (!inputEmailDom) {
      await sleep(1000);
      ipcRenderer.sendToHost('WEBVIEW_IPC', `SUCCESS`);
      return;
    }

    await handleSetInputValue(inputEmailDom, userName);
    await handleSetInputValue(inputPasswordDom, password);

    if (rememberEl) {
      const classNameArr = rememberEl.split(' ');
      const rememberDOM = document.querySelector(rememberEl);
      const rememberInput = document.querySelector(`${classNameArr[0]} input`);
      console.log(
        `WEBVIEW_IPC: rememberChecked: ${
          rememberInput && rememberInput.checked
        }`,
      );
      if (!(rememberInput && rememberInput.checked)) {
        rememberInput.checked = true;
        if (classNameArr.pop() !== 'input') {
          rememberDOM.click();
        }
      }
    }

    if (agreementEl) {
      const classNameArr = agreementEl.split(' ');
      const agreementDOM = document.querySelector(agreementEl);
      const agreementInput = document.querySelector(`${classNameArr[0]} input`);
      console.log(
        `WEBVIEW_IPC: agreementChecked: ${
          agreementInput && agreementInput.checked
        }`,
      );
      if (!(agreementInput && agreementInput.checked)) {
        agreementInput.checked = true;
        if (classNameArr.pop() !== 'input') {
          agreementDOM.click();
        }
      }
    }

    await sleep(100);
    document.querySelector(loginBtnEl).click();

    await sleep(awaitTime);
    ipcRenderer.sendToHost('WEBVIEW_IPC', `SUCCESS`);
  }, 3000);
});
