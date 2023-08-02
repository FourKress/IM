import { Menu, Tray } from 'electron';
import path from 'path';
import { app, nativeImage } from 'electron';
import { IS_DEVELOPMENT } from './utils';

const trayIconPath = IS_DEVELOPMENT
  ? './icons/icon.ico'
  : path.join(app.getPath('exe'), '/../resources/icons/icon.ico');

class TrayEvent {
  constructor() {
    this.tray = null;
    this.flashTimer = null;
  }

  init() {
    this.tray.setImage(trayIconPath);
    this.tray.setToolTip('北象IM');
  }

  setTray() {
    this.tray = new Tray(trayIconPath);
    this.init();

    this.tray.on('click', () => {
      const isMinimized = global.mainWindow.isMinimized();
      if (isMinimized) {
        global.mainWindow.restore();
      } else {
        global.mainWindow.show();
      }
      this.clearFlash();
    });

    const trayContextMenu = Menu.buildFromTemplate([
      {
        label: '退出',
        click: () => {
          global.store.set('WIN_CAN_BE_CLOSED', true);
          app.quit();
        },
      },
    ]);
    // 设置鼠标右键键事件
    this.tray.on('right-click', () => {
      this.tray.popUpContextMenu(trayContextMenu);
    });
  }

  setFlash() {
    let flag = false;
    if (this.flashTimer) return;
    global.mainWindow.flashFrame(true);
    this.flashTimer = setInterval(() => {
      flag = !flag;
      if (flag) {
        this.tray.setImage(trayIconPath);
      } else {
        this.tray.setImage(nativeImage.createEmpty());
      }
      this.tray.setToolTip('您有新消息');
    }, 1000);
  }

  clearFlash() {
    if (this.flashTimer) {
      clearInterval(this.flashTimer);
      this.flashTimer = null;
      this.init();
    }
  }
}

export default new TrayEvent();
