import { screen } from 'electron';

export const getScreenInfo = () => {
  const {
    size: { width, height },
  } = screen.getPrimaryDisplay();

  let renderWidth, renderHeight;
  if (width < 1920 || height < 1080) {
    renderWidth = 1024;
    renderHeight = 640;
  }
  if ((width >= 1920 || height >= 1080) && (width <= 2560 || height <= 1440)) {
    renderWidth = 1280;
    renderHeight = 720;
  }
  if (width > 2560 || height > 1440) {
    renderWidth = 1920;
    renderHeight = 1080;
  }

  screen.on('display-metrics-changed', function (ev, display) {
    console.log('display-metrics-changed');
  });

  return {
    width: renderWidth,
    height: renderHeight,
  };
};