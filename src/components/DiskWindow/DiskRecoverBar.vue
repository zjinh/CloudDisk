<template>
	<div class="cd-trash-tip" v-show="show">
		<p><i class="sf-icon-info-circle" /> 回收站仍然占用网盘空间，文件保存10天后将被自动清除</p>
		<button :disabled="disabled" @click="CleanRecover">清空</button>
	</div>
</template>

<script>
export default {
	name: 'DiskRecoverBar',
	props: {
		show: {
			type: Boolean
		},
		disabled: {
			type: Boolean
		}
	},
	methods: {
		CleanRecover() {
			this.Confrim({
				title: '清空回收站',
				tips: '该操作将清空回收站且不可恢复,是否继续',
				callback: () => {
					this.$Message.info('正在清空回收站');
					this.$Api.Disk.Delete(
						{
							id: ''
						},
						rs => {
							rs = rs[0];
							if (rs.state === 'success') {
								this.$Message.success('回收站已清空');
								if (this.show) {
									this.$emit('callback');
								}
							} else {
								this.$Message.error('回收站清空失败');
							}
						}
					);
				}
			});
		}
	}
};
</script>

<style scoped>
/*回收站提示*/
.cd-trash-tip {
	width: 95%;
	height: 30px;
	margin: 2px auto;
}
.cd-trash-tip * {
	float: left;
	line-height: 30px;
}
.cd-trash-tip p {
	display: block;
	font-size: 12px;
	text-indent: 10px;
	color: #848484;
}
.cd-trash-tip i {
	font-size: 14px;
}
.cd-trash-tip button {
	float: right;
	padding: 0 15px;
	height: 30px;
	background: #f5491f;
	color: #fff;
	border-radius: 3px;
}
</style>
