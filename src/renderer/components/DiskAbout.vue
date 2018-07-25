<template>
    <div class="CloudDiskAbout">
        <div class="CloudDiskAbout-head">
            <img src="../../../static/img/bar/disk.png" draggable="false">
            <p>CloudDisk</p>
            <button class="sf-icon-times" @click="close"></button>
        </div>
        <div class="CloudDiskAbout-main">
            <p class="title">关于CloudDisk</p>
            <p>开发者：ZJINH</p>
            <p>联系邮箱：2665229856@qq.com</p>
            <p>当前版本：v{{version}} 正式版 ({{platform}})<span>{{NewVersion}}</span></p>
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
    import electron from 'electron';
    const {ipcRenderer} = require('electron');
    let DiskAbout=electron.remote.getCurrentWindow();
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "DiskAbout",
        data(){
            return{
                platform:'未知',
                version:'0.0.0',
                loading: false,
                CheckText:'检查更新',
                ProcessText:"正在检查",
                StartDown:false,
                NewVersion:'',
                message:'',
                percent:0
            }
        },
        created(){
            this.platform=process.platform;
            this.bind();
        },
        watch:{
            percent: {
                handler(newValue, oldValue) {
                    this.StartDown=true;
                    this.ProcessText='正在下载';
                },
                deep: true
            },
        },
        methods:{
            bind(){
                ipc.send('get-version');
                ipcRenderer.on('version', (event, version)=>{//接收当前版本号
                    this.$nextTick(()=>{
                        this.version=version;
                    });
                });
                ipcRenderer.on('check-for-update',(event,message) =>{
                    this.message=message;
                    if(message==='检查更新出错, 请联系开发人员'||message==='现在使用的就是最新版本，不用更新'){
                        this.loading=false;
                    }
                    if(message==='最新版本已下载，点击安装进行更新'){
                        this.CheckText='安装';
                        this.loading = false;
                        this.percent=100;
                        this.checkUpdate=()=>{
                            ipc.send('update');
                        }
                    }
                });
                ipcRenderer.on('update-down-success',(event,message) =>{
                    this.NewVersion='新版本：V'+message.version;
                });
                ipcRenderer.on('download-progress',(event,message)=>{
                    this.$nextTick(()=>{
                        this.percent=parseInt(message.percent);
                        if(this.percent===100){
                            this.CheckText='安装';
                            this.loading = false;
                            this.checkUpdate=()=>{
                                ipc.send('update');
                            }
                        }
                    });
                })
            },
            checkUpdate () {
                ipc.send('check-for-update','event-update');
                this.loading = true;
            },
            close() {
                DiskAbout.hide();
            }
        }
    }
</script>

<style scoped>

</style>