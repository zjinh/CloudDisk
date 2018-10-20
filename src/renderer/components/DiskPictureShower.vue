<template>
    <div class="ImageShowContainer" @mousewheel="MouseZoom" tabindex="-1"  @keydown.left="Prev" @keydown.right="Next">
        <WindowsHeader :data=header></WindowsHeader>
        <p class="ImageShowTips"> <span class="ImageShowZoom" :style="{'opacity':ZoomWin}">{{ZoomPercent}}</span>{{NowShow.count+1}}/{{PhotoList.length}}</p>
        <img :class="'ImgShow '+(!Control?'ImgAnim':'')" :src="NowShow.URL" ref="ImgShow" @load="onload" @mousedown="Drag">
        <Spin v-show="loaded">
            <Icon type="ios-loading" size=26 class="loading"></Icon>
        </Spin>
        <ul class="ImgControl">
            <li class="sf-icon-search-plus" @click="Zoom(1)"></li>
            <li class="sf-icon-search-minus" @click="Zoom(-1)"></li>
            <li class="sf-icon-angle-left" @click="Prev"></li>
            <li  @click="orginz">1:1</li>
            <li class="sf-icon-angle-right" @click="Next"></li>
            <li class="sf-icon-undo" @click="roate(-90)"></li>
            <li class="sf-icon-redo" @click="roate(90)"></li>
        </ul>
    </div>
</template>

<script>
    import electron from 'electron';
    let PictureShower=electron.remote.getCurrentWindow();
    let ipc=require('electron').ipcRenderer;
    import WindowsHeader from "./DiskWindow/WindowHeader";
    export default {
        name: "DiskPictureShower",
        components:{WindowsHeader},
        data(){
            return{
                loaded:false,
                Control:false,
                NowShow:{
                    disk_name:"",
                    count:0,
                    URL:''
                },
                angle:0,
                ZoomSize:1,
                ZoomPercent:'0%',
                ZoomWin:0,
                PhotoList:[],
                header:{
                    title:"",
                    background: 'rgba(103, 103, 103, 0.5)',
                    color:'#fff'
                }
            }
        },
        watch:{
            PhotoList: {
                handler(newValue, oldValue) {
                    this.PhotoList.forEach((item, index) => {
                        if (item.now) {
                            item.now = 'PlayThis';
                            this.ShowPicture(item, index);
                        }
                    });
                },
                deep: true
            },
            ZoomSize:{
                handler(newValue, oldValue) {
                    this.ZoomPercent= (this.ZoomSize*100).toFixed(0) + '%';
                },
                deep: true
            }
        },
        created(){
            ipc.on('PhotoList', (event, data)=>{//接收打开文件的数据
                this.$nextTick(()=>{
                    data.forEach((item,index)=>{
                        item.now=false;
                        item.count=index;
                        if(item.active){
                            item.now='PlayThis';
                            this.ShowPicture(item,index);
                        }
                    });
                    this.PhotoList=data;
                });
            });
        },
        methods:{
            onload(){
                this.loaded=true;
                this.ZoomSize=1;
                this.angle=0;
                let img_show= this.$refs.ImgShow;
                img_show.removeAttribute("style");
                document.getElementsByClassName('ImageShowContainer')[0].focus();
                let time_p1=setInterval(()=>{
                    let imgW=img_show.offsetWidth;
                    if(img_show.complete){
                        if(img_show.offsetHeight>window.innerHeight||imgW>window.innerWidth){
                            let ratio=(window.innerWidth / imgW);
                            img_show.style.width=(imgW * ratio)+'px';
                        }
                        this.centerImg();
                        this.loaded=false;
                        img_show.style.opacity=1;
                    }
                    time_p1&&clearInterval(time_p1);
                },500);
            },
            centerImg(){
                this.loaded=false;
                let img_show= this.$refs.ImgShow;
                img_show.style.left = "0";
                img_show.style.top = "0";
            },
            ShowPicture(item,index){
                this.NowShow=item;
                this.NowShow.count=index;
                this.NowShow.URL=item.disk_main;
                PictureShower.setTitle(item.disk_name+'-图片查看');
                this.header.title=item.disk_name+'-图片查看';
            },
            orginz(){
                let img_show= this.$refs.ImgShow;
                img_show.removeAttribute('style');
                this.ZoomSize=1;
                this.centerImg();
            },
            Zoom(a){
                this.Control=true;
                let img_show= this.$refs.ImgShow;
                let oldWidth = img_show.offsetWidth;
                let oldHeight = img_show.offsetHeight;
                let oldLeft = img_show.offsetLeft;
                let oldTop = img_show.offsetTop;
                let scaleX = (event.clientX - oldLeft) / oldWidth; //比例
                let scaleY = (event.clientY - oldTop) / oldHeight;
                if (a<0&&this.ZoomSize>0.3) {
                    this.ZoomSize=this.ZoomSize-0.1;
                    img_show.style.width = img_show.offsetWidth * 0.9 + "px";
                    img_show.style.height = img_show.offsetHeight * 0.9 + "px";
                } else if(a>0&&this.ZoomSize<3){
                    this.ZoomSize=this.ZoomSize +0.1;
                    img_show.style.width = img_show.offsetWidth * 1.1 + "px";
                    img_show.style.height = img_show.offsetHeight * 1.1 + "px";
                }
                let newWidth = img_show.offsetWidth;
                let newHeight = img_show.offsetHeight;
                //img_show.style.left = oldLeft - scaleX * (newWidth - oldWidth) + "px";
                //img_show.style.top = oldTop - scaleY * (newHeight - oldHeight) + "px";
                this.ZoomWin=1;
                let time_p = setTimeout(()=>{
                    this.ZoomWin=0;
                    time_p && clearTimeout(time_p);
                    this.Control=false;
                }, 1500);
                this.centerImg();
            },
            Drag(){
                let img_show= this.$refs.ImgShow;
                event.preventDefault();
                let _this=this;
                this.Control=true;
                let oDragObj = img_show;
                let nTY = parseInt(oDragObj.style.top+0);
                let y =  event.clientY;
                let nTX = parseInt(oDragObj.style.left+0);
                let x = event.clientX;
                document.onmousemove=function (event) {
                    let top=( nTY + event.clientY - y);
                    let left=( nTX + event.clientX - x);
                    if(left < (-img_show.offsetWidth*2+ 10) || left > (window.innerWidth - 10)||top < (-img_show.offsetHeight*2 + 10) || top > (window.innerHeight*2 - 20)){
                        document.onmousemove = null;
                        _this.centerImg();
                        return
                    }
                    oDragObj.style.top =  top+"px";
                    oDragObj.style.left = left+"px";
                    document.onmouseup=function () {
                        _this.Control=false;
                        this.onmousemove=null
                    };
                };
                document.onmouseup=function () {
                    _this.Control=false;
                    this.onmousemove=null
                };
                return false;
            },
            MouseZoom(){
                this.Zoom(event.wheelDelta);
            },
            roate(a) {
                let img_show= this.$refs.ImgShow;
                this.angle=this.angle+a;
                img_show.style.webkitTransform = 'rotate(' + this.angle + 'deg)';
            },
            Next(){
                if(!this.PhotoList.length){
                    return
                }
                let NowCount=this.NowShow.count;
                let AllCount=this.PhotoList.length;
                if(NowCount!==AllCount-1){
                    this.PhotoList.forEach((item,index)=>{
                        item.now=false;
                    });
                    this.PhotoList[NowCount+1].now='PlayThis'
                }
            },
            Prev(){
                if(!this.PhotoList.length){
                    return
                }
                let NowCount=this.NowShow.count;
                if(this.NowShow.count!==0){
                    this.PhotoList.forEach((item,index)=>{
                        item.now=false;
                    });
                    this.PhotoList[NowCount-1].now='PlayThis'
                }
            },
        }
    }
</script>

<style scoped>
    .loading{
        animation: loading 1s linear infinite;
    }
    @keyframes loading {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>