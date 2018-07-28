<template>
    <div class="AudioContainer" @mousedown="VolumnState=false">
        <div class="CloudDiskInfoControl">
            <button class="sf-icon-times" @click="close"></button>
            <button class="sf-icon-window-minimize" @click="mini"></button>
        </div>
        <div class="AudioPlayerContainer">
            <div class="AudioPlayerTitle">{{NowPlay.disk_name}}</div>
            <ul>
                <li class="ABtnmidue"></li>
                <li class="sf-icon-step-backward ABtnsmall" @click="Prev"></li>
                <li :class="'ABtnbig '+PlayButtonState" @click="PlayControl"></li>
                <li class="sf-icon-step-forward ABtnsmall" @click="Next"></li>
                <li class="sf-icon-volume-up ABtnmidue" @mousedown.stop="VolumnState?VolumnState=false:VolumnState=true"></li>
            </ul>
            <div class="AudioVolumn" v-show="VolumnState">
                <div class="VideoVolumnSlider" ref="volunm" @mousedown="ChangeVolumn">
                    <div class="VideoVolumnSliderBar">
                        <span></span>
                    </div>
                </div>
            </div>
            <div class="AudioTime"><div id="AudioLrcList"></div><span>{{TimeText}}</span></div>
            <div class="AudioSliderContainer" @mousedown="TimeChange" ref="slider">
                <div class="AudioSlider" :style="{'width':ProcessWidth}">
                    <span></span>
                </div>
            </div>
            <canvas width="350" height="180" id="canvas"></canvas>
        </div>
        <audio ref="audio" @ended="MusicEnded" @timeupdate="MusicProcess" @error="Next" @durationchange="PlayButtonState='sf-icon-pause'" @seeking="PlayButtonState='sf-icon-circle-notch sf-spin'" @canplay="PlayControl" :src="NowPlay.PlayUrl" id="audio"></audio>
        <MusicList v-bind:PlayList="PlayList" v-on:play="playCallBack" ref="List"></MusicList>
    </div>
</template>

<script>
    import Api from '../api/api';
    import Media from '../media/media';
    import MusicList from './DiskMusicPlayer/MusicList';
    import electron from 'electron';
    let MusicPlayer=electron.remote.getCurrentWindow();
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "DiskMusicPlayer",
        components:{MusicList},
        watch:{
            PlayList: {
                handler(newValue, oldValue) {
                    this.PlayList.forEach((item, index) => {
                        if (item.play) {
                            item.play = 'AudioPlayThis';
                            this.playCallBack(item, index);
                            this.GetLyr();
                        }
                    });
                },
                deep: true
            },
        },
        data(){
            return{
                PlayList:[],
                NowPlay:{
                    disk_name:'准备播放',
                    count:0,
                },
                TimeText:'00:00/00:00',
                ProcessWidth:0,
                PlayButtonState:'sf-icon-play',
                VolumnState:false,
                VisualState:true,
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
                prefixid: 'AudioLrcList',
                /* 容器ID */
                hoverClass: 'this_lrc',
                /* 选中节点的className */
                hoverTop: 100,
                /* 当前歌词距离父节点的高度 */
                duration: 0,
                /* 歌曲回调函数设置的进度时间 */
                __duration: -1,
            }
        },
        created(){
            ipc.on('MusicList', (event, data)=>{//接收打开文件的数据
                this.$nextTick(()=>{
                    data.forEach((item,index)=>{
                        item.play=false;
                        if(item.active){
                            item.play='AudioPlayThis';
                            this.playCallBack(item,index);
                            this.PlayControl();
                        }
                    });
                    this.PlayList=data;
                });
            });
            this.bind();
        },
        methods:{
            bind(){
                ipc.on('Next',()=>{
                    this.Next();
                });
                ipc.on('Prev',()=>{
                    this.Prev();
                });
                ipc.on('Play',()=>{
                    this.PlayControl();
                });
                if(localStorage.username&&localStorage.password){
                    this.RemberPass=true;
                }
                window.addEventListener( "dragenter", function (e) {
                    e.preventDefault();
                }, false);
                window.addEventListener( "dragover", function (e) {
                    e.preventDefault();
                }, false );
                window.addEventListener( "dragleave", function (e) {
                    e.preventDefault();
                }, false );
                window.addEventListener( "drop", function (e) {
                    e.preventDefault();
                }, false );
            },
            playCallBack(item,index){
                this.NowPlay=item;
                this.NowPlay.count=index;
                this.NowPlay.PlayUrl=localStorage.server+'/'+item.disk_main;
            },
            PlayControl(){
                if(!this.PlayList.length){
                    return
                }
                let media=this.$refs.audio;
                if(media.paused){
                    media.play();
                    this.PlayButtonState='sf-icon-pause';
                    ipc.send('play-state','pause')
                }else{
                    media.pause();
                    this.PlayButtonState='sf-icon-play';
                    ipc.send('play-state','play')
                }
                MusicPlayer.setTitle(this.NowPlay.disk_name);
                if(this.VisualState) {
                    this.Visual();
                }
            },
            Next(){
                if(!this.PlayList.length){
                    return
                }
                let NowCount=this.NowPlay.count;
                let AllCount=this.PlayList.length;
                if(NowCount!==AllCount-1){
                    this.PlayList.forEach((item,index)=>{
                        item.play=false;
                    });
                    this.PlayList[NowCount+1].play='AudioPlayThis'
                }else{
                    this.PlayControl();
                }
            },
            Prev(){
                if(!this.PlayList.length){
                    return
                }
                let NowCount=this.NowPlay.count;
                if(this.NowPlay.count!==0){
                    this.PlayList.forEach((item,index)=>{
                        item.play=false;
                    });
                    this.PlayList[NowCount-1].play='AudioPlayThis'
                }
            },
            ChangeVolumn(){
                let media=this.$refs.audio;
                let volunm=this.$refs.volunm;
                Media.MediaControl(media,'volunm','y',volunm,event)
            },
            MusicEnded(){
                this.Next();
            },
            TimeChange(){
                let media=this.$refs.audio;
                let slider=this.$refs.slider;
                Media.MediaControl(media,'play','x',slider,event)
                this.PlayControl()
            },
            MusicProcess(){
                let media=this.$refs.audio;
                this.TimeText=Media.secondDeal(media.currentTime)+ '/' +Media.secondDeal(media.duration);
                this.ProcessWidth=Math.round(media.currentTime) / Math.round(media.duration) * 100 + "%";
            },
            Visual(){
                window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
                let audio =this.$refs.audio;
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
                    capStyle = '#409EFF',
                    meterNum = 800 / (10 + 2), //count of the meters
                    capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
                    ctx = canvas.getContext('2d');
                    let gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(1, '#0f0');
                    gradient.addColorStop(0.5, '#3b8cff');
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
                        };
                        ctx.fillStyle = capStyle;
                        if (value < capYPositionArray[i]) {
                            ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
                        } else {
                            ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                            capYPositionArray[i] = value;
                        };
                        ctx.fillStyle = gradient;
                        ctx.fillRect(i * 12 , cheight - value + capHeight, meterWidth, cheight);
                    }
                    requestAnimationFrame(renderFrame);
                }
                renderFrame();
                this.VisualState=false;
            },
            GetLyr(){
                Api.Disk.GetLyr({
                    name:this.NowPlay.disk_name
                },(rs)=>{
                    rs=JSON.parse(rs);
                    if (rs.lrc.lyric !== '' || rs.lrc.lyric !== null) {
                        let data=rs.lrc.lyric;
                        this.start(data,()=>{
                            return this.$refs.audio.currentTime;
                        })
                    } else {

                    }
                })
            },
            start(txt, callback) {
                if (typeof(txt) !== 'string' || txt.length < 1 || typeof(callback) !== 'function') return; /* 停止前面执行的歌曲 */
                this.stop();
                this.callback = callback;
                let item = null,
                    item_time = null,
                    html = ''; /* 分析歌词的时间轴和内容 */
                txt = txt.split("\n");
                for (let i = 0; i < txt.length; i++) {
                    item = txt[i].replace(this.regex_trim, '');
                    if (item.length < 1 || !(item = this.regex.exec(item))) continue;
                    while (item_time = this.regex_time.exec(item[1])) {
                        this.list.push([parseFloat(item_time[1]) * 60 + parseFloat(item_time[2]), item[2]]);
                    }
                    this.regex_time.lastIndex = 0;
                } /* 有效歌词 */
                if (this.list.length > 0) { /* 对时间轴排序 */
                    this.list.sort(function(a, b) {
                        return a[0] - b[0];
                    });
                    if (this.list[0][0] >= 0.1) this.list.unshift([this.list[0][0] - 0.1, '']);
                    this.list.push([this.list[this.list.length - 1][0] + 1, '']);
                    for (let i = 0; i < this.list.length; i++)
                        html += this.format.replace(/\{html\}/gi, this.list[i][1]); /* 赋值到指定容器 */
                    document.getElementById(this.prefixid).innerHTML = html;
                    /* 定时调用回调函数，监听歌曲进度 */
                    if(typeof (callback())==='number') {
                        this.handle = setInterval(()=>{
                            this.jump(callback())
                        }, this.interval * 1000);
                    }
                } else { /* 没有歌词 */
                }
            },
            /* 跳到指定时间的歌词 */
            jump(duration) {
                if (typeof(this.handle) !== 'number' || typeof(duration) !== 'number' ||  this.list.length < 1) return false;
                if (duration < 0) duration = 0;
                if (this.__duration === duration) return;
                duration += 0.2;
                this.__duration = duration;
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
                    } else if (this.list[pivot][0] > duration) { /* left */
                        right = pivot;
                    } else { /* right */
                        left = pivot;
                    }
                    tmp = left + Math.floor((right - left) / 2);
                    if (tmp === pivot) break;
                    pivot = tmp;
                }
                if (pivot === this.pivot) return;
                this.pivot = pivot;
                tmpobj =document.getElementById(this.prefixid).childNodes;
                for(let i=0;i<tmpobj.length;i++){
                    tmpobj[i].className=this.prefixid;
                }
                if(tmpobj[pivot]) {
                    tmpobj[pivot].className += ' ' + thisobj.hoverClass;
                    /*tmp = tmpobj[pivot + 1].offsetTop - tmpobj[pivot].parentNode.offsetTop - this.hoverTop;
                    tmp = tmp > 0 ? tmp * 1 : 0;//如果不设置滚动条使用margin设置为-1
                    tmpobj[pivot].parentNode.scrollTop = tmp;//这里可以用margintop*/
                }
            },
            /* 停止执行歌曲 */
            stop() {
                if (typeof(this.handle) === 'number') clearInterval(this.handle);
                this.handle = this.callback = null;
                this.__duration = -1;
                this.regex_time.lastIndex = 0;
                this.list = [];
            },
            close(){
                MusicPlayer.close();
            },
            mini(){
                MusicPlayer.minimize();
            }
        }
    }
</script>

<style scoped>

</style>