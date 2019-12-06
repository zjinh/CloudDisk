<template>
	<div class="cd-feedback-win">
		<WindowsHeader :data="header" />
		<div class="cd-about-main">
			<div class="app-version">
				<div class="logo"></div>
				<span>Version&nbsp;&nbsp;{{ version }}</span>
			</div>
			<div class="cd-feedback-main">
				<p>我们需要以下信息进行问题反馈</p>
				<input v-model="FeedBackTitle" placeholder="简单的描述下问题" />
				<textarea v-model="FeedBackContent" placeholder="尽量详细的描述遇到的问题" />
			</div>
			<div class="bottom">
				<p class="release">©2019 CloudDisk ZJINH</p>
				<button class="cd-cancel-button" :disabled="loading" @click="FeedBack">提交</button>
			</div>
		</div>
	</div>
</template>

<script>
const packageInfo = require('../../package');
import WindowsHeader from '../components/DiskWindow/WindowHeader';
export default {
	name: 'DiskFeedBack',
	components: { WindowsHeader },
	data() {
		return {
			loading: false,
			FeedBackTitle: '',
			FeedBackContent: '',
			header: {
				color: '#666',
				title: '',
				resize: false,
				mini: false
			}
		};
	},
	computed: {
		version() {
			return packageInfo.version;
		}
	},
	methods: {
		FeedBack() {
			if (!this.FeedBackTitle.length) {
				this.$Message.warning('请先简单描述下问题');
				return;
			}
			if (!this.FeedBackContent.length) {
				this.$Message.warning('详细描述问题不能是空的');
				return;
			}
			this.loading = true;
			this.$Api.User.FeedBack(
				{
					report_title: this.FeedBackTitle,
					report_content: this.FeedBackContent
				},
				rs => {
					this.loading = false;
					rs = rs[0];
					if (!rs) {
						this.$Message.error('服务器错误');
						return;
					}
					this.$Message[rs.state](rs.msg);
					if (rs.state === 'success') {
						this.$Message.info({
							content: '感谢您的反馈',
							onClose: () => {
								this.close();
							}
						});
						this.$nextTick(() => {
							this.FeedBackTitle = '';
							this.FeedBackContent = '';
						});
					}
				}
			);
		},
		close() {
			this.$electron.remote.getCurrentWindow().close();
		}
	}
};
</script>

<style scoped>
/*反馈窗口*/
.cd-feedback-win {
	width: 100%;
	height: 100%;
	-webkit-app-region: drag;
}
.cd-about-main {
	width: 100%;
	height: calc(100% - 50px);
	background: #fff;
	padding: 0 20px;
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
	background: url(../assets/img/logo/c-disk.png);
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
.cd-feedback-main {
	height: calc(100% - 50px);
	background: #fff;
}
.cd-feedback-main p {
	font-size: 14px;
	color: #4f4f4f;
	margin-bottom: 10px;
}
.cd-feedback-main input,
.cd-feedback-main textarea {
	width: 100%;
	-webkit-app-region: no-drag;
	height: 32px;
	border-radius: 3px;
	border: 1px solid #eee;
	padding: 0 5px;
	margin-bottom: 15px;
}
.cd-feedback-main textarea {
	padding: 5px;
	height: 110px;
	resize: none;
}
.cd-feedback-main input:focus,
.cd-feedback-main textarea:focus {
	border-color: #7c7cee;
	outline: 0;
	box-shadow: 0 0 0 2px rgba(91, 91, 234, 0.2);
}
.cd-about-main .bottom {
	width: calc(100% - 60px);
	position: absolute;
	bottom: 0;
}
.cd-about-main .release {
	float: left;
	font-size: 12px;
	color: #4c4c4c;
}
.cd-about-main button {
	float: right;
	margin-left: 20px;
	overflow: hidden !important;
	-webkit-app-region: no-drag;
}
</style>
