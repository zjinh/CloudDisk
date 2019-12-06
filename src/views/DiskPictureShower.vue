<template>
	<div class="cd-image-container" @mousewheel="MouseZoom" tabindex="-1" @keydown.left="Prev" @keydown.right="Next">
		<WindowsHeader :data="header" />
		<p class="ImageShowTips">
			<span class="cd-image-zoom" :style="{ opacity: ZoomWin }">{{ ZoomPercent }}</span
			>{{ NowShow.count + 1 }}/{{ PhotoList.length }}
		</p>
		<img :class="'cd-image-show ' + (!Control ? 'cd-image-animated' : '')" :src="NowShow.URL" ref="imageShow" @load="onload" @mousedown="Drag" alt="" />
		<Spin v-show="loaded">
			<Icon type="ios-loading" size="26" class="loading" />
		</Spin>
		<ul class="cd-image-control">
			<li class="sf-icon-search-plus" @click="Zoom(1)" />
			<li class="sf-icon-search-minus" @click="Zoom(-1)" />
			<li class="sf-icon-angle-left" @click="Prev" />
			<li @click="orginz">1:1</li>
			<li class="sf-icon-angle-right" @click="Next" />
			<li class="sf-icon-undo" @click="roate(-90)" />
			<li class="sf-icon-redo" @click="roate(90)" />
		</ul>
	</div>
</template>

<script>
import WindowsHeader from '../components/DiskWindow/WindowHeader';
export default {
	name: 'DiskPictureShower',
	components: { WindowsHeader },
	data() {
		return {
			loaded: false,
			Control: false,
			NowShow: {
				disk_name: '',
				count: 0,
				URL: ''
			},
			angle: 0,
			ZoomSize: 1,
			ZoomPercent: '0%',
			ZoomWin: 0,
			PhotoList: [],
			header: {
				title: '',
				background: 'rgba(103, 103, 103, 0.5)',
				color: '#fff'
			}
		};
	},
	watch: {
		PhotoList: {
			handler() {
				this.PhotoList.forEach((item, index) => {
					if (item.now) {
						item.now = 'PlayThis';
						this.ShowPicture(item, index);
					}
				});
			},
			deep: true
		},
		ZoomSize: {
			handler() {
				this.ZoomPercent = (this.ZoomSize * 100).toFixed(0) + '%';
			},
			deep: true
		}
	},
	created() {
		this.$ipc.on('win-data', (event, data) => {
			//接收打开图片文件的数据
			this.$nextTick(() => {
				data.forEach((item, index) => {
					item.now = false;
					item.count = index;
					if (item.active) {
						item.now = 'PlayThis';
						this.ShowPicture(item, index);
					}
				});
				this.PhotoList = data;
			});
		});
	},
	methods: {
		onload() {
			this.loaded = true;
			this.ZoomSize = 1;
			this.angle = 0;
			let img_show = this.$refs.imageShow;
			img_show.removeAttribute('style');
			document.getElementsByClassName('cd-image-container')[0].focus();
			let time_p1 = setInterval(() => {
				let imgW = img_show.offsetWidth;
				if (img_show.complete) {
					if (img_show.offsetHeight > window.innerHeight || imgW > window.innerWidth) {
						let ratio = window.innerWidth / imgW;
						img_show.style.width = imgW * ratio + 'px';
					}
					this.centerImg();
					this.loaded = false;
					img_show.style.opacity = 1;
				}
				time_p1 && clearInterval(time_p1);
			}, 500);
		},
		centerImg() {
			this.loaded = false;
			let img_show = this.$refs.imageShow;
			img_show.style.left = '0';
			img_show.style.top = '0';
		},
		ShowPicture(item, index) {
			this.NowShow = item;
			this.NowShow.count = index;
			this.NowShow.URL = item.disk_main;
			this.header.title = item.disk_name + '-图片查看';
		},
		orginz() {
			let img_show = this.$refs.imageShow;
			img_show.removeAttribute('style');
			this.ZoomSize = 1;
			this.centerImg();
		},
		Zoom(a) {
			this.Control = true;
			let img_show = this.$refs.imageShow;
			let oldWidth = img_show.offsetWidth;
			let oldHeight = img_show.offsetHeight;
			let oldLeft = img_show.offsetLeft;
			let oldTop = img_show.offsetTop;
			let scaleX = (event.clientX - oldLeft) / oldWidth; //比例
			let scaleY = (event.clientY - oldTop) / oldHeight;
			if (a < 0 && this.ZoomSize > 0.3) {
				this.ZoomSize = this.ZoomSize - 0.1;
				img_show.style.width = img_show.offsetWidth * 0.9 + 'px';
				img_show.style.height = img_show.offsetHeight * 0.9 + 'px';
			} else if (a > 0 && this.ZoomSize < 3) {
				this.ZoomSize = this.ZoomSize + 0.1;
				img_show.style.width = img_show.offsetWidth * 1.1 + 'px';
				img_show.style.height = img_show.offsetHeight * 1.1 + 'px';
			}
			let newWidth = img_show.offsetWidth;
			let newHeight = img_show.offsetHeight;
			//img_show.style.left = oldLeft - scaleX * (newWidth - oldWidth) + "px";
			//img_show.style.top = oldTop - scaleY * (newHeight - oldHeight) + "px";
			this.ZoomWin = 1;
			let time_p = setTimeout(() => {
				this.ZoomWin = 0;
				time_p && clearTimeout(time_p);
				this.Control = false;
			}, 1500);
			this.centerImg();
		},
		Drag() {
			let img_show = this.$refs.imageShow;
			event.preventDefault();
			let _this = this;
			this.Control = true;
			let oDragObj = img_show;
			let nTY = parseInt(oDragObj.style.top + 0);
			let y = event.clientY;
			let nTX = parseInt(oDragObj.style.left + 0);
			let x = event.clientX;
			document.onmousemove = function(event) {
				let top = nTY + event.clientY - y;
				let left = nTX + event.clientX - x;
				if (
					left < -img_show.offsetWidth * 2 + 10 ||
					left > window.innerWidth - 10 ||
					top < -img_show.offsetHeight * 2 + 10 ||
					top > window.innerHeight * 2 - 20
				) {
					document.onmousemove = null;
					_this.centerImg();
					return;
				}
				oDragObj.style.top = top + 'px';
				oDragObj.style.left = left + 'px';
				document.onmouseup = function() {
					_this.Control = false;
					this.onmousemove = null;
				};
			};
			document.onmouseup = function() {
				_this.Control = false;
				this.onmousemove = null;
			};
			return false;
		},
		MouseZoom() {
			this.Zoom(event.wheelDelta);
		},
		roate(a) {
			let img_show = this.$refs.imageShow;
			this.angle = this.angle + a;
			img_show.style.webkitTransform = 'rotate(' + this.angle + 'deg)';
		},
		Next() {
			if (!this.PhotoList.length) {
				return;
			}
			let NowCount = this.NowShow.count;
			let AllCount = this.PhotoList.length;
			if (NowCount !== AllCount - 1) {
				this.PhotoList.forEach((item, index) => {
					item.now = false;
				});
				this.PhotoList[NowCount + 1].now = 'PlayThis';
			}
		},
		Prev() {
			if (!this.PhotoList.length) {
				return;
			}
			let NowCount = this.NowShow.count;
			if (this.NowShow.count !== 0) {
				this.PhotoList.forEach((item, index) => {
					item.now = false;
				});
				this.PhotoList[NowCount - 1].now = 'PlayThis';
			}
		}
	}
};
</script>

<style scoped>
.loading {
	animation: loading 1s linear infinite;
}
@keyframes loading {
	from {
		transform: rotate(0deg);
	}
	50% {
		transform: rotate(180deg);
	}
	to {
		transform: rotate(360deg);
	}
}
.demo-spin-col {
	height: 100px;
	position: relative;
	border: 1px solid #eee;
}
/*图片查看*/
.cd-image-container {
	float: left;
	width: 100%;
	height: 100%;
	background: #4f4f4f;
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	-khtml-user-select: none;
	user-select: none;
}
.cd-image-container .ivu-spin-main {
	float: right;
	padding: 30px 10px;
}
.cd-image-zoom {
	height: 30px;
	color: #fff;
	text-align: center;
	font-size: 14px;
	line-height: 30px;
	opacity: 1;
	-webkit-transition: all 0.35s;
	-moz-transition: all 0.35s;
	-o-transition: all 0.35s;
	margin-right: 10px;
}
.cd-image-show {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 1;
	margin: auto;
	min-width: 0 !important;
	max-width: none !important;
	min-height: 0 !important;
	max-height: none !important;
	cursor: -webkit-grab;
	-webkit-transition: none !important;
	-moz-transition: none !important;
	-o-transition: none !important;
}
.cd-image-animated {
	-webkit-transition: all 0.3s ease-out !important;
	-moz-transition: all 0.3s ease-out !important;
	-o-transition: all 0.3s ease-out !important;
	transition: all 0.3s ease-out !important;
}
.cd-image-control {
	bottom: 30px;
	z-index: 3;
	width: 100%;
	height: 45px;
}
.ImageShowTips {
	width: 100%;
	text-align: right;
	padding-right: 10px;
	line-height: 30px;
	font-size: 14px;
	color: #fff;
	position: absolute;
	z-index: 2;
	text-shadow: 0 0 5px rgb(0, 0, 0);
}
.cd-image-control {
	position: absolute;
	margin: 0 auto;
	bottom: 30px;
	width: 294px;
	height: 42px;
	left: calc(50% - 147px);
	border-radius: 3px;
	-webkit-border-radius: 3px;
	-moz-border-radius: 3px;
	background: rgba(103, 103, 103, 0.5);
	text-align: center;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 0 1px rgba(0, 0, 0, 0.2);
}
.cd-image-control li {
	float: left;
	width: 42px;
	height: 42px;
	font-size: 14px;
	text-align: center;
	line-height: 42px;
	cursor: pointer;
	color: #fff;
}
.cd-image-control .sf-icon-angle-left,
.cd-image-control .sf-icon-angle-right {
	font-size: 22px;
}
.cd-image-control li:hover {
	background: rgba(125, 125, 125, 0.5);
	color: #fff;
}
</style>
