<template>
    <div class="ImageShowContainer" @mousewheel="MouseZoom">
        <div class="CloudDiskInfoControl">
            <p style="width: calc(100% - 120px)">{{NowShow.disk_name}}</p>
            <button class="sf-icon-times" @click="close"></button>
            <button :class="ButtonState" @click="restore"></button>
            <button class="sf-icon-window-minimize" @click="mini"></button>
        </div>
        <img :class="'ImgShow '+(!Control?'ImgAnim':'')" :src="NowShow.URL" ref="ImgShow" @load="onload" @mousedown="Drag">
        <Spin fix v-show="loaded">
            <Icon type="load-c" size=18 class="loading"></Icon>
            <div>加载中</div>
        </Spin>
        <div class="ImageShowZoom" :style="{'opacity':ZoomWin}">{{ratioPercent}}</div>
        <div class="ImgControl">
            <p>{{NowShow.count+1}}/{{PhotoList.length}}</p>
            <ul>
                <li class="sf-icon-search-plus" @click="Zoom(1)"></li>
                <li class="sf-icon-search-minus" @click="Zoom(-1)"></li>
                <li tooltip="实际尺寸" onclick="ImageShow.cut(0)">1:1</li>
                <li class="sf-icon-angle-left" @click="Prev"></li>
                <li class="sf-icon-angle-right" @click="Next"></li>
                <li class="sf-icon-undo" @click="roate(-90)"></li>
                <li class="sf-icon-redo" @click="roate(90)"></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import electron from 'electron';
    const {ipcRenderer} = require('electron');
    let PictureShower=electron.remote.getCurrentWindow();
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "DiskPictureShower",
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
                ratio:1,
                ratioPercent:'0%',
                ZoomWin:0,
                ButtonState:"sf-icon-window-maximize",//右上角窗口按钮状态
                PhotoList:[],
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
        },
        created(){
            ipcRenderer.on('PhotoList', (event, data)=>{//接收打开文件的数据
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
            this.bind();
        },
        methods:{
            bind(){
                PictureShower.on('maximize',()=>{
                    this.ButtonState='sf-icon-window-restore';
                });
                PictureShower.on('unmaximize',()=>{
                    this.ButtonState='sf-icon-window-maximize';
                });
            },
            onload(){
                this.loaded=true;
                this.ratio=1;
                this.angle=0;
                let img_show= this.$refs.ImgShow;
                img_show.removeAttribute("style");
                let time_p1=setInterval(()=>{
                    let imgW=img_show.offsetWidth;
                    if(img_show.complete){
                        if(img_show.offsetHeight>document.body.offsetHeight||imgW>document.body.offsetWidth){
                            this.ratio = (document.body.offsetWidth / imgW);
                            console.log(this.ratio)
                            img_show.style.width=(imgW * this.ratio)+'px';
                            console.log(img_show.offsetWidth , this.ratio,(imgW * this.ratio))
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
                img_show.style.left = (document.body.offsetWidth - img_show.offsetWidth) / 2 + "px";
                img_show.style.top = (document.body.offsetHeight - img_show.offsetHeight) / 2 + "px";
            },
            ShowPicture(item,index){
                this.NowShow=item;
                this.NowShow.count=index;
                this.NowShow.URL=localStorage.server+'/'+item.disk_main;
            },
            Zoom(a){
                debugger
                let img_show= this.$refs.ImgShow;
                let imgW=img_show.offsetWidth;
                if (a>0&&this.ratio<10) {
                    this.ratio=this.ratio +0.1;
                }else if(a<0&&this.ratio>0.3){
                    this.ratio=this.ratio-0.1;
                }
                this.Control=false;
                img_show.style.width =(imgW * this.ratio)+'px';
                this.centerImg();
                this.ZoomWin=1;
                this.ratioPercent= (this.ratio*100).toFixed(0) + '%';
                let time_p = setTimeout(()=>{
                    this.ZoomWin=0;
                    time_p && clearTimeout(time_p);
                }, 1500);
            },
            Drag(){
                let img_show= this.$refs.ImgShow;
                let e=event;
                let _this=this;
                e.preventDefault();
                let startX = e.pageX;
                let startY = e.pageY;
                document.onmousemove = (e)=> {
                    this.Control=true;
                    let center_x = img_show.offsetLeft;
                    let center_y = img_show.offsetTop;
                    let isl = e.pageX - startX + center_x,
                        ist = e.pageY - startY + center_y;
                    if (isl < (-img_show.offsetWidth + 10) || isl > (document.body.offsetWidth - 10)||ist < (-img_show.offsetHeight + 10) || ist > (document.body.offsetHeight - 10)) {
                        document.onmousemove = null;
                        this.centerImg();
                        return;
                    }
                    img_show.style.left = isl + 'px';
                    img_show.style.top = ist + 'px';
                    startX = e.pageX;
                    startY = e.pageY;
                    document.onmouseup=function () {
                        _this.Control=false;
                        this.onmousemove=null
                    };
                };
                document.onmouseup=function () {
                    _this.Control=false;
                    this.onmousemove=null
                };
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
            restore(){
                if (PictureShower.isMaximized()) {
                    PictureShower.restore();
                } else {
                    PictureShower.maximize();
                }
            },
            close(){
                PictureShower.close();
            },
            mini(){
                PictureShower.minimize();
            }
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