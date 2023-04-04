const path = require('path');
const AdmZip = require('adm-zip');
const fse = require('fs-extra');

exports.default = async function (context) {
  console.log('afterPack');
  let targetPath;
  if (context.packager.platform.nodeName === 'darwin') {
    targetPath = path.join(
      context.appOutDir,
      `${context.packager.appInfo.productName}.app/Contents/Resources`,
    );
  } else {
    targetPath = path.join(context.appOutDir, './resources');
  }
  const asar = path.join(targetPath, './app.asar');
  fse.copySync(asar, path.join(context.outDir, './update.asar'));
  const zip = new AdmZip();
  zip.addLocalFile(path.join(context.outDir, './update.asar'));
  zip.writeZip(path.join(context.outDir, 'app.zip'));
  fse.removeSync(path.join(context.outDir, './update.asar'));
};
