<template>
	<div class="cd-pdf-window">
		<WindowsHeader :data="header" />
		<div class="cd-pdf-show-container">
			<iframe :src="src"></iframe>
		</div>
	</div>
</template>

<script>
import WindowsHeader from '../components/DiskWindow/WindowHeader';
export default {
	name: 'DiskPdfView',
	components: { WindowsHeader },
	data() {
		return {
			NowPlay: {
				disk_name: ''
			},
			src: null,
			header: {
				title: '',
				background: '#4f4f4f',
				color: '#fff'
			}
		};
	},
	created() {
		this.$ipc.on('win-data', (event, data) => {
			//接收打开pdf文件的数据
			this.$nextTick(() => {
				this.NowPlay.disk_name = data.disk_name;
				this.src = this.$path.join(__static, 'plugins/pdfjs/web/viewer.html?file=') + data.disk_main;
			});
			this.header.title = data.disk_name + '-PDF阅读器';
		});
	}
};
</script>

<style scoped>
/*pdf窗口*/
.cd-pdf-window {
	width: 100%;
	height: 100%;
	background: #4f4f4f;
}
.cd-pdf-show-container {
	width: 100%;
	height: calc(100% - 32px);
}
.cd-pdf-show-container iframe {
	width: 100%;
	height: 100%;
}
</style>
