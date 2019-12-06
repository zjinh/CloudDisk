<template>
	<div class="cd-main FileContent">
		<WindowsHeader :data="header" style="border-bottom: 2px solid #6ce26c;" />
		<div class="cd-file-show-container">
			<iframe :src="LoadUrl"></iframe>
		</div>
	</div>
</template>

<script>
import WindowsHeader from '../components/DiskWindow/WindowHeader';
export default {
	name: 'DiskFileContent',
	components: { WindowsHeader },
	data() {
		return {
			NowLoad: {
				disk_name: '',
				content: ''
			},
			LoadUrl: '',
			header: {
				title: ''
			}
		};
	},
	created() {
		this.$ipc.on('win-data', (event, data) => {
			//接收打开文本文件的数据
			console.log(data);
			this.$nextTick(() => {
				this.NowLoad = data;
				this.header.title = data.disk_name + ' 文件查看';
				this.LoadUrl =
					this.$path.join(__static, 'plugins/syntaxhighlighter/index.html?id=') +
					data.disk_id +
					'&type=' +
					data.type +
					'&server=' +
					this.$Api.Public.severAddress();
			});
		});
	}
};
</script>

<style scoped>
/*文件查看窗口*/
.cd-file-show-container {
	width: 100%;
	height: calc(100% - 30px);
}
.cd-file-show-container iframe {
	overflow: auto;
}
</style>
