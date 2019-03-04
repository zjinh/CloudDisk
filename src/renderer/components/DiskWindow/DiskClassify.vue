<template>
    <div class="CloudDiskLeft">
        <ul class="CloudDiskClassify">
            <li v-for="(item,index) in ClassifyMenuData" ripple :class="item.active" @click="change(index)">
                <span :class="item.icon"></span>
                {{item.name}}
                <div v-show="item.count>0">{{item.count}}</div>
            </li>
        </ul>
        <img :src="BottomSrc" draggable="false">
        <div class="CloudDiskSelectTips" v-show="show">{{DiskData.SelectTips}}</div>
        <div class="CloudDiskCapacity" v-show="show">
            <div class="CloudDiskSliderContainer">
                <div class="CloudDiskSlider" :style="{'width':DiskData.DiskSize.Percent,background:DiskData.DiskSize.Background}"></div>
            </div>
            <p>{{DiskData.DiskSize.text}}</p>
        </div>
    </div>
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
        data(){
            return{
                TypeData:[
                    {"name":"全部文件","icon":"sf-icon-hdd","data":"normal","active":"CloudDiskClassifyActive"},
                    {"name":"图片","icon":"","data":"picture","active":""},
                    {"name":"视频","icon":"","data":"video","active":""},
                    {"name":"文档","icon":"","data":"document","active":""},
                    {"name":"音乐","icon":"","data":"music","active":""},
                    {"name":"种子","icon":"","data":"torrent","active":""},
                    {"name":"其他","icon":"","data":"other","active":""},
                    {"name":"回收站","icon":"sf-icon-trash","data":"trash","active":""},
                ],//网盘分类参数
                ShareData:[
                    {"name":"我的分享","icon":"","data":"share","active":"CloudDiskClassifyActive"},
                    {"name":"失效分享","icon":"","data":"disshare","active":""},
                ],//分享分类参数
                TransData:[
                    {"name":"正在下载","icon":"sf-icon-download","count":0,"data":"download","active":"CloudDiskClassifyActive"},
                    {"name":"正在上传","icon":"sf-icon-upload","count":0,"data":"upload","active":""},
                    {"name":"传输完成","icon":"sf-icon-check-circle","count":0,"data":"finish","active":""},
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
                this.ClassifyMenuData[index].active = 'CloudDiskClassifyActive';
                this.$emit("callback", this.type,this.ClassifyMenuData[index])
            }
        }
    }
</script>

<style scoped>

</style>