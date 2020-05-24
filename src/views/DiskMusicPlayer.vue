<template>
	<div
		class="cd-music-player-main"
		@mousedown="VolumnState = false"
		tabindex="-1"
		@keydown.space="PlayerCommend('play')"
		@keydown.left="ChangeTime('-')"
		@keydown.right="ChangeTime('+')"
	>
		<WindowsHeader :data="header" />
		<div class="cd-music-player-container">
			<div class="cd-music-player-title">{{ NowPlay.disk_name }}</div>
			<ul>
				<li class="cd-music-player-H-btn" />
				<li class="sf-icon-step-backward cd-music-player-S-btn" @click="PlayerCommend('prev')" />
				<li :class="'cd-music-player-B-btn ' + PlayButtonState" @click="PlayerCommend('play')" />
				<li class="sf-icon-step-forward cd-music-player-S-btn" @click="PlayerCommend('next')" />
				<li class="sf-icon-volume-up cd-music-player-H-btn" @mousedown.stop="VolumnState ? (VolumnState = false) : (VolumnState = true)" />
			</ul>
			<div class="cd-music-player-volumn" v-show="VolumnState">
				<div class="cd-player-volumn-container" ref="volunm" @mousedown="ChangeVolumn">
					<div class="cd-player-volumn-slider">
						<span />
					</div>
				</div>
			</div>
			<div class="cd-music-player-time">
				<div id="cd-audio-lrc-list"></div>
				<span>{{ TimeText }}</span>
			</div>
			<div class="cd-player-slider-container" @mousedown="TimeChange" ref="slider">
				<div class="cd-player-slider" :style="{ width: ProcessWidth }">
					<span />
				</div>
			</div>
			<canvas width="350" height="240" id="canvas" />
		</div>
		<audio
			muted
			preload="auto"
			ref="audio"
			@ended="PlayerCommend('next')"
			@timeupdate="MusicProcess"
			@error="PlayerCommend('next')"
			@durationchange="PlayButtonState = 'sf-icon-pause'"
			@seeking="PlayButtonState = 'sf-icon-circle-notch sf-spin'"
			@canplay="PlayerCommend('play')"
			:src="NowPlay.PlayUrl"
			id="audio"
		/>
		<MusicList v-bind:PlayList="PlayList" @play="playCallBack" ref="List" />
	</div>
</template>

<script>
import Media from '../tools/media/media';
import MusicList from '../components/DiskMusicPlayer/MusicList';
import WindowsHeader from '../components/DiskWindow/WindowHeader';
export default {
	name: 'DiskMusicPlayer',
	components: { MusicList, WindowsHeader },
	watch: {
		PlayList: {
			handler() {
				this.PlayList.forEach((item, index) => {
					if (item.play) {
						item.play = 'active';
						this.playCallBack(item, index);
						this.GetLyr();
					}
				});
			},
			deep: true
		}
	},
	data() {
		return {
			PlayList: [],
			NowPlay: {
				disk_name: '准备播放',
				count: 0
			},
			TimeText: '00:00/00:00',
			ProcessWidth: 0,
			PlayButtonState: 'sf-icon-play',
			VolumnState: false,
			VisualState: true,
			handle: null,
			/* 定时执行句柄 */
			list: [],
			/* lrc歌词及时间轴数组 */
			regex: /^[^\[]*((?:\s*\[\d+\:\d+(?:\.\d+)?\])+)([\s\S]*)$/,
			/* 提取歌词内容行 */
			regex_time: /\[(\d+)\:((?:\d+)(?:\.\d+)?)\]/g,
			/* 提取歌词时间轴 */
			regex_trim: /^\s+|\s+$/,
			/* 过滤两边空格 */
			callback: null,
			/* 定时获取歌曲执行时间回调函数 */
			interval: 0.3,
			/* 定时刷新时间，单位：秒 */
			format: '<li>{html}</li>',
			/* 模板 */
			prefixid: 'cd-audio-lrc-list',
			/* 容器ID */
			hoverClass: 'this_lrc',
			/* 选中节点的className */
			hoverTop: 100,
			/* 当前歌词距离父节点的高度 */
			duration: 0,
			/* 歌曲回调函数设置的进度时间 */
			duration_: -1,
			header: {
				color: '#4f4f4',
				title: '',
				head: false,
				resize: false,
				mini: true
			}
		};
	},
	created() {
		this.$ipc.on('win-data', (event, data) => {
			//接收音乐文件列表的数据
			this.$nextTick(() => {
				data.forEach((item, index) => {
					item.play = false;
					if (item.active) {
						item.play = 'active';
						this.playCallBack(item, index);
						this.PlayerCommend('play');
					}
				});
				this.PlayList = data;
			});
		});
		this.bind();
	},
	methods: {
		bind() {
			this.$ipc.on('Next', () => {
				this.PlayerCommend('prev');
			});
			this.$ipc.on('Prev', () => {
				this.PlayerCommend('next');
			});
			this.$ipc.on('Play', () => {
				this.PlayerCommend('play');
			});
		},
		playCallBack(item, index) {
			this.NowPlay = item;
			this.NowPlay.count = index;
			this.NowPlay.PlayUrl = item.disk_main;
		},
		ChangeTime(state) {
			let media = this.$refs.audio;
			if (state === '-') {
				media.currentTime = media.currentTime - 5;
			} else {
				media.currentTime = media.currentTime + 5;
			}
		},
		PlayerCommend(commend) {
			if (!this.PlayList.length) {
				return;
			}
			let NowCount = this.NowPlay.count;
			let AllCount = this.PlayList.length;
			switch (commend) {
				case 'prev':
					if (NowCount !== 0) {
						this.PlayList.forEach(item => {
							item.play = false;
						});
						this.PlayList[NowCount - 1].play = 'active';
					}
					break;
				case 'next':
					if (NowCount !== AllCount - 1) {
						this.PlayList.forEach(item => {
							item.play = false;
						});
						this.PlayList[NowCount + 1].play = 'active';
					} else {
						this.PlayerCommend('play');
					}
					break;
				case 'play':
					let media = this.$refs.audio;
					if (media.paused) {
						media.play();
						this.PlayButtonState = 'sf-icon-pause';
						this.$ipc.send('player-control', 'audio', 'pause');
					} else {
						media.pause();
						this.PlayButtonState = 'sf-icon-play';
						this.$ipc.send('player-control', 'audio', 'play');
					}
					this.header.title = this.NowPlay.disk_name;
					if (this.VisualState) {
						this.Visual();
					}
					document.getElementsByClassName('cd-music-player-main')[0].focus();
					break;
			}
		},
		ChangeVolumn() {
			let media = this.$refs.audio;
			let volunm = this.$refs.volunm;
			Media.MediaControl(media, 'volunm', 'y', volunm, event);
		},
		TimeChange() {
			let media = this.$refs.audio;
			let slider = this.$refs.slider;
			Media.MediaControl(media, 'play', 'x', slider, event);
			this.PlayerCommend('play');
		},
		MusicProcess() {
			let media = this.$refs.audio;
			this.TimeText = Media.secondDeal(media.currentTime) + '/' + Media.secondDeal(media.duration);
			this.ProcessWidth = (Math.round(media.currentTime) / Math.round(media.duration)) * 100 + '%';
		},
		Visual() {
			window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
			let audio = this.$refs.audio;
			let ctx = new AudioContext();
			let analyser = ctx.createAnalyser();
			let audioSrc = ctx.createMediaElementSource(audio);
			audioSrc.connect(analyser);
			analyser.connect(ctx.destination);
			let frequencyData = new Uint8Array(analyser.frequencyBinCount);
			let canvas = document.getElementById('canvas'),
				cwidth = canvas.width,
				cheight = canvas.height,
				meterWidth = 10, //width of the meters in the spectrum
				capHeight = 2,
				capStyle = '#5b5bea',
				meterNum = 800 / (10 + 2), //count of the meters
				capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
			ctx = canvas.getContext('2d');
			let gradient = ctx.createLinearGradient(0, 0, 0, 300);
			gradient.addColorStop(1, '#8140ff');
			gradient.addColorStop(0.5, '#5b5bea');
			gradient.addColorStop(0, '#fff');
			function renderFrame() {
				let array = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(array);
				let step = Math.round(array.length / meterNum);
				ctx.clearRect(0, 0, cwidth, cheight);
				for (let i = 0; i < meterNum; i++) {
					let value = array[i * step];
					if (capYPositionArray.length < Math.round(meterNum)) {
						capYPositionArray.push(value);
					}
					ctx.fillStyle = capStyle;
					if (value < capYPositionArray[i]) {
						ctx.fillRect(i * 12, cheight - --capYPositionArray[i], meterWidth, capHeight);
					} else {
						ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
						capYPositionArray[i] = value;
					}
					ctx.fillStyle = gradient;
					ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight);
				}
				requestAnimationFrame(renderFrame);
			}
			renderFrame();
			this.VisualState = false;
		},
		GetLyr() {
			this.$Api.Disk.GetLyr(
				{
					name: this.NowPlay.disk_name
				},
				rs => {
					rs = JSON.parse(rs);
					if (rs.lrc.lyric !== '' || rs.lrc.lyric !== null) {
						let data = rs.lrc.lyric;
						this.start(data, () => {
							return this.$refs.audio.currentTime;
						});
					} else {
					}
				}
			);
		},
		start(txt, callback) {
			if (typeof txt !== 'string' || txt.length < 1 || typeof callback !== 'function') return; /* 停止前面执行的歌曲 */
			this.stop();
			this.callback = callback;
			let item = null,
				item_time = null,
				html = ''; /* 分析歌词的时间轴和内容 */
			txt = txt.split('\n');
			for (let i = 0; i < txt.length; i++) {
				item = txt[i].replace(this.regex_trim, '');
				if (item.length < 1 || !(item = this.regex.exec(item))) continue;
				while ((item_time = this.regex_time.exec(item[1]))) {
					this.list.push([parseFloat(item_time[1]) * 60 + parseFloat(item_time[2]), item[2]]);
				}
				this.regex_time.lastIndex = 0;
			} /* 有效歌词 */
			if (this.list.length > 0) {
				/* 对时间轴排序 */
				this.list.sort(function(a, b) {
					return a[0] - b[0];
				});
				if (this.list[0][0] >= 0.1) this.list.unshift([this.list[0][0] - 0.1, '']);
				this.list.push([this.list[this.list.length - 1][0] + 1, '']);
				for (let i = 0; i < this.list.length; i++) html += this.format.replace(/\{html\}/gi, this.list[i][1]); /* 赋值到指定容器 */
				document.getElementById(this.prefixid).innerHTML = html;
				/* 定时调用回调函数，监听歌曲进度 */
				if (typeof callback() === 'number') {
					this.handle = setInterval(() => {
						this.jump(callback());
					}, this.interval * 1000);
				}
			} else {
				/* 没有歌词 */
			}
		},
		/* 跳到指定时间的歌词 */
		jump(duration) {
			if (typeof this.handle !== 'number' || typeof duration !== 'number' || this.list.length < 1) return false;
			if (duration < 0) duration = 0;
			if (this.duration_ === duration) return;
			duration += 0.2;
			this.duration_ = duration;
			duration += this.interval;

			let left = 0,
				right = this.list.length - 1,
				last = right,
				pivot = Math.floor(right / 2),
				tmpobj = null,
				tmp = 0,
				thisobj = this;
			/* 二分查找 */
			while (left <= pivot && pivot <= right) {
				if (this.list[pivot][0] <= duration && (pivot === right || duration < this.list[pivot + 1][0])) {
					//if(pivot === right) this.stop();
					break;
				} else if (this.list[pivot][0] > duration) {
					/* left */
					right = pivot;
				} else {
					/* right */
					left = pivot;
				}
				tmp = left + Math.floor((right - left) / 2);
				if (tmp === pivot) break;
				pivot = tmp;
			}
			if (pivot === this.pivot) return;
			this.pivot = pivot;
			tmpobj = document.getElementById(this.prefixid).childNodes;
			for (let i = 0; i < tmpobj.length; i++) {
				tmpobj[i].className = this.prefixid;
			}
			if (tmpobj[pivot]) {
				tmpobj[pivot].className += ' ' + thisobj.hoverClass;
				/*tmp = tmpobj[pivot + 1].offsetTop - tmpobj[pivot].parentNode.offsetTop - this.hoverTop;
                    tmp = tmp > 0 ? tmp * 1 : 0;//如果不设置滚动条使用margin设置为-1
                    tmpobj[pivot].parentNode.scrollTop = tmp;//这里可以用margintop*/
			}
		},
		/* 停止执行歌曲 */
		stop() {
			if (typeof this.handle === 'number') clearInterval(this.handle);
			this.handle = this.callback = null;
			this.duration_ = -1;
			this.regex_time.lastIndex = 0;
			this.list = [];
		}
	}
};
</script>

<style scoped>
@import url('../assets/css/player.css');
</style>
