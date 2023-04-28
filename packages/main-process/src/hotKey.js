import { globalShortcut } from 'electron';
import { handleStartCapture } from './screenshots';

const Enter = 'Enter';
const ctrlEnter = 'Ctrl';

export const unregisterHotKeyAll = () => {
  globalShortcut.unregisterAll();
};

export const initHotKeys = () => {
  let hotKeys = global.store.get('HOT_KEYS');
  const defaultKeys = {
    sendMsg: {
      defaultKey: Enter,
      currentKey: Enter,
    },
    screenshot: {
      defaultKey: `${ctrlEnter}+Shift+A`,
      currentKey: `${ctrlEnter}+Shift+A`,
    },
    search: {
      defaultKey: `${ctrlEnter}+F`,
      currentKey: `${ctrlEnter}+F`,
    },
    window: {
      defaultKey: `${ctrlEnter}+M`,
      currentKey: `${ctrlEnter}+M`,
    },
  };
  if (!hotKeys) {
    global.store.set('HOT_KEYS', defaultKeys);
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
