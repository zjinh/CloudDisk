<template>
    <section class="cd-left">
        <div class="cd-left-head">
            <img draggable="false" class="logo" :src="static+'/img/bar/disk.png'" alt="">
            <span><img class="logo-text" :src="static+'/img/logo/c-disk.png'" alt=""></span>
            <p>{{DiskData.DiskSize.text}}</p>
        </div>
        <ul class="cd-left-menu">
            <li v-for="(item,index) in ClassifyMenuData" ripple :class="item.active" @click="change(index)">
                <i :class="item.icon"></i>{{item.name}}<div v-show="item.count>0">{{item.count}}</div>
            </li>
        </ul>
        <div class="cd-left-bottom">
            <img :src="BottomSrc" draggable="false" alt="">
            <section v-show="show">
                <div class="cd-select-tips">{{DiskData.SelectTips}}</div>
                <!--<div class="CloudDiskSliderContainer">
                    <div class="CloudDiskSlider" :style="{'width':DiskData.DiskSize.Percent,background:DiskData.DiskSize.Background}"></div>
                </div>-->
            </section>
        </div>
    </section>
</template>

<script>
    export default {
        name: "DiskClassify",
        props:{
            type:{
                type:String
            },
            DiskData:{
                type:Object
            },
            show:{
                type:Boolean
            }
        },
        beforeMount(){
            this.ClassifyMenuData=this.TypeData;
            setInterval(() => {
                this.background();
            }, 1000);
        },
        watch:{
            type: {
                handler() {
                    this.UpdateData();
                },
                deep: true
            },
        },
        computed:{
            static(){
                return this.$path.join(__static)
            },
        },
        data(){
            return{
                TypeData:[
                    {"name":"全部文件","icon":"sf-icon-hdd","data":"normal","active":"active"},
                    {"name":"图片","icon":"sf-icon-image","data":"picture","active":""},
                    {"name":"视频","icon":"sf-icon-video","data":"video","active":""},
                    {"name":"文档","icon":"sf-icon-file-alt","data":"document","active":""},
                    {"name":"音乐","icon":"sf-icon-music","data":"music","active":""},
                    {"name":"种子","icon":"sf-icon-magnet","data":"torrent","active":""},
                    {"name":"其他","icon":"sf-icon-puzzle-piece","data":"other","active":""},
                    {"name":"回收站","icon":"sf-icon-trash","data":"trash","active":""},
                ],//网盘分类参数
                ShareData:[
                    {"name":"我的分享","icon":"sf-icon-link","data":"share","active":"active"},
                    {"name":"失效分享","icon":"sf-icon-unlink","data":"disshare","active":""},
                ],//分享分类参数
                TransData:[
                    {"name":"正在下载","icon":"sf-icon-download","count":0,"data":"download","active":"active"},
                    {"name":"正在上传","icon":"sf-icon-upload","count":0,"data":"upload","active":""},
                    {"name":"传输完成","icon":"sf-icon-check-circle","count":0,"data":"completed","active":""},
                ],//传输分类参数,
                ClassifyMenuData:[],
                /*自动切换背景*/
                BottomSrc: this.$path.join(__static, '/img/bg/Autumn-bottom-1.png'),
            }
        },
        methods:{
            background(){
                let season = 'Spring';
                let tag = 0;
                let D = new Date();
                let month = D.getMonth();
                let hHour = D.getHours();
                if (month > 2 && month < 6) {
                    season = 'Spring'
                } else if (month > 5 && month < 9) {
                    season = 'Summer';
                } else if (month > 8 && month < 12) {
                    season = 'Autumn'
                } else if (month === 12 || month === 1 || month === 2) {
                    season = 'Winter'
                }
                if (hHour >= 1 && hHour <= 8) {
                    tag = 0;
                } else if (hHour > 8 && hHour <= 16) {
                    tag = 1
                } else if (hHour > 16 && hHour <= 18) {
                    tag = 2
                } else if (hHour > 18 && hHour <= 24) {
                    tag = 3
                }
                this.BottomSrc = this.$path.join(__static, '/img/bg/' + season + '-bottom-' + tag + '.png');
            },
            UpdateData(){
                switch (this.type) {
                    case 'disk':
                        this.ClassifyMenuData=this.TypeData;
                        break;
                    case 'share':
                        this.ClassifyMenuData=this.ShareData;
                        break;
                    case 'trans':
                        this.ClassifyMenuData=this.TransData;
                        break;
                }
                this.ClassifyMenuData.forEach((item)=>{
                    if(item.active){
                        this.$emit("change", this.type,item)
                    }
                });
            },
            change(index) {
                this.ClassifyMenuData.forEach(function (item) {
                    item.active = false
                });
                this.ClassifyMenuData[index].active = 'active';
                this.$emit("callback", this.type,this.ClassifyMenuData[index])
            }
        }
    }
</script>

<style scoped>
    /*左侧头部*/
    .cd-left{
        float: left;
        width:200px;
        height: 100%;
        background: #f4f5f7;
        font-weight: 600;
        color: #4d515a;
    }
    .cd-left-head{
        width: 100%;
        padding:20px 0 30px 20px;
    }
    .cd-left-head *{
        float: left;
    }
    .cd-left-head .logo{
        width: 40px;
        height: 40px;
        box-shadow: 0 0 15px 0 rgba(0,0,0,.1);
        border-radius: 100%;
    }
    .cd-left-head span{
        line-height: 40px;
        padding: 0 10px 0 0;
        -webkit-app-region: drag;
        font-size: 16px;
        margin-left: 5px;
    }
    .cd-left-head .logo-text{
        width: 110px;
    }
    .cd-left-head p{
        margin-left: 11px;
        font-size: 10px;
        color: #4f4f4f;
    }
    /*左侧菜单*/
    .cd-left-menu{
        width: 100%;
        height: calc(100% - 80px);
        overflow: auto;
        position: relative;
        z-index: 2;
    }
    .cd-left-menu li{
        width: 168px;
        height: 35px;
        line-height: 35px;
        cursor: pointer;
        font-size: 14px;
        margin: 8px auto;
        border-radius: 3px;
        margin-top: 0;
    }
    .cd-left-menu li:hover,.cd-left-menu .active{
        color: #5b5bea!important;
        background-color: #EAECF0;
    }
    .cd-left-menu i{
        float: left;
        width: 35px;
        height: 35px;
        display: block;
        text-align: center;
        line-height: 35px;
        font-size: 16px;
        margin-right: 12px;
    }
    .cd-left-menu li div{
        float: right;
        padding: 0 6px;
    }
    /*底部*/
    .cd-left-bottom{
        width: 200px;
        height: 120px;
        position: absolute;
        bottom: 0;
        font-weight: normal;
    }
    .cd-left-bottom img{
        width: 100px;
    }
    /*文件选择提示*/
    .cd-select-tips{
        width: 100%;
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        padding: 0 5px;
        color: #505050;
        position: absolute;
        bottom:1px;
        text-align: right;
    }
    /*!*网盘使用条*!
    .CloudDiskSliderContainer{
        width: 100px;
        height: 15px;
        background: #f4f5f7;
        border-radius: 10px 0 0 0;
        position: absolute;
        bottom: 0;
        right: 0;
    }
    .CloudDiskSliderContainer div{
        float: left;
        height: 100%;
        width: 0;
        background: #7c7cee;
        -webkit-transition: all .35s;
        -moz-transition: all .35s;
        -o-transition: all .35s
    }
    .CloudDiskSliderContainer p{
        width: 100%;
        position: absolute;
        text-align: center;
        font-size: 10px;
    }*/
</style>