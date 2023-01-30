import { globalShortcut } from 'electron';
import { handleStartCapture } from './screenshots';

export const unregisterHotKeyAll = () => {
  globalShortcut.unregisterAll();
};

export const initHotKeys = () => {
  let hotKeys = global.store.get('hotKeys');
  const defaultKeys = {
    sendMsg: {
      defaultKey: 'Enter',
      currentKey: 'Enter',
    },
    screenshot: {
      defaultKey: 'CommandOrControl+Shift+A',
      currentKey: 'CommandOrControl+Shift+A',
    },
    search: {
      defaultKey: 'CommandOrControl+F',
      currentKey: 'CommandOrControl+F',
    },
    window: {
      defaultKey: 'CommandOrControl+M',
      currentKey: 'CommandOrControl+M',
    },
  };
  if (!hotKeys) {
    global.store.set('hotKeys', defaultKeys);
    hotKeys = defaultKeys;
  }

  const hotKeyConfig = Object.keys(hotKeys)
    .filter((k) => k !== 'sendMsg')
    .map((k) => {
      return {
        newKey: hotKeys[k].currentKey,
        oldKey: '',
        type: k,
      };
    });

  hotKeyConfig.forEach((k) => {
    handleHotKey(k);
  });
};

export const handleHotKey = (params) => {
  const { newKey, oldKey, type } = params;

  if (oldKey) {
    globalShortcut.unregister(oldKey);
  }

  if (newKey) {
    globalShortcut.register(newKey, async () => {
      switch (type) {
        case 'screenshot':
          console.log('截图');
          await handleStartCapture(global.screenshots);
          break;
        case 'search':
          console.log('搜索');
          break;
        case 'window':
          console.log('显示隐藏');
          break;
        default:
          break;
      }
    });
  }
};
