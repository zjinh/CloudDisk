<template>
    <div class="WindowContainer PdfWindow">
        <div class="CloudDiskInfoControl">
            <p style="width: calc(100% - 120px)">{{NowLoad.disk_name}} 文件查看</p>
            <button class="sf-icon-times" @click="close"></button>
            <button :class="ButtonState" @click="restore"></button>
            <button class="sf-icon-window-minimize" @click="mini"></button>
        </div>
        <div class="PDfContainer">

        </div>
    </div>
</template>

<script>
    import electron from 'electron';
    const {ipcRenderer} = require('electron');
    let FileShowArea=electron.remote.getCurrentWindow();
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "DiskFileContent",
        data(){
            return{
                NowLoad:{
                    disk_name:''
                },
                ButtonState:"sf-icon-window-maximize",//右上角窗口按钮状态
            }
        },
        methods:{
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