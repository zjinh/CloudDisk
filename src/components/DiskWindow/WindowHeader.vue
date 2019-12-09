<template>
	<div
		class="cd-drag-head"
		:style="{
			'margin-top': data.resize && ButtonState === 'sf-icon-window-maximize' ? '2px' : '0',
			color: data.color ? data.color : '#333',
			background: data.background ? data.background : ''
		}"
	>
		<p v-show="data.head !== undefined ? data.head : true">{{ data.title }}</p>
		<ul class="window-actions">
			<li class="sf-icon-minus" v-show="data.mini === undefined ? true : data.mini" @click="mini" />
			<li :class="ButtonState" v-show="data.resize === undefined ? true : data.resize" @click="restore" />
			<li class="sf-icon-times" style="font-size:16px" @click="close" />
		</ul>
	</div>
</template>

<script>
export default {
	name: 'cd-drag-head',
	props: {
		data: {
			type: Object
		}
	},
	watch: {
		data: {
			handler() {
				this.win.setTitle(this.data.title);
			},
			deep: true
		}
	},
	data() {
		return {
			ButtonState: 'sf-icon-window-maximize',
			win: false
		};
	},
	created() {
		this.win = this.$electron.remote.getCurrentWindow();
		this.bind();
		this.data.resize = this.data.resize === undefined ? true : this.data.resize;
		window.addEventListener(
			'dragenter',
			function(e) {
				e.preventDefault();
			},
			false
		);
		window.addEventListener(
			'dragover',
			function(e) {
				e.preventDefault();
			},
			false
		);
		window.addEventListener(
			'dragleave',
			function(e) {
				e.preventDefault();
			},
			false
		);
		window.addEventListener(
			'drop',
			function(e) {
				e.preventDefault();
			},
			false
		);
	},
	methods: {
		bind() {
			this.win.on('maximize', () => {
				this.ButtonState = 'sf-icon-window-restore';
			});
			this.win.on('unmaximize', () => {
				this.ButtonState = 'sf-icon-window-maximize';
			});
		},
		mini() {
			this.win.minimize();
		},
		close() {
			(this.data.close && this.data.close()) || this.win.close();
		},
		restore() {
			if (this.win.isMaximized()) {
				this.win.restore();
			} else {
				this.win.maximize();
			}
		}
	}
};
</script>

<style scoped>
/*统一拖拽头部*/
.cd-drag-head {
	width: 100%;
	height: 30px;
	-webkit-app-region: drag;
	position: relative;
	z-index: 2;
}
.cd-drag-head p {
	float: left;
	font-size: 13px;
	line-height: 30px;
	text-indent: 5px;
	max-width: calc(100% - 120px);
	text-overflow: ellipsis;
	word-wrap: normal;
	word-break: break-all;
}
/*窗体操作*/
.window-actions {
	float: right !important;
	text-align: center;
	padding: 0 5px;
	position: absolute;
	top: 0;
	right: 0;
	-webkit-transition: all 0.35s;
	-moz-transition: all 0.35s;
	-o-transition: all 0.35s;
}
.window-actions li {
	float: left;
	width: 32px;
	height: 28px;
	margin-left: 5px;
	line-height: 28px;
	font-size: 12px;
	-webkit-app-region: no-drag;
	cursor: pointer;
}
.window-actions li:hover {
	background: rgba(0, 0, 0, 0.1);
}
</style>
