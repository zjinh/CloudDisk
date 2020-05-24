<template>
	<div :class="data.disabled || data.value ? 'cd-index-input input-focus' : focusState">
		<span :class="data.icon" />
		<input
			:id="id"
			:type="data.type ? data.type : 'text'"
			v-model="data.value"
			autocomplete="off"
			spellcheck="false"
			@focus="focusState = 'cd-index-input input-focus'"
			@blur="blur"
			:disabled="data.disabled ? data.disabled : false"
		/>
		<label :for="id">{{ data.text }}</label>
		<Tooltip v-if="data.state === 'verify'" content="点击刷新" placement="bottom-end" :transfer="true">
			<img draggable="false" :src="url" @click="refresh" alt="" />
		</Tooltip>
	</div>
</template>

<script>
export default {
	name: 'l-input',
	props: {
		data: Object
	},
	data() {
		return {
			id: 'input-' + Math.random(),
			focusState: 'cd-index-input',
			url: this.$Api.Public.VerifyCode()
		};
	},
	methods: {
		blur() {
			if (this.data.value) {
				this.focusState = 'cd-index-input input-focus';
			} else {
				this.focusState = 'cd-index-input';
			}
		},
		refresh() {
			this.url = this.$Api.Public.VerifyCode();
		}
	}
};
</script>

<style scoped></style>
