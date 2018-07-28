<template>
    <div class="WindowContainer">
        <div class="CloudDiskInfoControl">
            <p style="width: calc(100% - 120px)">{{NowLoad.disk_name}} 文件查看</p>
            <button class="sf-icon-times" @click="close"></button>
            <button :class="ButtonState" @click="restore"></button>
            <button class="sf-icon-window-minimize" @click="mini"></button>
        </div>
        <div class="PDfContainer">
            <iframe :src="LoadUrl"></iframe>
        </div>
    </div>
</template>

<script>
    import Api from '../api/api';
    import electron from 'electron';
    let FileShowArea=electron.remote.getCurrentWindow();
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "DiskFileContent",
        data(){
            return{
                NowLoad:{
                    disk_name:'',
                    content:''
                },
                ButtonState:"sf-icon-window-maximize",//右上角窗口按钮状态
                LoadUrl:'',
            }
        },
        created(){
            ipc.on('file', (event, data)=>{//接收打开文件的数据
                this.$nextTick(()=>{
                    this.NowLoad=data;
                    this.LoadUrl='../../../static/syntaxhighlighter/index.html?id='+data.disk_id+'&type='+data.type;
                });
            });
            this.bind();
        },
        methods:{
            bind(){
                FileShowArea.on('maximize',()=>{
                    this.ButtonState='sf-icon-window-restore';
                });
                FileShowArea.on('unmaximize',()=>{
                    this.ButtonState='sf-icon-window-maximize';
                });
            },
            restore(){
                if (FileShowArea.isMaximized()) {
                    FileShowArea.restore();
                } else {
                    FileShowArea.maximize();
                }
            },
            close(){
                FileShowArea.close();
            },
            mini(){
                FileShowArea.minimize();
            }
        }
    }
</script>

<style scoped>

</style>