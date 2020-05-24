<template>
	<div class="cd-disk-info-main" @keyup.stop.esc="close" tabindex="-1">
		<WindowsHeader :data="header" />
		<div class="cd-disk-info-head">
			<img draggable="false" :src="DiskData.$icon" alt="" />
			<span>{{ DiskData.disk_name }}</span>
		</div>
		<div class="cd-disk-info-item">
			<span>文件类型:</span>
			<div>{{ DiskData.disk_type === 'folder' ? '文件夹' : '.' + DiskData.type + '文件' }}</div>
		</div>
		<div class="cd-disk-info-item">
			<span>文件位置:</span>
			<div ref="address">{{ DiskData.address }}</div>
		</div>
		<div class="cd-disk-info-line"></div>
		<div class="cd-disk-info-item">
			<span>文件大小:</span>
			<div>{{ DiskData.$size }} ({{ DiskData.disk_size }}字节)</div>
		</div>
		<div class="cd-disk-info-item">
			<span>创建时间:</span>
			<div>{{ DiskData.create_time }}</div>
		</div>
		<div class="cd-disk-info-item">
			<span>修改时间:</span>
			<div>{{ DiskData.modify_time }}</div>
		</div>
		<div class="cd-disk-info-line"></div>
		<div class="cd-disk-info-item">
			<span>唯一标识:</span>
			<div>{{ DiskData.disk_id }}</div>
		</div>
		<div class="cd-disk-info-item">
			<span>文件分享:</span>
			<input v-show="DiskData.share.length" :value="DiskData.shareAddress" @focus="copy" type="text" />
			<button v-show="DiskData.share" @click="copy">复制</button>
			<div v-if="!DiskData.share">未分享</div>
		</div>
		<div class="cd-disk-info-line"></div>
		<div class="cd-disk-info-item" style="position: absolute;bottom: 15px;right:-30px;">
			<button class="cd-cancel-button" @click="close">关闭</button>
		</div>
	</div>
</template>

<script>
import WindowsHeader from '../components/DiskWindow/WindowHeader';
export default {
	name: 'DiskInfo',
	components: {
		WindowsHeader
	},
	data() {
		return {
			DiskData: {
				address: '',
				create_time: '',
				disk_id: '',
				disk_main: '',
				disk_name: '',
				disk_realname: '',
				disk_size: '',
				disk_type: '',
				icon: '',
				modify_time: '',
				parent_id: '',
				share: '',
				size: '',
				type: ''
			},
			header: {
				title: '',
				resize: false,
				mini: false
			},
			window: false
		};
	},
	created() {
		this.window = this.$electron.remote.getCurrentWindow();
		this.$ipc.on('win-data', (event, data) => {
			//接收打开文件的数据
			this.DiskData = data;
			this.header.title = data.disk_name + ' 属性';
			this.window.setTitle(data.disk_name + ' 属性');
			this.$Api.Disk.Address(data.disk_id, rs => {
				this.$refs.address.innerHTML = '我的网盘' + rs;
				this.$nextTick(() => {
					this.DiskData.address = '我的网盘' + rs;
				});
			});
		});
	},
	methods: {
		copy() {
			this.$electron.clipboard.writeText(localStorage.server + '/s/' + this.DiskData.share);
		},
		close() {
			this.window.close();
		}
	}
};
</script>

<style scoped>
/*文件属性窗口*/
.cd-disk-info-main {
	width: 100%;
	height: 100%;
	background: #fff;
	color: #000;
	-webkit-app-region: drag;
	box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
	border: 1px solid #efefef;
}
.cd-disk-info-head {
	height: 56px;
	border-bottom: 1px solid #ccc;
	padding: 10px;
}
.cd-disk-info-head img {
	width: 35px;
}
.cd-disk-info-head * {
	display: inline-block;
	float: left;
	line-height: 35px;
	text-indent: 10px;
	text-overflow: ellipsis;
}
.cd-disk-info-head span {
	width: calc(100% - 60px);
	font-size: 16px;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.cd-disk-info-item {
	width: 100%;
	padding: 0 50px;
	font-size: 14px;
	line-height: 32px;
}
.cd-disk-info-item span {
	float: left;
	height: 30px;
	display: block;
	font-size: 14px;
	font-weight: 600;
}
.cd-disk-info-item div {
	float: left;
	width: calc(100% - 105px);
	height: 30px;
	line-height: 20px;
	padding-top: 6px;
	padding-left: 10px;
	color: #2d2d2d;
	text-overflow: ellipsis;
	white-space: normal;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
}
.cd-disk-info-item input {
	width: calc(100% - 160px);
	height: 29px;
	border-radius: 0;
	margin-left: 10px;
	-webkit-app-region: no-drag;
}
.cd-disk-info-item input::selection {
	color: #5b5bea !important;
	background-color: #eaecf0;
}
.cd-disk-info-item button {
	float: right;
	background: none;
	height: 30px;
	line-height: 30px;
	padding: 0 10px;
	-webkit-app-region: no-drag;
	color: #5b5bea;
}
.cd-disk-info-line {
	width: calc(100% - 88px);
	height: 1px;
	background: #eaecf0;
	margin: 5px auto;
}
</style>
