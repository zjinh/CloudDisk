<template>
    <div class="WindowContainer">
        <div class="CloudDiskInfoControl">
            <p style="width: calc(100% - 120px)">PDF阅读器 {{NowPlay.disk_name}}</p>
            <button class="sf-icon-times" @click="close"></button>
            <button :class="ButtonState" @click="restore"></button>
            <button class="sf-icon-window-minimize" @click="mini" style="font-size: 12px"></button>
        </div>
        <div class="PDfContainer">
            <iframe :src="src"></iframe>
        </div>
    </div>
</template>

<script>
    import electron from 'electron';
    const {ipcRenderer} = require('electron');
    const path = require('path');
    let PdfViewer=electron.remote.getCurrentWindow();
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "DiskPdfView",
        data(){
            return{
                ButtonState:"sf-icon-window-maximize",//右上角窗口按钮状态
                NowPlay:{
                    disk_name:'',
                    count:0,
                },
                src:null
            }
        },
        created(){
            ipcRenderer.on('pdf-file', (event, data)=>{//接收打开文件的数据
                this.$nextTick(()=>{
                    this.NowPlay.disk_name=data.disk_name;
                    this.src=path.join(__static, '/pdf/web/viewer.html?file=')+localStorage.server+'/'+data.disk_main;
                    PdfViewer.setTitle('PDF阅读器-'+data.disk_name);
                });
            });
            this.bind();
        },
        methods:{
            bind(){
                PdfViewer.on('maximize',()=>{
                    this.ButtonState='sf-icon-window-restore';
                });
                PdfViewer.on('unmaximize',()=>{
                    this.ButtonState='sf-icon-window-maximize';
                });
            },
            restore(){
                if (PdfViewer.isMaximized()) {
                    PdfViewer.restore();
                } else {
                    PdfViewer.maximize();
                }
            },
            close(){
                PdfViewer.close();
            },
            mini(){
                PdfViewer.minimize();
            }
        }
    }
</script>

<style scoped>
    @import url("../../../static/css/Slimf.css");
    @import url("../../../static/css/disk.css");
</style>