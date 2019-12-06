<template>
	<div>
		<div
			v-for="(item, index) in data"
			:key="index"
			:class="DiskData.DiskShowState + (item.active ? ' active' : '')"
			ripple
			@mousedown="select(item, index)"
			@dblclick="OpenFile(item)"
		>
			<span class="icon">
				<img :src="itemIcon(item)" draggable="false" alt="" />
			</span>
			<p>{{ item.disk_name }}</p>
			<div class="time">{{ item.create_time || item.modify_time }}</div>
			<div class="time">{{ item.$size }}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DiskFile',
	props: {
		data: {
			type: Array
		},
		DiskData: {
			type: Object
		}
	},
	methods: {
		select(item, index) {
			this.$emit('SelectFiles', event, item, index);
		},
		OpenFile(item) {
			this.$emit('OpenFile', 'open', item);
		},
		itemIcon(item) {
			return require('../../assets/img/disk/' + item.$icon);
		}
	}
};
</script>

<style scoped>
/*文件图标视图*/
.cd-disk-block-file {
	width: 90px;
	height: 80px;
	float: left;
	margin: 10px 10px 0 0;
	text-align: center;
	border-radius: 3px;
	cursor: pointer;
}
.cd-disk-block-file .icon {
	font-size: 30px;
	width: 100%;
	height: 40px;
	line-height: 40px;
	margin-top: 5px;
	display: block;
}
.cd-disk-block-file .icon > img {
	height: 40px;
}
.cd-disk-block-file > p {
	color: #333333;
	text-overflow: ellipsis;
	word-break: break-all;
	font-size: 11px;
	width: 100%;
}
.cd-disk-block-file > .time {
	display: none;
}
/*文件列表视图*/
.cd-disk-list-file {
	width: 100%;
	height: 35px;
	padding-left: 5px;
	cursor: pointer;
	margin-top: 5px;
}
.cd-disk-list-file img {
	width: 20px;
	height: 20px;
}
.cd-disk-list-file > .icon,
.cd-disk-list-file > p {
	float: left;
	display: inline-block;
	height: 35px;
	line-height: 35px;
	margin-left: 5px;
	font-size: 12px;
}
.cd-disk-list-file > .ivu-checkbox-wrapper {
	float: left;
	margin-top: 8px;
	margin-right: 3px;
}
.cd-disk-list-file > .icon {
	padding-top: 5px;
}
.cd-disk-list-file p {
	width: calc(56% - 52px);
}
.cd-disk-list-file > .time {
	width: 22%;
	float: left;
	height: 100%;
	font-size: 12px;
	line-height: 35px;
	text-align: left;
	text-indent: 10px;
}
.cd-disk-block-file:hover,
.cd-disk-list-file:hover {
	background: #f4f5f7;
}
/*选中样式*/
.active {
	background: #ececec !important;
}
</style>
