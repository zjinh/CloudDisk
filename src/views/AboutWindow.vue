<template>
	<div class="cloudSeries-about-win">
		<WindowsHeader :data="header" />
		<div class="cloudSeries-about-main">
			<div class="app-version">
				<div class="logo"></div>
				<span>Version{{ version }}</span>
				<span style="color: #E83C3C;">{{ NewVersion }}</span>
			</div>
			<div class="app-icon"></div>
			<div class="engine-info">
				<h4>核心版本{{ electron }}</h4>
				<ul>
					<li v-for="(item, index) in InfoList" :key="index">{{ index }}<span />{{ item }}</li>
				</ul>
			</div>
			<div class="update-info">
				<p class="tips">{{ message }}</p>
				<div class="process">
					<Progress :percent="percent" v-show="percent > 0" />
				</div>
			</div>
			<div class="bottom">
				<p class="release">©2020 CloudSeries_{{ name }} ZJINH</p>
				<button @click="checkUpdate" :disabled="percent > 0 && percent !== 100">
					<span v-if="!loading">{{ CheckText }}</span>
					<span v-else>{{ ProcessText }}</span>
				</button>
				<button @click="OpenLink">
					项目地址
				</button>
				<button @click="OpenLink2">
					博客
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import WindowsHeader from '../components/DiskWindow/WindowHeader';
const packageInfo = require('../../package');
export default {
	name: 'MusicAbout',
	data() {
		return {
			loading: false,
			CheckText: '检查更新',
			ProcessText: '正在检查',
			NewVersion: '',
			message: '',
			percent: 0,
			header: {
				color: '#666',
				title: '',
				resize: false,
				mini: false,
				close: () => {
					this.$electron.remote.getCurrentWindow().hide();
					return true;
				}
			},
			electron: ' ' + process.versions.electron,
			InfoList: {
				Author: 'ZJINH',
				Email: '2665229856@qq.com',
				Platform: process.platform + ' ' + process.arch,
				Vue: require('vue/package.json').version,
				Node: process.versions.node
			}
		};
	},
	components: { WindowsHeader },
	computed: {
		version() {
			return packageInfo.version;
		},
		name() {
			return packageInfo.name;
		}
	},
	created() {
		this.bind();
	},
	watch: {
		percent: {
			handler() {
				this.ProcessText = '正在下载';
			},
			deep: true
		}
	},
	methods: {
		bind() {
			this.$ipc.on('check-for-update', (event, message) => {
				this.message = message;
				if (message === '检查更新出错, 请联系开发人员' || message === '现在使用的就是最新版本，不用更新') {
					this.loading = false;
				}
				if (message === '最新版本已下载，点击安装进行更新') {
					this.CheckText = '安装';
					this.loading = false;
					this.percent = 100;
					this.checkUpdate = () => {
						this.$ipc.send('system', 'update');
					};
				}
			});
			this.$ipc.on('update-down-success', (event, message) => {
				this.NewVersion = 'New ' + message.version;
			});
			this.$ipc.on('download-progress', (event, message) => {
				this.$nextTick(() => {
					this.percent = parseInt(message.percent);
					if (this.percent === 100) {
						this.CheckText = '安装';
						this.loading = false;
						this.checkUpdate = () => {
							this.$ipc.send('system', 'update');
						};
					}
				});
			});
			window.onbeforeunload = () => {
				if (this.percent > 0 && this.percent !== 100) {
					return false;
				}
			};
		},
		checkUpdate() {
			this.$ipc.send('system', 'check-for-update', this.$Api.Public.updateServer());
			this.loading = true;
		},
		OpenLink() {
			this.$electron.shell.openExternal('https://github.com/zjinh/CloudDisk/');
		},
		OpenLink2() {
			this.$electron.shell.openExternal('https://blog.zjinh.cn/');
		}
	}
};
</script>

<style scoped>
/*关于信息窗口*/
.cloudSeries-about-win {
	width: 100%;
	height: 100%;
	-webkit-app-region: drag;
}
.cloudSeries-about-main {
	width: 100%;
	height: calc(100% - 50px);
	background: #fff;
	padding: 0 30px 20px;
	position: relative;
}
.app-version .logo {
	width: 140px;
	height: 45px;
	float: left;
	display: inline-block;
	vertical-align: bottom;
	font-size: 30px;
	color: #4c4c4c;
	font-family: 'Mistral';
	font-weight: bold;
	background: url('../assets/img/logo/c-disk.png');
	background-size: contain;
	background-repeat: no-repeat;
}
.app-version span {
	display: inline-block;
	vertical-align: bottom;
	font-size: 14px;
	margin: 0 10px;
	color: #4c4c4c;
	line-height: 45px;
}
.app-icon {
	background: transparent url('../assets/img/logo/logo.png');
	position: absolute;
	top: 10px;
	right: 40px;
	background-size: 100%;
	width: 80px;
	height: 80px;
	border-radius: 100%;
	box-shadow: 0 0 10px 0 #6e6e6e;
}
.engine-info {
	margin: 20px 35% 0 8px;
}
.engine-info h4 {
	font-size: 14px;
	font-weight: 400;
	color: #4c4c4c;
	padding: 15px 0;
}
.engine-info ul {
	font-size: 12px;
	color: #bdbdbd;
	list-style: none;
	padding: 0;
	line-height: 20px;
}
.engine-info ul li {
	float: left;
	width: 50%;
}
.engine-info ul li span {
	padding: 5px;
}
.update-info {
	width: 100%;
	padding: 10px 8px;
}
.update-info .tips {
	font-size: 14px;
	font-weight: 400;
	color: #4f4f4f;
}
.update-info .process {
	padding: 10px 0;
	height: 35px;
}
.cloudSeries-about-main .bottom {
	width: calc(100% - 60px);
	position: absolute;
	bottom: 0;
}
.bottom button {
	float: right;
	background: none;
	font-size: 12px;
	color: #333;
}
.cloudSeries-about-main .release {
	float: left;
	font-size: 12px;
	color: #4c4c4c;
}
.cloudSeries-about-main button {
	float: right;
	margin-left: 20px;
	overflow: hidden !important;
	-webkit-app-region: no-drag;
}
</style>
