<template>
    <div class="SlimfAudioContainer" @mousedown="VolumnState=false">
        <div class="CloudDiskInfoControl">
            <button class="sf-icon-times" @click="close"></button>
            <button class="sf-icon-window-minimize" @click="mini" style="font-size: 12px"></button>
        </div>
        <div class="SlimfAudioPlayerContainer">
            <div class="SlimfAudioPlayerTitle">{{NowPlay.disk_name}}</div>
            <ul>
                <li class="SlimfABtnmidue"></li>
                <li class="sf-icon-step-backward SlimfABtnsmall" @click="Prev"></li>
                <li :class="'SlimfABtnbig '+PlayButtonState" @click="PlayControl"></li>
                <li class="sf-icon-step-forward SlimfABtnsmall" @click="Next"></li>
                <li class="sf-icon-volume-up SlimfABtnmidue" @mousedown.stop="VolumnState?VolumnState=false:VolumnState=true"></li>
            </ul>
            <div class="SlimfAudioVolumn" v-show="VolumnState">
                <div class="SlimfVideoVolumnSlider" ref="volunm" @mousedown="ChangeVolumn">
                    <div class="SlimfVideoVolumnSliderBar">
                        <span></span>
                    </div>
                </div>
            </div>
            <p class="SlimfAudioTime">{{TimeText}}</p>
            <div class="SlimfAudioSliderContainer" @mousedown="TimeChange" ref="slider">
                <div class="SlimfAudioSlider" :style="{'width':ProcessWidth}">
                    <span></span>
                </div>
            </div>
            <canvas width="350" height="180" id="canvas"></canvas>
        </div>
        <audio ref="audio" @ended="MusicEnded" @timeupdate="MusicProcess" @durationchange="PlayButtonState='sf-icon-pause'" @seeking="PlayButtonState='sf-icon-circle-notch sf-spin'" @canplay="PlayControl" :src="NowPlay.PlayUrl" id="audio"></audio>
        <MusicList v-bind:PlayList="PlayList" v-on:play="playCallBack" ref="List"></MusicList>
    </div>
</template>

<script>
    import Media from '../media/media';
    import MusicList from './DiskMusicPlayer/MusicList';
    import electron from 'electron';
    const {ipcRenderer} = require('electron');
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
                            item.play = 'SlimfAudioPlayThis';
                            this.playCallBack(item, index);
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
            }
        },
        created(){
            ipcRenderer.on('MusicList', (event, data)=>{//接收打开文件的数据
                this.$nextTick(()=>{
                    data.forEach((item,index)=>{
                        item.play=false;
                        if(item.active){
                            item.play='SlimfAudioPlayThis';
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
            bind:function(){
                ipcRenderer.on('Next',()=>{
                    this.Next();
                });
                ipcRenderer.on('Prev',()=>{
                    this.Prev();
                });
                ipcRenderer.on('Play',()=>{
                    this.PlayControl();
                });
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
                    this.PlayList[NowCount+1].play='SlimfAudioPlayThis'
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
                    this.PlayList[NowCount-1].play='SlimfAudioPlayThis'
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
            Visual:function(){
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
    @import url("../../../static/css/Slimf.css");
    @import url("../../../static/css/disk.css");
</style>