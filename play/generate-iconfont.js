const fs = require('fs');

const buffer = fs.readFileSync(
  '../node_modules/@lanshu/layout/src/assets/styles/iconfont/iconfont.js',
);

const filePath = './public/iconfont.js';

try {
  fs.unlinkSync(filePath);
} catch (e) {
  console.log('未找到 iconfont.js 无需删除');
}

fs.writeFileSync(filePath, buffer);

console.log('iconfont.js 生成完毕。');
