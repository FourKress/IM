const fs = require('fs');

const buffer = fs.readFileSync(
  '../node_modules/@lanshu/main-process/src/preload.js',
);

const filePath = './src/preload.js';

try {
  fs.unlinkSync(filePath);
} catch (e) {
  console.log('未找到 preload.js 无需删除');
}

fs.writeFileSync(filePath, buffer);

console.log('preload.js 生成完毕。');
