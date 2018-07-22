<template>
    <div class="WindowContainer" @mousedown="VolumnState=false">
        <div class="CloudDiskInfoControl">
            <p style="width: calc(100% - 120px)">{{NowPlay.disk_name}}</p>
            <button class="sf-icon-times" @click="close"></button>
            <button :class="ButtonState" @click="restore"></button>
            <button class="sf-icon-window-minimize" @click="mini"></button>
        </div>
        <div class="VideoContainer" ref="VideoPlayer" tabindex="-1" @keydown.esc="FullFlag=false">
            <video :style="{'height':VideoHeight}" crossorigin="*" @ended="VideoEnded" @dblclick="FullScreen" @click="PlayControl" @progress="VideoCache" @timeupdate="VideoProcess" ref="video"  @durationchange="PlayButtonState='sf-icon-pause'" @seeking="PlayButtonState='sf-icon-circle-notch sf-spin'" @canplay="PlayControl" :src="NowPlay.PlayUrl">
            </video>
            <div :class="'VideoFliter '+PlayButtonState+' '+animation" @click="PlayControl"></div>
            <div :class="'VideoControl '+BarAnimation" @mouseover="ShowControl" @mouseout="HideControl">
                <div :class="'VideoPlay '+PlayButtonState" @click="PlayControl"></div>
                <div class="VideoSlider"  @mousedown="TimeChange" ref="slider">
                    <div class="VideoSliderBar" :style="{'width':ProcessWidth}">
                        <span></span>
                    </div>
                    <div class="VideoTempBar" :style="{'width':CacheWidth}"></div>
                </div>
                <div class="VideoTime">{{TimeText}}</div>
                <div class="sf-icon-volume-up" @mousedown.stop="VolumnState?VolumnState=false:VolumnState=true"></div>
                <div :class="FullButton" @click="FullScreen(FullButton)"></div>
            </div>
            <div class="VideoVolumn" v-show="VolumnState">
                <div class="VideoVolumnSlider" ref="volunm" @mousedown="ChangeVolumn">
                    <div class="VideoVolumnSliderBar">
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Media from '../media/media';
    import electron from 'electron';
    const {ipcRenderer} = require('electron');
    let VideoPlayer=electron.remote.getCurrentWindow();
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "DiskVideoPlayer",
        watch:{
            PlayList: {
                handler(newValue, oldValue) {

                },
                deep: true
            },
            FullFlag:{
                handler(newValue, oldValue) {
                    if(this.FullFlag){
                        clearTimeout(this.TimeOutID);
                        this.TimeOutID=setTimeout(()=>{
                            this.BarAnimation='animated fadeOut';
                            this.VideoHeight='100%';
                            clearTimeout(this.TimeOutID);
                        },5000);
                        this.FullButton='sf-icon-compress';
                    }else{
                        this.BarAnimation='animated slideIn';
                        this.VideoHeight='calc(100% - 70px)';
                        this.FullButton='sf-icon-expand';
                    }
                },
            },
        },
        data(){
            return{
                PlayList:[],
                ButtonState:"sf-icon-window-maximize",//右上角窗口按钮状态
                NowPlay:{
                    disk_name:'准备播放',
                    count:0,
                },
                TimeText:'00:00/00:00',
                ProcessWidth:0,
                VideoHeight:'calc(100% - 70px)',
                CacheWidth:0,
                PlayButtonState:'sf-icon-play',
                VolumnState:false,
                animation:'',
                BarAnimation:'',
                FullFlag:false,
                FullButton:'sf-icon-expand',
                TimeOutID:0,
            }
        },
        created(){
            ipcRenderer.on('VideoList', (event, data)=>{//接收打开文件的数据
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
                VideoPlayer.on('maximize',()=>{
                    this.ButtonState='sf-icon-window-restore';
                });
                VideoPlayer.on('unmaximize',()=>{
                    this.ButtonState='sf-icon-window-maximize';
                });
                ipcRenderer.on('video-Prev',()=>{
                    this.Prev()
                });
                ipcRenderer.on('video-Play',()=>{
                    this.PlayControl();
                });
                ipcRenderer.on('video-Next',()=>{
                    this.Next();
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
                let media=this.$refs.video;
                if(media.paused){
                    media.play();
                    this.PlayButtonState='sf-icon-pause';
                    this.animation='animated zoomOut';
                    ipc.send('video-play-state','pause')
                }else{
                    media.pause();
                    this.PlayButtonState='sf-icon-play';
                    this.animation='animated zoomIn';
                    ipc.send('video-play-state','play')
                }
                VideoPlayer.setTitle(this.NowPlay.disk_name);
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
                let media=this.$refs.video;
                let volunm=this.$refs.volunm;
                Media.MediaControl(media,'volunm','y',volunm,event)
            },
            VideoEnded(){
                let media=this.$refs.video;
                media.currentTime=0;
                this.PlayControl();
            },
            TimeChange(){
                let media=this.$refs.video;
                let slider=this.$refs.slider;
                Media.MediaControl(media,'play','x',slider,event);
                this.PlayControl()
            },
            VideoProcess(){
                let media=this.$refs.video;
                this.TimeText=Media.secondDeal(media.currentTime)+ '/' +Media.secondDeal(media.duration);
                this.ProcessWidth=Math.round(media.currentTime) / Math.round(media.duration) * 100 + "%";
            },
            VideoCache(){
                let media=this.$refs.video;
                try {
                    this.CacheWidth = (media.buffered.end(media.buffered.length - 1) / media.duration).toFixed(2) * 100 + '%';
                }catch (e) {

                }
            },
            ShowControl(){
                if(this.FullFlag){
                    this.BarAnimation='animated slideIn';
                    this.VideoHeight='calc(100% - 70px)';
                }
            },
            HideControl(){
                if(this.FullFlag){
                    clearTimeout(this.TimeOutID);
                    this.TimeOutID=setTimeout(()=>{
                        this.BarAnimation='animated fadeOut';
                        this.VideoHeight='100%';
                        clearTimeout(this.TimeOutID);
                    },5000);
                }
            },
            FullScreen(flag){
                let el=this.$refs.VideoPlayer;
                el.focus();
                if(this.FullFlag){
                    document.exitFullscreen?document.exitFullscreen():
                        document.mozCancelFullScreen?document.mozCancelFullScreen():
                            document.webkitExitFullscreen?document.webkitExitFullscreen():'';
                    this.FullFlag=false;
                }else{
                    (el.requestFullscreen&&el.requestFullscreen())||
                    (el.mozRequestFullScreen&&el.mozRequestFullScreen())||
                    (el.webkitRequestFullscreen&&el.webkitRequestFullscreen())||(el.msRequestFullscreen&&el.msRequestFullscreen());
                    this.FullFlag=true;
                }
            },
            restore(){
                if (VideoPlayer.isMaximized()) {
                    VideoPlayer.restore();
                } else {
                    VideoPlayer.maximize();
                }
            },
            close(){
                VideoPlayer.close();
            },
            mini(){
                VideoPlayer.minimize();
            }
        }
    }
</script>

<style scoped>
    @import url("../../../static/css/Slimf.css");
    @import url("../../../static/css/disk.css");
</style>