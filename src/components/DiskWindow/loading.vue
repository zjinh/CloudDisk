<template>
	<div>
		<div class="cd-loading" v-if="loading">
			<div class="sf-icon-hdd">
				<div class="cd-loading-beat">
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
			正在加载
		</div>
		<div class="cd-empty-tips" v-if="IsNoDiskData" v-show="!length > 0">
			<span class="sf-icon-hdd" />
			这里什么都没有
		</div>
	</div>
</template>

<script>
export default {
	name: 'loading',
	props: {
		loading: {
			type: Boolean
		},
		IsNoDiskData: {
			type: Boolean
		},
		length: {
			type: Number
		}
	}
};
</script>

<style scoped>
/*加载动画*/
.cd-loading {
	text-align: center;
	color: #5b5bea;
	font-size: 16px;
	padding-top: calc(25% - 35px);
	position: relative !important;
	z-index: -1;
}
.cd-loading .sf-icon-hdd {
	width: 100%;
	font-size: 45px;
	position: relative;
}
.cd-loading p {
	color: #828282;
	font-size: 16px;
}
@-webkit-keyframes cd-loading {
	50% {
		opacity: 0.2;
		-webkit-transform: scale(0.75);
		transform: scale(0.75);
	}

	100% {
		opacity: 1;
		-webkit-transform: scale(1);
		transform: scale(1);
	}
}
@keyframes cd-loading {
	50% {
		opacity: 0.5;
		-webkit-transform: scale(0.75);
		transform: scale(0.75);
	}
	100% {
		opacity: 1;
		-webkit-transform: scale(1);
		transform: scale(1);
	}
}
.cd-loading-beat {
	position: absolute;
	top: 24px;
	text-align: center;
	left: calc(50% - 8px);
	background: #fff;
	height: 10px;
	width: 26px;
}
.cd-loading-beat > div {
	float: right;
	background-color: #5b5bea;
	width: 4px;
	height: 4px;
	margin-top: 3px;
	margin-right: 2px;
	border-radius: 100%;
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
	display: inline-block;
	-webkit-animation: cd-loading 0.7s 0s infinite linear;
	animation: cd-loading 0.7s 0s infinite linear;
}
.cd-loading-beat > div:nth-child(2n-1) {
	-webkit-animation-delay: 0.35s !important;
	animation-delay: 0.35s !important;
}
/*无数据提示*/
.cd-empty-tips {
	width: 100%;
	color: #828282;
	text-align: center;
	font-size: 16px;
	padding-top: calc(25% - 35px);
	position: relative !important;
	z-index: -1;
}
.cd-empty-tips span {
	width: 100%;
	font-size: 45px;
}
</style>
