<template>
    <div class="WindowContainer" ref="VideoPlayer" @mousedown="VolumnState=false" tabindex="-1" @keydown.esc="FullScreen(true)" @keydown.space="PlayControl" @keydown.left="ChangeTime('-')" @keydown.right="ChangeTime('+')">
        <WindowsHeader :data=header></WindowsHeader>
        <div class="VideoContainer">
            <video :style="{'height':VideoHeight}" crossorigin="*" @error="VideoError" @ended="VideoEnded" @dblclick="FullScreen" @click="PlayControl" @progress="VideoCache" @timeupdate="VideoProcess" ref="video"  @durationchange="PlayButtonState='sf-icon-pause'" @seeking="PlayButtonState='sf-icon-circle-notch sf-spin'" @canplay="PlayControl" :src="NowPlay.PlayUrl">
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
                <div :class="'sf-icon-volume-up '+(VolumnState?'VideoVolumn-active':'')" @mousedown.stop="VolumnState?VolumnState=false:VolumnState=true"></div>
                <div :class="FullButton" @click="FullScreen(FullButton)"></div>
                <div class="VideoVolumn" v-show="VolumnState">
                    <div class="VideoVolumnSlider" ref="volunm" @mousedown="ChangeVolumn">
                        <div class="VideoVolumnSliderBar">
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Media from '../api/media';
    import WindowsHeader from "./DiskWindow/WindowHeader";
    export default {
        name: "DiskVideoPlayer",
        components:{WindowsHeader},
        watch:{
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
                        this.BarAnimation='animated slideInUp';
                        this.VideoHeight='calc(100% - 70px)';
                        this.FullButton='sf-icon-expand';
                    }
                },
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
                VideoHeight:'calc(100% - 70px)',
                CacheWidth:0,
                PlayButtonState:'sf-icon-play',
                VolumnState:false,
                animation:'',
                BarAnimation:'',
                FullFlag:false,
                FullButton:'sf-icon-expand',
                TimeOutID:0,
                header:{
                    title:"",
                }
            }
        },
        created(){
            this.$ipc.on('win-data', (event, data)=>{//接收打开视频文件的数据
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
                this.$ipc.on('video-Prev',()=>{
                    this.Prev()
                });
                this.$ipc.on('video-Play',()=>{
                    this.PlayControl();
                });
                this.$ipc.on('video-Next',()=>{
                    this.Next();
                });
            },
            playCallBack(item,index){
                this.NowPlay=item;
                this.NowPlay.count=index;
                this.NowPlay.PlayUrl=item.disk_main;
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
                    this.$ipc.send('player-control','video','pause')
                }else{
                    media.pause();
                    this.PlayButtonState='sf-icon-play';
                    this.animation='animated zoomIn';
                    this.$ipc.send('player-control','video','play')
                }
                this.header.title=this.NowPlay.disk_name;
                this.$refs.VideoPlayer.focus();
            },
            ChangeTime(state){
                let media=this.$refs.video;
                if(state==='-'){
                    media.currentTime=media.currentTime-5;
                }else{
                    media.currentTime=media.currentTime+5
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
                this.$refs.VideoPlayer.focus();
                if(this.FullFlag){
                    this.BarAnimation='animated slideInUp';
                    this.VideoHeight='calc(100% - 70px)';
                }
            },
            HideControl(){
                this.$refs.VideoPlayer.focus();
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
                if(flag){
                    document.exitFullscreen?document.exitFullscreen():
                        document.mozCancelFullScreen?document.mozCancelFullScreen():
                            document.webkitExitFullscreen?document.webkitExitFullscreen():'';
                    this.$nextTick(()=>{
                        this.FullFlag=false;
                    });
                    clearTimeout(this.TimeOutID)
                }
                if(this.FullFlag){
                    document.exitFullscreen?document.exitFullscreen():
                        document.mozCancelFullScreen?document.mozCancelFullScreen():
                            document.webkitExitFullscreen?document.webkitExitFullscreen():'';
                    this.$nextTick(()=>{
                        this.FullFlag=false;
                    });
                    clearTimeout(this.TimeOutID)
                }else{
                    (el.requestFullscreen&&el.requestFullscreen())||
                    (el.mozRequestFullScreen&&el.mozRequestFullScreen())||
                    (el.webkitRequestFullscreen&&el.webkitRequestFullscreen())||(el.msRequestFullscreen&&el.msRequestFullscreen());
                    this.$nextTick(()=>{
                        this.FullFlag=true;
                    });
                }
            },
            VideoError(e){
                console.log(e)
            },
        }
    }
</script>

<style scoped>

</style>