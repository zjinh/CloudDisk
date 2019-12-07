<template>
	<ul class="cd-task-container">
		<li class="task-item" v-for="(item, index) in data" :key="index" v-show="item.shows">
			<div class="task-name">
				<span>{{ taskTips(item) }}&nbsp;&nbsp;{{ item.name }}</span>
			</div>
			<div class="task-actions">
				<i :class="ControlButton(item.state)" v-show="item.state !== 'completed'" @click="ControlTrans(item, index)" style="font-size: 14px" />
				<i class="sf-icon-times" v-show="item.state !== 'completed'" @click="ControlTrans(item, index)" />
				<i class="sf-icon-trash-alt" v-show="item.state === 'completed'" @click="ControlTrans(item, index)" />
				<i class="sf-icon-folder" v-show="item.trans_type === 'download'" @click="OpenDownPath(item)" />
				<i class="sf-icon-link" v-show="item.trans_type === 'download'" @click="CopyLink(item)" />
			</div>
			<div class="task-progress">
				<Progress :percent="PercentCount(item)" :status="item.state === 'progressing' ? 'active' : 'normal'" :stroke-width="6" />
			</div>
			<div class="task-speed">
				{{ $Api.Disk.FileSize(item.chunk) }}/{{ $Api.Disk.FileSize(item.size) }}
				<span v-show="item.state === 'progressing'">{{ MathSpeend(item) }}</span>
			</div>
		</li>
	</ul>
</template>

<script>
export default {
	name: 'DiskTransList',
	props: {
		data: {
			Array
		}
	},
	methods: {
		ControlTrans(item, index) {
			this.$emit('ControlTrans', item, index);
		},
		/**
		 * @return {number}
		 */
		PercentCount(item) {
			return parseFloat(((item.chunk / item.size) * 100).toFixed(1));
		},
		OpenDownPath(item) {
			this.$electron.shell.showItemInFolder(item.path);
		},
		taskTips(item) {
			let tips = '正在开始';
			if (item.state === 'progressing') {
				tips = '正在' + (item.trans_type === 'upload' ? '上传' : '下载');
			} else if (item.state === 'completed') {
				tips = (item.trans_type === 'upload' ? '上传' : '下载') + '完成';
			} else if (item.state === 'interrupted') {
				tips = '已暂停';
			}
			return tips;
		},
		formatSeconds(value) {
			let secondTime = parseInt(value); // 秒
			let minuteTime = 0; // 分
			let hourTime = 0; // 小时
			if (secondTime > 60) {
				//如果秒数大于60，将秒数转换成整数
				//获取分钟，除以60取整数，得到整数分钟
				minuteTime = parseInt(secondTime / 60);
				//获取秒数，秒数取佘，得到整数秒数
				secondTime = parseInt(secondTime % 60);
				//如果分钟大于60，将分钟转换成小时
				if (minuteTime > 60) {
					//获取小时，获取分钟除以60，得到整数小时
					hourTime = parseInt(minuteTime / 60);
					//获取小时后取佘的分，获取分钟除以60取佘的分
					minuteTime = parseInt(minuteTime % 60);
				}
			}
			let result = '' + parseInt(secondTime) + '秒';
			if (minuteTime > 0) {
				result = '' + parseInt(minuteTime) + '分' + result;
			}
			if (hourTime > 0) {
				result = '' + parseInt(hourTime) + '小时' + result;
			}
			return result;
		},
		MathSpeend(item) {
			let NowTime = new Date().getTime() / 1000;
			let time = NowTime - item.time;
			let speed = parseFloat(item.chunk / time).toFixed(1);
			let remaining_chunk = item.size - item.chunk;
			let remaining_time = remaining_chunk / speed;
			return this.$Api.Disk.FileSize(speed) + '/s  剩余时间:' + this.formatSeconds(remaining_time);
		},
		ControlButton(state) {
			let btn = '';
			if (state === 'interrupted') {
				btn = 'ivu-icon ivu-icon-ios-play';
			} else if (state === 'progressing') {
				btn = 'ivu-icon ivu-icon-ios-pause';
			} else if (state === 'completed') {
				btn = 'sf-icon-trash';
			}
			return btn;
		},
		CopyLink(item) {
			this.$electron.clipboard.writeText(item.url[0]);
			this.$Message.info('链接已复制');
		}
	}
};
</script>

<style scoped>
/*传输列表*/
.cd-task-container {
	width: 100%;
	height: calc(100% - 20px);
	margin-top: 20px;
	overflow: auto;
}
.task-item {
	position: relative;
	padding: 16px 12px;
	border: 1px solid #ccc;
	border-radius: 6px;
	margin-bottom: 16px;
	transition: border-color 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.task-item:hover {
	border-color: #5b5bea;
}
.task-item .task-name {
	color: #505753;
	margin-bottom: 20px;
	margin-right: 240px;
	word-break: break-all;
}
.task-item .task-name span {
	font-size: 14px;
	line-height: 26px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.task-item .task-actions {
	position: absolute;
	top: 16px;
	right: 12px;
	height: 24px;
	padding: 0 10px;
	overflow: hidden;
	user-select: none;
	cursor: default;
	text-align: right;
	direction: rtl;
	border: 1px solid #f5f5f5;
	color: #9b9b9b;
	background-color: #fff;
	border-radius: 14px;
	transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.task-item .task-actions:hover {
	border-color: #5b5bea;
	color: #fff;
	background-color: #5b5bea;
	width: auto;
}
.task-item .task-actions > i {
	float: left;
	display: inline-block;
	padding: 5px;
	margin: 0 4px;
	font-size: 12px;
	cursor: pointer;
	line-height: 15px;
}
.task-item .task-speed {
	font-size: 12px;
	line-height: 14px;
	min-height: 14px;
	color: #9b9b9b;
	margin-top: 8px;
}
.task-item .task-speed > span {
	float: right;
}
</style>
