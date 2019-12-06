import { BrowserWindow, Menu } from 'electron';

const packageInfo = require('../../../package.json');
const isDevelopment = process.env.NODE_ENV !== 'production';
export default {
	create(options) {
		Menu.setApplicationMenu(null);
		let defaultOptions = {
			width: 800,
			height: 600,
			title: packageInfo.name,
			frame: false,
			useContentSize: false,
			transparent: false,
			minimizable: true,
			maximizable: true,
			resizable: true,
			alwaysOnTop: false,
			show: false,
			webPreferences: {
				nodeIntegration: true,
				webSecurity: false
			}
		};
		options = Object.assign(defaultOptions, options);
		let win = new BrowserWindow(options);
		options.backgroundColor && (win.backgroundColor = options.backgroundColor);
		win.name = options.url;
		win.loadURL(this.checkRouter(options.url));
		win.callback = data => {
			win.webContents.send('win-data', data);
			typeof options.callback === 'function' ? options.callback() : '';
		};
		win.on('closed', event => {
			win = null;
			typeof options.onclose === 'function' ? options.onclose(event) : '';
		});
		win.on('ready-to-show', event => {
			win.show();
			win.focus();
			typeof options.ready === 'function' ? options.ready(event) : '';
		});
		win.webContents.on('did-finish-load', () => {
			win.setTitle(options.title);
			win.callback(options.data || '无数据');
			isDevelopment && win.webContents.openDevTools();
		});
		return win;
	},
	checkRouter(router) {
		if (isDevelopment) {
			return 'http://localhost:9020/#/' + router;
		}
		return 'app://./index.html#/' + router;
	},
	active(win, data) {
		if (win) {
			win.show();
			win.focus();
			data && win.callback(data);
		}
	}
};
