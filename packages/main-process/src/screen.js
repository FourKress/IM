import { screen } from 'electron';

const computedSize = (size) => {
  const { width, height } = size;

  let renderWidth, renderHeight;
  if (width < 1920 || height < 1080) {
    renderWidth = 1024;
    renderHeight = 640;
  }
  if (width === 1920 || height === 1080) {
    renderWidth = 1280;
    renderHeight = 720;
  }
  if ((width > 1920 || height > 1080) && (width < 2560 || height < 1440)) {
    renderWidth = 1700;
    renderHeight = 960;
  }
  if (width >= 2560 || height >= 1440) {
    renderWidth = 1920;
    renderHeight = 1080;
  }
  return {
    renderWidth,
    renderHeight,
  };
};

export const getScreenInfo = () => {
  // 外部控制的窗口默认大小
  const windowsSize = global.store.get('DEFAULT_WINDOWS_SIZE');
  if (windowsSize) return windowsSize;

  const { size } = screen.getPrimaryDisplay();
  const { renderWidth, renderHeight } = computedSize(size);

  return {
    width: renderWidth,
    height: renderHeight,
  };
};
