<template>
	<ul class="cd-sort-bar" v-show="show">
		<li
			v-for="(item, index) in SortData"
			:key="index"
			:class="'item sf-icon-sort-' + item.value + '-' + item.type"
			@click="DiskSort(item)"
			ripple
			:style="{ width: item.width || '' }"
		>
			{{ item.name }}
		</li>
	</ul>
</template>

<script>
export default {
	name: 'DiskSortBar',
	props: {
		show: {
			type: Boolean
		},
		DiskData: {
			type: Array
		}
	},
	data() {
		return {
			/*排序参数*/
			SortData: [
				{ name: '文件名', value: 'alpha', key: 'disk_name', type: 'up', width: '53%' },
				{ name: '修改日期', value: 'numeric', key: 'create_time', type: 'up' },
				{ name: '大小', value: 'numeric', key: 'disk_size', type: 'up', width: '25%' }
			]
		};
	},
	methods: {
		ArraySort(array, key, type) {
			let temp, unfix;
			for (unfix = array.length - 1; unfix > 0; unfix--) {
				for (let i = 0; i < unfix; i++) {
					if (array[i][key] < array[i + 1][key] && type === 'down') {
						temp = array[i];
						array.splice(i, 1, array[i + 1]);
						array.splice(i + 1, 1, temp);
					} else if (array[i][key] > array[i + 1][key] && type !== 'down') {
						temp = array[i];
						array.splice(i, 1, array[i + 1]);
						array.splice(i + 1, 1, temp);
					}
				}
			}
			return array;
		},
		DiskSort(item) {
			if (typeof item === 'string') {
				//给网盘工具栏调用时使用
				item = this.SortData[0];
			}
			if (this.DiskData.length) {
				item.type === 'up' ? (item.type = 'down') : (item.type = 'up');
				let data = this.ArraySort(this.DiskData, item.key, item.type);
				this.$emit('callback', 'sort', data);
			}
		}
	}
};
</script>

<style scoped>
/*顶部排序*/
.cd-sort-bar {
	width: 95%;
	height: 32px;
	margin: 2px auto;
}
.cd-sort-bar .item {
	height: 32px;
	line-height: 32px;
	color: #424e67;
	width: calc(23% - 10px);
	text-align: left;
	cursor: pointer;
	text-indent: 10px;
}
.cd-sort-bar .item:active {
	background: #e6e3e3;
}
</style>
