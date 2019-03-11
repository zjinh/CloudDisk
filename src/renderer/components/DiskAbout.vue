<template>
    <div class="cd-about-win">
        <WindowsHeader :data=header></WindowsHeader>
        <div class="cd-about-main">
            <div class="app-version">
                <div class="logo"></div>
                <span>Version&nbsp&nbsp{{version}}</span>
                <span style="color: #E83C3C;">{{NewVersion}}</span>
            </div>
            <div class="app-icon"></div>
            <div class="engine-info">
                <h4>引擎版本&nbsp&nbsp{{electron}}</h4>
                <ul>
                    <li v-for="(item,index) in InfoList">
                        {{index}}&nbsp&nbsp{{item}}
                    </li>
                </ul>
            </div>
            <div class="update-info">
                <p class="tips">{{message}}&nbsp</p>
                <div class="process">
                    <Progress :percent="percent" v-show="percent>0"></Progress>
                </div>
            </div>
            <div class="bottom">
                <p class="release">©2018 CloudDisk ZJINH </p>
                <button class="cd-cancel-button" @click="checkUpdate">
                    <span v-if="!loading">{{CheckText}}</span>
                    <span v-else>{{ProcessText}}</span>
                </button>
                <button class="cd-cancel-button" @click="OpenLink">项目地址</button>
            </div>
        </div>
    </div>
</template>

<script>
    import WindowsHeader from "./DiskWindow/WindowHeader";
    export default {
        name: "DiskAbout",
        data(){
            return{
                loading: false,
                CheckText:'检查更新',
                ProcessText:"正在检查",
                NewVersion:'',
                message:'',
                percent:0,

                header:{
                    color:"#666",
                    title:"",
                    resize:false,
                    mini:false
                },
                electron: process.versions.electron,
                InfoList:{
                    Author:'ZJINH',
                    Email:'2665229856@qq.com',
                    Platform:process.platform,
                    Vue:require('vue/package.json').version,
                    Node:process.versions.node
                }
            }
        },
        components:{WindowsHeader},
        computed: {
            version(){
                return this.$route.params.version;
            }
        },
        created(){
            this.bind();
        },
        watch:{
            percent: {
                handler() {
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
                    this.NewVersion='New '+message.version;
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
            },
            OpenLink(){
                this.$electron.shell.openExternal('https://github.com/zjinh/CloudDisk/')
            }
        }
    }
</script>

<style scoped>
    /*关于信息窗口*/
    .cd-about-win{
        width: 100%;
        height: 100%;
        -webkit-app-region: drag;
    }
    .cd-about-main{
        width: 100%;
        height: calc(100% - 50px);
        background: #fff;
        padding:0 30px 20px;
        position: relative;
    }
    .app-version .logo{
        width: 140px;
        height: 45px;
        float: left;
        display: inline-block;
        vertical-align: bottom;
        font-size: 30px;
        color: #4c4c4c;
        font-family: "Mistral";
        font-weight: bold;
        background: url(../../../static/img/logo/c-disk.png);
        background-size: contain;
        background-repeat: no-repeat;
    }
    .app-version span{
        display: inline-block;
        vertical-align: bottom;
        font-size: 14px;
        margin:0 10px;
        color: #4c4c4c;
        line-height: 45px;
    }
    .app-icon{
        background: transparent url("../../../static/img/bar/disk.png");
        position: absolute;
        top: 10px;
        right: 40px;
        background-size: 100%;
        width: 80px;
        height: 80px;
        border-radius: 100%;
        box-shadow: 0 0 10px 0 #6e6e6e;
    }
    .engine-info{
        margin: 20px 35% 0 8px;
    }
    .engine-info h4{
        font-size: 14px;
        font-weight: 400;
        color: #4c4c4c;
        padding: 15px 0;
    }
    .engine-info ul{
        font-size: 12px;
        color: #bdbdbd;
        list-style: none;
        padding: 0;
        line-height: 20px;
    }
    .engine-info ul li{
        float: left;
        width: 50%;
    }
    .update-info{
        width: 100%;
        padding: 10px 8px;
    }
    .update-info .tips{
        font-size: 14px;
        font-weight: 400;
        color: #4f4f4f;
    }
    .update-info .process{
        padding:10px 0;
        height: 35px;
    }
    .cd-about-main .bottom{
        width: calc(100% - 60px);
        position: absolute;
        bottom: 0;
    }
    .cd-about-main .release{
        float: left;
        font-size: 12px;
        color: #4c4c4c;
    }
    .cd-about-main button{
        float: right;
        margin-left: 20px;
        overflow: hidden!important;
        -webkit-app-region: no-drag;
    }
</style>