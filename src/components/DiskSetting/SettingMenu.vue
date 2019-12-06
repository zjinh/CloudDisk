<template>
	<ul class="cd-setting-menu">
		<li v-for="(item, index) in data" :key="index" :class="item.active" @click="change(item, index)">
			<span :class="item.icon" />
			<p>{{ item.name }}</p>
		</li>
	</ul>
</template>

<script>
export default {
	name: 'SettingMenu',
	props: {
		data: {
			type: Object
		}
	},
	methods: {
		change(item, index) {
			this.$emit('change', item, index);
		}
	}
};
</script>

<style scoped>
.cd-setting-menu {
	width: 100px;
	height: 100%;
	float: left;
	overflow: unset !important;
}
.cd-setting-menu li {
	width: 100%;
	height: 35px;
	background: #fff;
	color: #6e6e6e;
	border-radius: 5px 0 0 5px;
	border: 1px solid #fff;
}
.cd-setting-menu li * {
	float: left;
	line-height: 35px;
}
.cd-setting-menu li.active {
	width: calc(100% + 1px);
	border: 1px solid #eee;
	border-right: none;
	color: #6e6e6e !important;
	cursor: default !important;
}
.cd-setting-menu li:hover {
	color: #5b5bea;
	cursor: pointer;
}
.cd-setting-menu li span {
	width: 35px;
	height: 35px;
	text-align: center;
}
.cd-setting-menu li p {
	width: calc(100% - 60px);
}
</style>
