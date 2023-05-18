const path = require('path');
const AdmZip = require('adm-zip');
const fse = require('fs-extra');

exports.default = async function (context) {
  const { appOutDir, outDir, packager } = context;
  let targetPath;
  if (packager.platform.nodeName === 'darwin') {
    targetPath = path.join(
      appOutDir,
      `${packager.appInfo.productName}.app/Contents/Resources`,
    );
  } else {
    targetPath = path.join(appOutDir, './resources');
  }
  const asar = path.join(targetPath, './app.asar');
  fse.copySync(asar, path.join(outDir, './update.asar'));
  const zip = new AdmZip();
  zip.addLocalFile(path.join(outDir, './update.asar'));
  zip.writeZip(path.join(outDir, 'app.zip'));
  fse.removeSync(path.join(outDir, './update.asar'));
};
