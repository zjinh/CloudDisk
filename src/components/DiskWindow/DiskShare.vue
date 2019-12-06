<template>
	<div class="cd-share-main">
		<div v-show="!ShareResult.success">
			<ul>
				<li :class="ShareType.public ? 'active' : ''" @click="SwitchShare('public')">公开分享</li>
				<li :class="ShareType.classify ? 'active' : ''" @click="SwitchShare('classify')">加密分享</li>
			</ul>
			<div class="cd-share-tips" v-show="ShareType.public">
				<p>任何人查看链接即可查看、保存</p>
			</div>
			<div class="cd-share-tips" v-show="ShareType.classify">
				<p>输入密码才能查看、更安全</p>
			</div>
		</div>
		<div v-show="ShareResult.success">
			<div class="cd-share-title">分享链接已生成，快复制给好友吧</div>
			<div class="cd-share-box">
				<span>链接：</span>
				<input type="text" style="width: 278px" :value="ShareResult.address" readonly />
				<input type="text" :value="ShareResult.Copy" ref="CopyResult" tabindex="-1" />
			</div>
			<div class="cd-share-box">
				<span v-show="ShareType.classify && ShareResult.pass.length">密码：</span>
				<input type="text" style="width: 125px;" v-show="ShareType.classify && ShareResult.pass.length" :value="ShareResult.pass" readonly />
				<button v-show="ShareType.classify && ShareResult.pass.length" @click="CopyAddress">复制链接及密码</button>
				<button v-show="ShareType.public || !ShareResult.pass.length" @click="CopyAddress">复制链接</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DiskShare',
	data() {
		return {
			ShareType: {
				public: true,
				classify: false
			},
			ShareResult: {
				pass: '',
				address: '',
				Copy: '',
				success: false
			}
		};
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.ShareType = {
				public: true,
				classify: false
			};
			this.ShareResult = {
				pass: '',
				address: '',
				Copy: '',
				success: false
			};
		},
		SwitchShare(type) {
			for (let i in this.ShareType) {
				this.ShareType[i] = false;
			}
			this.ShareType[type] = true;
		},
		ShareFile(item) {
			let ShareType = 0;
			if (this.ShareType.public) {
				ShareType = 1;
			} else {
				ShareType = 2;
			}
			if (this.ShareResult.success) {
				return this.$emit('close');
			}
			this.$Api.Disk.Share(
				{
					shareType: ShareType,
					id: item.disk_id
				},
				rs => {
					if (!rs[0]) {
						this.$Message.error('分享失败，请稍后重试');
						return;
					}
					this.$nextTick(() => {
						this.ShareResult.success = true;
						if (rs[0].share) {
							this.$Message.warning('该资源已经分享,请不要重复分享');
						}
						this.ShareResult.address = localStorage.server + '/s/' + rs[0].addres;
						this.ShareResult.Copy = '链接：' + this.ShareResult.address;
						if (rs[0].password) {
							this.SwitchShare('classify');
							this.ShareResult.pass = rs[0].password;
							this.ShareResult.Copy = '链接：' + this.ShareResult.address + ',密码：' + this.ShareResult.pass;
						}
						if (rs[0].state === 'success') {
							this.$Message.success('分享链接已生成，复制给好友吧');
							this.$emit('callback', 'update-share', rs[0].addres);
						}
					});
				}
			);
		},
		CopyAddress() {
			this.$refs.CopyResult.select();
			document.execCommand('copy');
		}
	}
};
</script>

<style scoped>
/*分享窗口*/
.cd-share-main {
	width: 100%;
	height: 100%;
}
.cd-share-main ul {
	width: 100%;
	height: 35px;
}
.cd-share-main ul > li {
	width: 50%;
	float: left;
	height: 35px;
	line-height: 33px;
	text-align: center;
	cursor: pointer;
}
.cd-share-box {
	width: 100%;
	height: 40px;
	line-height: 40px;
	margin-bottom: 10px;
}
.cd-share-box * {
	float: left;
}
.cd-share-box input {
	border: 1px solid #eee;
	height: 32px;
	padding: 0 10px;
	margin-top: 4px;
	border-radius: 3px;
}
.cd-share-box input:focus {
	border: 1px solid #5b5bea;
}
.cd-share-box button {
	float: right;
	height: 32px;
	background: #5b5bea;
	color: #fff;
	margin-top: 4px;
	line-height: 32px;
	padding: 0 10px;
	border-radius: 3px;
}
.active {
	border-bottom: 2px solid #5b5bea;
}
.cd-share-tips {
	width: 100%;
	height: 60px;
	background: #f4f5f7;
	margin-top: 10px;
	border-radius: 5px;
}
.cd-share-main p {
	font-size: 14px;
	line-height: 60px;
	text-indent: 20px;
}
.cd-share-title {
	font-size: 14px;
	padding-bottom: 5px;
}
</style>
