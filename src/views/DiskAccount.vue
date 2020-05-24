<template>
	<div class="cd-user-main">
		<WindowsHeader :data="header" />
		<div class="cd-user-left">
			<div class="cd-user-right-info">
				<img draggable="false" :src="UploadSrc ? UploadSrc : User.userhead" alt="" />
				<p class="name">{{ User.username }}</p>
				<p class="age">{{ User.sex }},{{ User.birth }}岁</p>
			</div>
		</div>
		<div class="cd-user-right">
			<p class="cd-user-title">个人信息</p>
			<form @submit.prevent="onSubmit" ref="form">
				<div class="cd-user-line">
					<label>名称：</label>
					<p>{{ User.username }}</p>
				</div>
				<div class="cd-user-line">
					<label>邮箱：</label>
					<p>{{ User.email }}</p>
				</div>
				<div class="cd-user-line">
					<label>手机：</label>
					<Input :value="User.phone" clearable="" style="width: calc(100% - 50px)" name="phone" :number="true" :maxlength="11" />
				</div>
				<div class="cd-user-line">
					<label>生日：</label>
					<DatePicker type="date" style="width: calc(100% - 50px)" v-model="User.birthday" name="birth" />
				</div>
				<div class="cd-user-line">
					<label>性别：</label>
					<Select style="width: calc(100% - 50px)" v-model="User.sex" name="sex">
						<Option v-for="item in sexs" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</div>
				<div class="cd-user-head" onclick="this.childNodes[0].click()">
					<input type="file" name="userhead" @change="preview()" ref="file" />
				</div>
				<div class="cd-user-line" style="height: 72px;">
					<label>签名:</label>
					<textarea class="ivu-input" name="underwrite" v-model="User.underwrite" :maxlength="50" />
				</div>
				<button class="cd-purple-button" @click="update">更新</button>
				<button v-if="UploadSrc" class="cd-button cd-cancel-button" @click="clear">清空头像文件</button>
			</form>
		</div>
	</div>
</template>

<script>
import WindowsHeader from '../components/DiskWindow/WindowHeader';
export default {
	name: 'DiskAccount',
	components: { WindowsHeader },
	data() {
		return {
			User: {
				userhead: ''
			},
			UploadSrc: false,
			sexs: [
				{
					value: '男',
					label: '男'
				},
				{
					value: '女',
					label: '女'
				},
				{
					value: '保密',
					label: '保密'
				}
			],
			header: {
				title: '',
				resize: false
			}
		};
	},
	created() {
		this.$ipc.on('win-data', (event, data) => {
			//接收用户数据
			this.$nextTick(() => {
				this.User = data;
			});
		});
	},
	methods: {
		clear() {
			this.UploadSrc = false;
			this.$refs.file.value = '';
		},
		preview() {
			this.UploadSrc = false;
			let elm = event.target;
			let user_pic = elm.value;
			if (user_pic.length > 1 && user_pic) {
				let type = user_pic.Before('.').toLowerCase();
				if (!type.Exist('png,jpg,jpeg,bmp,gif')) {
					return this.$Message.error('所选格式为' + type + ' 请重新选择上传的文件');
				}
				elm.files && elm.files[0] ? (this.UploadSrc = window.URL.createObjectURL(elm.files[0])) : '';
			}
		},
		update() {
			let formdata = new FormData(this.$refs.form);
			this.$Api.User.Update(
				formdata,
				r => {
					if (r[0].state === 'success') {
						this.$Message.success('信息已更新');
						this.$ipc.send('system', 'user-update');
					} else {
						this.$Message.error('信息更新失败');
					}
					this.clear();
				},
				() => {
					this.$Message.error({
						content: '账号状态异常，请重新登录！',
						onClose: () => {
							this.$ipc.send('system', 'error');
						}
					});
				}
			);
			return false;
		},
		onSubmit() {
			return false;
		}
	}
};
</script>

<style scoped>
/*用户信息窗口*/
.cd-user-main {
	width: 100%;
	height: 100%;
	background: #fff;
}
.cd-user-left {
	float: left;
	width: 50%;
	height: 100%;
	background: url('../assets/img/login/right-bg.png');
	background-position: -60px 0;
	margin-top: -30px;
	background-size: cover;
	background-color: #4996ed;
}
.cd-user-right-info {
	width: 100%;
	height: 150px;
	text-align: center;
	margin-top: 135px;
}
.cd-user-right {
	float: left;
	width: 50%;
	height: 100%;
	background: #fff;
	padding: 0 20px 20px;
}
.cd-user-right-info img {
	width: 100px;
	height: 100px;
	border-radius: 100px;
	-webkit-border-radius: 100px;
	-moz-border-radius: 100px;
}
.cd-user-right-info img:hover {
	opacity: 0.5;
	cursor: pointer;
}
.cd-user-right name {
	color: #fff;
	font-size: 18px;
	font-weight: lighter;
}
.cd-user-right age {
	color: #a5a5a5;
	font-size: 13px;
}
.cd-user-title {
	width: 100%;
	font-size: 18px;
	border-bottom: 1px solid #d0d0d0;
	color: #2f2f2f;
}
.cd-user-line {
	width: 100%;
	height: 45px;
	line-height: 45px;
}
.cd-user-line label {
	float: left;
	width: 42px;
	font-size: 14px;
	height: 100%;
}
.cd-user-line textarea {
	width: calc(100% - 50px);
	height: 55px;
	margin-top: 8px;
	resize: none;
}
.cd-user-right button {
	float: right;
	margin-top: 10px;
	margin-right: 8px;
}
.cd-user-head {
	width: 100px;
	height: 100px;
	position: absolute;
	left: 118px;
	top: 135px;
	overflow: unset;
	border-radius: 100%;
	-webkit-transition: all 0.35s;
	-moz-transition: all 0.35s;
	-o-transition: all 0.35s;
}
.cd-user-head:hover {
	box-shadow: 0 0 29px -2px #a7a7a7;
	cursor: pointer;
	-webkit-transition: all 0.35s;
	-moz-transition: all 0.35s;
	-o-transition: all 0.35s;
}
.cd-user-head input {
	position: absolute;
	top: -50px;
	left: -11px;
	display: none;
}
</style>
