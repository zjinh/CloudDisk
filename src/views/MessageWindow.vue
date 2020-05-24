<template>
	<div :class="'cd-message-main ' + animation">
		<div class="shadow"></div>
		<div class="cd-message-main">
			<WindowHeader v-bind:data="confData"></WindowHeader>
			<div class="cd-message-container">
				<Icon type="ios-alert-outline" />
				<p>{{ MegData }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import WindowHeader from '../components/DiskWindow/WindowHeader';
export default {
	name: 'MessageWindow',
	components: {
		WindowHeader
	},
	data() {
		return {
			confData: {
				mini: false,
				resize: false,
				drag: true,
				background: '#5656de',
				color: '#fff',
				title: 'CloudDisk-通知'
			},
			MegData: '',
			animation: '',
			TimeOut: null,
			TimeOut2: null
		};
	},
	created() {
		this.bind();
	},
	methods: {
		bind() {
			this.$ipc.on('win-data', (e, msg) => {
				this.$nextTick(() => {
					this.MegData = msg;
					this.animation = 'animated slideInUp';
					clearTimeout(this.TimeOut);
					this.TimeOut = setTimeout(() => {
						this.animation = 'animated slideOutDown';
						clearTimeout(this.TimeOut);
						clearTimeout(this.TimeOut2);
						this.TimeOut2 = setTimeout(() => {
							this.$electron.remote.getCurrentWindow().hide();
							clearTimeout(this.TimeOut2);
						}, 500);
					}, 5000);
				});
			});
		}
	}
};
</script>

<style scoped>
/*消息弹窗*/
.cd-message-main {
	width: 100%;
	height: 100%;
	background: #fff;
}
.cd-message-container {
	padding: 10px;
}
.cd-message-container i {
	float: left;
	font-size: 30px;
}
.cd-message-container p {
	float: left;
	font-size: 14.5px;
	line-height: 1.6;
	width: calc(100% - 30px);
	word-break: break-all;
	text-overflow: ellipsis;
	-webkit-line-clamp: 4;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	padding-left: 10px;
}
</style>
