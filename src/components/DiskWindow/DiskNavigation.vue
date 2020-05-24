<template>
	<div class="cd-disk-nav">
		<div v-show="data.Type !== 'trans'" style="float: left;">
			<button class="sf-icon-chevron-left" @click="NavControl('back')" :disabled="data.NavData.length === 0" />
			<button class="sf-icon-home" @click="NavControl('home')" style="font-size: 15px;" />
			<button :class="'sf-icon-redo' + (!loading ? ' sf-spin' : '')" @click="NavControl('reload')" />
			<span class="line" />
		</div>
		<div class="container">
			<div class="cd-disk-nav-item" @click="NavControl('home')">{{ data.ClassifyName }}/</div>
			<div v-for="(item, index) in data.NavData" :key="index" class="cd-disk-nav-item" @click="NavControl(item)">
				{{ item.disk_name }}
				<span>/</span>
			</div>
		</div>
		<ul class="cd-right-head-actions" v-show="data.Type !== 'trans'">
			<input
				type="text"
				placeholder="搜索"
				v-model="SearchKey"
				@keyup.enter.native="SwitchSearch"
				:style="ShowSearch ? { width: '170px', border: '1px solid #eee' } : ''"
			/>
			<button class="sf-icon-search" @click="SwitchSearch" v-show="data.Type === 'disk'" />
			<button :class="'sf-icon-sort-amount-' + AmountSort" @click="ChangeSort('alpha', 'disk_name')" />
			<button :class="DiskStateIcon" @click="ChangeState" />
		</ul>
	</div>
</template>

<script>
export default {
	name: 'DiskNavigation',
	props: {
		data: {
			type: Object
		},
		loading: {
			type: Boolean
		},
		hide: {
			type: Boolean
		}
	},
	watch: {
		hide: {
			handler() {
				if (this.hide) {
					this.ShowSearch = !this.hide;
				}
			},
			deep: true
		}
	},
	data() {
		return {
			DiskShowState: 'cd-disk-block-file', //网盘文件显示状态
			DiskStateIcon: 'sf-icon-th-large', //文件显示状态类型,
			ShowSearch: false, //搜索框打开关闭
			SearchKey: '', //搜索关键词,
			AmountSort: 'up'
		};
	},
	methods: {
		NavControl(commend) {
			//回调函数
			this.$emit('callback', commend);
		},
		SwitchSearch() {
			//搜索有问题
			if (this.ShowSearch === false) {
				this.ShowSearch = true;
			} else if (this.SearchKey.length && this.ShowSearch) {
				this.$emit('feature', 'search', this.SearchKey, true);
			} else {
				this.ShowSearch = false;
			}
		},
		ChangeSort(type, key) {
			this.AmountSort === 'up' ? (this.AmountSort = 'down') : (this.AmountSort = 'up');
			this.$emit('feature', 'sort', type, key);
		},
		ChangeState() {
			this.DiskShowState === 'cd-disk-block-file' ? (this.DiskShowState = 'cd-disk-list-file') : (this.DiskShowState = 'cd-disk-block-file');
			this.DiskStateIcon === 'sf-icon-th-large' ? (this.DiskStateIcon = 'sf-icon-list-ul') : (this.DiskStateIcon = 'sf-icon-th-large');
			this.$emit('feature', 'state', this.DiskShowState);
		}
	}
};
</script>

<style scoped>
.cd-disk-nav {
	width: calc(100% - 30px);
	height: 35px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	margin: 0 auto;
	position: relative;
	margin: 0 15px;
}
.cd-disk-nav button {
	float: left;
	width: 35px;
	height: 35px;
	line-height: 35px;
	text-align: center;
	color: #6d6d6d;
	font-size: 13px;
	background: none;
	z-index: 2;
}
.cd-disk-nav button:hover,
.cd-disk-nav-item:hover {
	color: #5b5bea;
}
.cd-disk-nav .container {
	float: left;
	width: calc(100% - 212px);
	height: 35px;
	padding: 0 10px;
}
.cd-disk-nav-item {
	float: left;
	height: 35px;
	line-height: 35px;
	color: #757575;
	max-width: 80px;
	font-size: 14px;
	text-overflow: ellipsis;
	cursor: pointer;
}
.line {
	float: left;
	margin-top: 5px;
	width: 1.5px;
	background: #d0d0d0;
	height: 25px;
}
/*网盘操作*/
.cd-right-head-actions {
	float: right;
}
.cd-right-head-actions input {
	width: 0;
	height: 30px;
	position: absolute;
	top: 3px;
	right: 70px;
	z-index: 1;
	text-indent: 10px;
	color: #4f4f4f;
	padding-right: 40px;
	border-radius: 20px !important;
}
.cd-right-head-actions input:focus {
	border-color: #5b5bea !important;
	-webkit-box-shadow: 0 0 0 2px rgba(91, 91, 234, 0.2) !important;
	box-shadow: 0 0 0 2px rgba(91, 91, 234, 0.2) !important;
}
</style>
