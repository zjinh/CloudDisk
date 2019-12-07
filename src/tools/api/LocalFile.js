import encrypt from '../encrypt';
import electron from 'electron';
const fs = require('fs');
const productName = 'CloudDisk';
const path = require('path');
const app = (electron.remote ? electron.remote : electron).app;
export default {
	address: path.join(app.getPath('appData')) + '/CloudSeries/',
	user: '',
	debug: process.env.NODE_ENV === 'development',
	folders: {},
	files: {}, //用户本地文件对象
	char26() {
		let ch_small = 'a';
		let str = '';
		let ch_big = 'A';
		for (let i = 0; i < 26; i++) {
			str += String.fromCharCode(ch_small.charCodeAt(0) + i) + String.fromCharCode(ch_big.charCodeAt(0) + i);
		}
		return str;
	},
	log(message) {
		this.debug && console.info(message);
	},
	init(user, callback) {
		this.user = user;
		this.folderVerify(this.address, () => {
			this.folders = {
				basic: this.address + productName,
				user: this.address + productName + '/' + user
			};
			this.files = {
				login: this.folders.basic,
				user: this.folders.user,
				transfer: this.folders.user,
				setting: this.folders.user,
				key: this.folders.basic,
				__map__: this.folders.basic
			};
			let foldersMap = [],
				i = 0;
			for (let folder in this.folders) {
				foldersMap.push(this.folders[folder]);
			}
			this.createFolder(foldersMap, i, () => {
				this.log(productName + '文件夹初始化完成');
				for (let file in this.files) {
					this.files[file] = this.files[file] + '/' + file + '.json';
					if (file === '__map__') {
						fs.writeFile(this.files[file], JSON.stringify(this.files), () => {
							this.log('创建' + this.files[file]);
						});
					} else {
						fs.appendFileSync(this.files[file], '');
					}
				}
				callback && callback();
			});
		});
	},
	createFolder(map, index, callback) {
		this.folderVerify(map[index], () => {
			if (index !== map.length - 1) {
				index++;
				this.createFolder(map, index, callback);
			} else {
				callback && callback();
			}
		});
	},
	folderVerify(url, callback) {
		fs.access(url, fs.constants.F_OK | fs.constants.W_OK, err => {
			err
				? fs.mkdir(url, err => {
						callback && callback();
				  })
				: callback && callback();
		});
	},
	getMap(type) {
		if (this.files[type]) {
			return this.files;
		}
		try {
			return JSON.parse(fs.readFileSync(this.address + productName + '/__map__.json'));
		} catch (e) {
			return false;
		}
	},
	read(type, callback, encryption) {
		this.files = this.getMap(type);
		this.log('读取' + this.files[type]);
		if (!this.files) {
			return callback(null, callback, 1);
		}
		fs.readFile(this.files[type], { flag: 'r+', encoding: 'utf8' }, (err, data) => {
			data = encryption ? this.encryption(data, false) : data;
			try {
				data = JSON.parse(data);
			} catch (e) {
				data = {};
			}
			callback && callback(data, err);
		});
	},
	write(type, data, encryption, callback) {
		this.log('写入' + this.files[type]);
		data = JSON.stringify(data);
		if (encryption) {
			data = this.encryption(data, true);
		}
		if (type === 'key') {
			let char26 = this.char26();
			data = encrypt.encode(data, data + char26, data + char26);
		}
		fs.writeFile(this.files[type], data, err => {
			callback && callback(data, err);
		});
	},
	encryption(data, command) {
		let key = this.read('key');
		let pKey = key + this.char26();
		if (command === 'lock' || command === true) {
			data = encrypt.encode(data, pKey, key);
		} else {
			data = encrypt.decode(data, pKey, key);
		}
		return data;
	}
};
