const child_process = require('child_process');
const path = require('path');
const fse = require('fs-extra');

const cwdPath = path.join(process.cwd(), '/custom-install');
const installOriginPath = path.join(process.cwd(), '/build/win-unpacked');
const installTargetPath = path.join(cwdPath, '/FilesToInstall');

fse.copySync(installOriginPath, installTargetPath);

const batPath = path.join(cwdPath, '/build-nim.bat');
const bat = child_process.spawn(batPath, {
  cwd: cwdPath,
  // stdio: 'inherit',
});

console.log('自定义安装包 生成中 请等待...');

bat.on('close', (code) => {
  console.log(`Child exited with code ${code}`);
  if (code === 0) {
    console.log('自定义安装包 生成完毕。');
    console.log('路径:', path.join(cwdPath, '/Output'));
  } else {
    console.log('自定义安装包 生成失败。');
  }
});
