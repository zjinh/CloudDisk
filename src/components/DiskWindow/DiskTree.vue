<template>
	<div>
		<ul class="cd-tree-container" v-for="(item, index) in DiskTreeData ? DiskTreeData : UserDiskTreeData" :key="index">
			<div :class="item.disk_name === '全部文件' ? 'cd-tree-folder-container' : 'cd-tree-folder-container cd-tree-child-f'">
				<li class="cd-tree" @dblclick.stop="ToggleDiskTree(item, index)" @mousedown="SelectTree(item)">
					<Icon v-if="!item.show && item.load !== 'loading'" type="ios-folder" />
					<Icon v-if="item.load === 'loading'" type="ios-loading sf-spin" />
					<Icon v-if="item.show && item.load !== 'loading'" type="ios-folder-open" />
					<div>{{ item.disk_name }}</div>
				</li>
				<DiskTree :DiskTreeData="item.child" v-show="item.show" @SelectDiskTree="SelectTree" />
			</div>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'DiskTree',
	props: {
		DiskTreeData: {
			type: Array
		}
	},
	data() {
		return {
			UserDiskTreeData: [{ disk_name: '全部文件', disk_id: 'null', parent_id: '', show: false, load: false, child: [] }]
		};
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.UserDiskTreeData = [{ disk_name: '全部文件', disk_id: 'null', parent_id: '', show: false, load: false, child: [] }];
		},
		checkIn(item, rs) {
			if (rs[0] && rs[0].parent_id === item.disk_id) {
				rs.forEach(items => {
					items.load = false;
					items.show = false;
					items.child = [];
					item.child.push(items);
				});
			}
		},
		LoadTreeData(list) {
			this.$Api.Disk.LoadTreeFile(list.disk_id, rs => {
				this.checkIn(list, rs); //检查并插入数据
				list.load = 'success';
				list.show = true;
			});
		},
		ToggleDiskTree(item, index) {
			if (item.load === 'success') {
				item.show = !item.show;
			} else {
				item.load = 'loading';
				this.LoadTreeData(item);
			}
		},
		SelectTree(item) {
			let tree = document.getElementsByClassName('cd-tree');
			for (let i = 0; i < tree.length; i++) {
				tree[i].className = 'cd-tree';
			}
			let path = event.path;
			for (let j = 0; j < path.length; j++) {
				if (path[j].nodeName === 'LI') {
					path[j].className = 'cd-tree active';
				}
			}
			this.$emit('SelectDiskTree', item);
		}
	}
};
</script>

<style scoped>
.cd-tree-container {
	width: 100%;
	overflow-y: auto;
}
.cd-tree-child-f {
	padding-left: 10px;
}
.cd-tree-folder-container {
	width: 100%;
	height: auto;
}
.cd-tree-folder-container li {
	width: 100%;
	height: 30px;
	line-height: 30px;
	cursor: pointer;
	margin-bottom: 2px;
	border-radius: 3px;
}
.cd-tree-folder-container li:hover,
.active {
	background: #ececec;
	color: #5b5bea !important;
}
.cd-tree-folder-container span,
.cd-tree-folder-container i {
	float: left;
	display: block;
	line-height: 30px;
	margin: 0 5px;
	color: #5b5bea;
	font-size: 20px;
}
.cd-tree {
	width: 100%;
	height: 30px;
}
</style>
