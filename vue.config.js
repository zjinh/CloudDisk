'use strict';
const path = require('path');
function resolve(dir) {
	return path.join(__dirname, dir);
}
const productName = 'CloudDisk';
const appId = 'com.zjinh.app.' + productName;
const menuCategory = 'Cloud';
const shortcutName = 'C-Disk';
const port = 9020;
module.exports = {
	// publicPath: '/',
	// outputDir: 'dist',
	// assetsDir: 'static',
	// lintOnSave: process.env.NODE_ENV === 'development',
	// productionSourceMap: false,
	devServer: {
		port: port
		//   open: true,
		//   overlay: {
		//     warnings: false,
		//     errors: true
		//   }
	},
	chainWebpack(config) {
		// alias
		config.resolve.alias.set('@', resolve('src'));
	},
	pluginOptions: {
		electronBuilder: {
			builderOptions: {
				productName: productName,
				appId: appId,
				directories: {
					output: 'build'
				},
				win: {
					icon: 'public/icon/icon.ico',
					artifactName: '${productName}_setup_${version}.${ext}',
					target: ['nsis']
				},
				nsis: {
					oneClick: false,
					menuCategory: menuCategory,
					shortcutName: shortcutName,
					allowToChangeInstallationDirectory: true,
					perMachine: true,
					runAfterFinish: true
				},
				dmg: {
					contents: [
						{
							x: 410,
							y: 150,
							type: 'link',
							path: '/Applications'
						},
						{
							x: 130,
							y: 150,
							type: 'file'
						}
					]
				},
				mac: {
					icon: 'public/icon/icon.icns'
				},
				linux: {
					icon: 'public/icon/icon.ico'
				}
			}
		}
	}
};
