<template>
    <div class="CloudDiskAbout">
        <div class="CloudDisk-window-header-big">
            <img src="../../../static/img/bar/disk.png" draggable="false">
            <p>关于我们</p>
            <button class="sf-icon-times" @click="close"></button>
        </div>
        <div class="CloudDiskAbout-main">
            <p class="title">关于CloudDisk</p>
            <p>开发人员：ZJINH</p>
            <p>联系邮箱：2665229856@qq.com</p>
            <p>当前版本：V{{version}} 正式版 ({{platform}})<span>{{NewVersion}}</span></p>
            <p class="tips">{{message}}&nbsp</p>
            <div class="process">
                <Progress :percent="percent" v-show="StartDown"></Progress>
            </div>
            <div class="bottom">
                <p class="release">Copyright ©2014-2018 ZJINH All rights reserved.</p>
                <Button type="primary" :loading="loading" @click="checkUpdate">
                    <span v-if="!loading">{{CheckText}}</span>
                    <span v-else>{{ProcessText}}</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DiskAbout",
        data(){
            return{
                platform:'未知',
                loading: false,
                CheckText:'检查更新',
                ProcessText:"正在检查",
                StartDown:false,
                NewVersion:'',
                message:'',
                percent:0
            }
        },
        computed: {
            version(){
                return this.$route.params.version;
            }
        },
        created(){
            this.platform=process.platform;
            this.bind();
        },
        watch:{
            percent: {
                handler() {
                    this.StartDown=true;
                    this.ProcessText='正在下载';
                },
                deep: true
            },
        },
        methods:{
            bind(){
                this.$ipc.on('check-for-update',(event,message) =>{
                    this.message=message;
                    if(message==='检查更新出错, 请联系开发人员'||message==='现在使用的就是最新版本，不用更新'){
                        this.loading=false;
                    }
                    if(message==='最新版本已下载，点击安装进行更新'){
                        this.CheckText='安装';
                        this.loading = false;
                        this.percent=100;
                        this.checkUpdate=()=>{
                            this.$ipc.send('system','update');
                        }
                    }
                });
                this.$ipc.on('update-down-success',(event,message) =>{
                    this.NewVersion='新版本：V'+message.version;
                });
                this.$ipc.on('download-progress',(event,message)=>{
                    this.$nextTick(()=>{
                        this.percent=parseInt(message.percent);
                        if(this.percent===100){
                            this.CheckText='安装';
                            this.loading = false;
                            this.checkUpdate=()=>{
                                this.$ipc.send('system','update');
                            }
                        }
                    });
                })
            },
            checkUpdate () {
                this.$ipc.send('system','check-for-update',localStorage.server);
                this.loading = true;
            },
            close() {
                this.$electron.remote.getCurrentWindow().hide();
            }
        }
    }
</script>

<style scoped>
    /*关于信息窗口*/
    .CloudDiskAbout{
        width: 100%;
        height: 100%;
    }
    .CloudDisk-window-header-big{
        width: 100%;
        height: 50px;
        /*background: url("@/static/img/login/right-bg.png");*/
        background-size: cover;
        background-position: -160px 58px;
        background-repeat: repeat-y;
        border-bottom: 2px solid #eee;
        -webkit-app-region: drag;
        background-color: #3b54a8;
    }
    .CloudDisk-window-header-big *{
        float: left;
    }
    .CloudDisk-window-header-big img{
        margin: 8px;
        width: 32px;
        height: 32px;
    }
    .CloudDisk-window-header-big p{
        font-size: 14px;
        line-height: 48px;
        color: #fff;
    }
    .CloudDisk-window-header-big button{
        float: right;
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 15px;
        -webkit-app-region: no-drag;
        background: none;
        color: #fff;
        margin: 9px;
        border-radius:5px;
    }
    .CloudDisk-window-header-big button:hover{
        background: rgba(255,255,255,.1);
    }
    .CloudDiskAbout-main{
        width: 100%;
        height: calc(100% - 50px);
        background: #fff;
        padding:10px 20px;
    }
    .CloudDiskAbout-main p{
        font-weight: bold;
        padding: 5px 0;
        font-size: 14px;
    }
    .CloudDiskAbout-main .title{
        font-size: 16px;
        border-bottom: 1px solid #eee;
    }
    .CloudDiskAbout-main .release{
        float: left;
        font-size: 12px;
        color: #888888;
    }
    .CloudDiskAbout-main .tips{

    }
    .CloudDiskAbout-main p span{
        padding-left: 10px;
        color: #E83C3C;
    }
    .CloudDiskAbout-main .process{
        padding-bottom: 10px;
        height: 35px;
    }
    .CloudDiskAbout-main .bottom{
        width: 100%;
    }
    .CloudDiskAbout-main button{
        float: right;
        overflow: hidden!important;
    }
</style>