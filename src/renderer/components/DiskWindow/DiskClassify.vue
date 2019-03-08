<template>
    <section class="cd-left">
        <div class="cd-left-head">
            <img draggable="false" :src="static+'/img/bar/disk.png'"><span>CloudDisk</span>
        </div>
        <ul class="cd-left-menu">
            <li v-for="(item,index) in ClassifyMenuData" ripple :class="item.active" @click="change(index)">
                <i :class="item.icon"></i>{{item.name}}<div v-show="item.count>0">{{item.count}}</div>
            </li>
            <img :src="BottomSrc" draggable="false">
        </ul>
        <div class="CloudDiskSelectTips" v-show="show">{{DiskData.SelectTips}}</div>
        <div class="CloudDiskCapacity" v-show="show">
            <div class="CloudDiskSliderContainer">
                <div class="CloudDiskSlider" :style="{'width':DiskData.DiskSize.Percent,background:DiskData.DiskSize.Background}"></div>
            </div>
            <p>{{DiskData.DiskSize.text}}</p>
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
            BottomSrc:{
                type:String
            },
            show:{
                type:Boolean
            }
        },
        beforeMount(){
            this.ClassifyMenuData=this.TypeData;
        },
        watch:{
            type: {
                handler(newValue, oldValue) {
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
                ClassifyMenuData:[]
            }
        },
        methods:{
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
        padding: 20px 30px;
    }
    .cd-left-head *{
        float: left;
    }
    .cd-left-head img{
        width: 40px;
        height: 40px;
        box-shadow: 0px 0px 15px 0px rgba(0,0,0,.1);
        border-radius: 100%;
    }
    .cd-left-head span{
        line-height: 40px;
        padding: 0 10px 0px 0px;
        -webkit-app-region: drag;
        font-size: 16px;
        margin-left: 8px;
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
    .cd-left-menu img{
        width: 100px;
        position: absolute;
        bottom: 0;
    }
    /*网盘使用条*/
    .CloudDiskCapacity{
        width: 100%;
        height: 35px;
        position: relative;
        z-index: 2;
    }
    .CloudDiskCapacity p{
        font-size: 12px;
        text-indent: 6px;
        color: #505050;
        margin-top: 3px;
        text-align: right;
        padding: 0 5px;
        text-shadow: 0px 0px 0px

    }
    .CloudDiskSliderContainer{
        width: 95%;
        height: 10px;
        margin: 2px auto;
        background: #d2d2d2;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
    }
    .CloudDiskSliderContainer div{
        width: 0px;
        background: #2682fc;
        height: 100%;
        float: left;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        -webkit-transition: all .35s;
        -moz-transition: all .35s;
        -o-transition: all .35s
    }
    /*文件选择提示*/
    .CloudDiskSelectTips{
        width: 100%;
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        padding: 0 5px;
        color: #505050;
        position: relative;
        z-index: 2;
    }
</style>