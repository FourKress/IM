const child_process = require('child_process');
const path = require('path');
const fse = require('fs-extra');

const installOriginPath = path.join(process.cwd(), '/build/win-unpacked');
const installTargetPath = path.join(
  process.cwd(),
  '/custom-install/FilesToInstall',
);
fse.copySync(installOriginPath, installTargetPath);

const batPath = path.join(process.cwd(), '/custom-install/build-nim.bat');
const bat = child_process.spawn(batPath);

bat.on('exit', (code) => {
  console.log(`Child exited with code ${code}`);
  if (code === 0) {
    console.log('自定义安装包 生成完毕。');
    console.log('路径:', path.join(batPath, '../Output'));
  } else {
    console.log('自定义安装包 生成失败。');
  }
});
