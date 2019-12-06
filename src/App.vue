<template>
	<div id="Cloud-Disk">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'Cloud-Disk',
	created() {
		this.$Message.config({
			top: 60,
			duration: 2.5
		});
	}
};
</script>

<style>
@import url('assets/font/icon.css');
@import url('assets/css/public.css');
</style>
