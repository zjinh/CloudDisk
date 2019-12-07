import Vue from 'vue';
import axios from 'axios/index';
import electron from 'electron';
const ipcRenderer = electron.ipcRenderer;
const packageInfo = require('../../package.json');
const path = require('path');

axios.interceptors.response.use(
	function(response) {
		// 对响应数据做点什么
		return response;
	},
	function(err) {
		if (err && err.response) {
			switch (err.response.status) {
				case 400:
					err.message = '请求错误(400)';
					break;
				case 401:
					err.message = '未授权，请重新登录(401)';
					break;
				case 403:
					err.message = '拒绝访问(403)';
					break;
				case 404:
					err.message = '请求出错(404)';
					break;
				case 408:
					err.message = '请求超时(408)';
					break;
				case 500:
					err.message = '服务器错误(500)';
					break;
				case 501:
					err.message = '服务未实现(501)';
					break;
				case 502:
					err.message = '网络错误(502)';
					break;
				case 503:
					err.message = '服务不可用(503)';
					break;
				case 504:
					err.message = '网络超时(504)';
					break;
				case 505:
					err.message = 'HTTP版本不受支持(505)';
					break;
				default:
					err.message = `连接出错(${err.response.status})!`;
			}
		} else {
			err.message = '连接服务器失败，请检查网络连接或联系管理员';
		}
		return Promise.reject(err);
	}
);
String.prototype.Before = function(substr) {
	return this.substring(this.lastIndexOf(substr) + 1, this.length);
};
String.prototype.Exist = function(substr) {
	if (typeof this !== 'string') {
		return;
	}
	if (substr === '|*|') {
		return true;
	}
	for (let i = 0; i < substr.split(',').length; i++) {
		if (this.indexOf(substr.split(',')[i]) >= 0 === true) {
			return true;
		}
	}
	return false;
};
Date.prototype.format = function(fmt) {
	const o = {
		'y+': this.getFullYear(),
		'M+': this.getMonth() + 1,
		'd+': this.getDate(),
		'H+': this.getHours(),
		'm+': this.getMinutes(),
		's+': this.getSeconds(),
		'S+': this.getMilliseconds(),
		'q+': Math.floor(this.getMonth() / 3) + 1,
		'h+': (() => {
			const hour = this.getHours() % 12;
			return hour === 0 ? 12 : hour;
		})(),
		'E+': (() => {
			const week = {
				'0': 'Sunday',
				'1': 'Monday',
				'2': 'Tuesday',
				'3': 'Wednesday',
				'4': 'Thursday',
				'5': 'Friday',
				'6': 'Saturday'
			};
			return week[this.getDay() + ''];
		})(),
		/*
    "e+": (()=>{
        const week = {"0":"Sun","1":"Mon","2":"Tue","3":"Wed","4":"Thu","5":"Fri","6":"Sat"};
        return week[this.getDay()+""];
    })(),
    */
		x1: (() => {
			const week = {
				'0': '周日',
				'1': '周一',
				'2': '周二',
				'3': '周三',
				'4': '周四',
				'5': '周五',
				'6': '周六'
			};
			return week[this.getDay() + ''];
		})(),
		x2: (() => {
			const hour = ['凌晨', '早上', '下午', '晚上'];
			const h = this.getHours();
			if (h === 12) return '中午';
			return hour[parseInt(h / 6)];
		})()
	};
	for (let k in o) {
		if (new RegExp('(' + k + ')', 'g').test(fmt)) {
			const len = RegExp.$1.length;
			fmt = fmt.replace(RegExp.$1, len === 1 ? o[k] : ('00' + o[k]).substr(-len));
		}
	}
	return fmt;
};
JSON.handle = function(data) {
	return JSON.parse(JSON.stringify(data));
};

//引入electron接口
Vue.path = Vue.prototype.$path = path; //path接口
Vue.electron = Vue.prototype.$electron = electron; //electron
Vue.ipc = Vue.prototype.$ipc = ipcRenderer; //ipc接口
Vue.notify = Vue.prototype.$notify = (msg, name) => {
	const notification = {
		title: packageInfo.name || name,
		body: msg,
		icon: require('../assets/img/logo/logo.png')
	};
	return new window.Notification(notification.title, notification);
}; //通知接口
/**************************************************************自定义从这开始**************************************************************/
//引入iview组件
import {
	Checkbox,
	Tooltip,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Input,
	InputNumber,
	RadioGroup,
	Radio,
	Time,
	Select,
	Option,
	DatePicker,
	Message,
	Icon,
	Spin,
	Progress
} from 'iview';
import 'iview/dist/styles/iview.css';
import '../assets/css/iview.css'; //定制样式
Vue.component('Checkbox', Checkbox);
Vue.component('Tooltip', Tooltip);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('DropdownItem', DropdownItem);
Vue.component('Input', Input);
Vue.component('InputNumber', InputNumber);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Radio', Radio);
Vue.component('Time', Time);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('DatePicker', DatePicker);
Vue.component('Message', Message);
Vue.prototype.$Message = Message;
Vue.component('Icon', Icon);
Vue.component('Spin', Spin);
Vue.component('Progress', Progress);
Vue.prototype.$IVIEW = {};
//引入element的部分组件
import { MessageBox, Dialog } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.use(Dialog);
Vue.prototype.Confrim = options => {
	MessageBox.confirm(options.tips, options.title, {
		confirmButtonText: options.confirmButtonText || '确定',
		cancelButtonText: '取消',
		dangerouslyUseHTMLString: true,
		type: options.type || 'warning'
	})
		.then(() => {
			options.callback();
		})
		.catch(() => {});
};
Vue.prototype.InputConfrim = options => {
	MessageBox.prompt(options.tips, options.title, {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputValue: options.value || '',
		inputPattern: options.inputPattern || '',
		inputErrorMessage: options.inputErrorMessage || ''
	})
		.then(({ value }) => {
			options.callback(value);
		})
		.catch(() => {});
};
/*网盘*/
import Api from './api/index';
Vue.api = Vue.prototype.$Api = Api; //请求接口
