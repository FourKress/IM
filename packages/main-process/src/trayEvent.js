import { Menu, Tray } from 'electron';
import path from 'path';
import { app, nativeImage } from 'electron';

const isDevelopment = process.env.NODE_ENV === 'development';
const trayIconPath = isDevelopment
  ? './icons/icon.ico'
  : path.join(app.getPath('exe'), '/../resources/icons/icon.ico');

class TrayEvent {
  constructor() {
    this.tray = null;
    this.flashTimer = null;
  }

  init() {
    this.tray.setImage(trayIconPath);
    this.tray.setToolTip('蓝数IM');
  }

  setTray() {
    this.tray = new Tray(trayIconPath);
    this.init();

    this.tray.on('click', () => {
      global.mainWindow.show();
      this.init();
      if (this.flashTimer) {
        clearInterval(this.flashTimer);
        this.flashTimer = null;
      }
    });

    const trayContextMenu = Menu.buildFromTemplate([
      {
        label: '退出',
        role: 'quit',
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
}

export default new TrayEvent();
