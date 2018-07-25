<template>
    <div class="CloudDiskAbout">
        <div class="CloudDiskAbout-head">
            <img src="../../../static/img/bar/disk.png" draggable="false">
            <p>关于</p>
            <button class="sf-icon-times"></button>
        </div>
        <div class="CloudDiskAbout-main">
            <p>CloudDisk</p>
            <p>版本号：{{version}}</p>
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
                version:0
            }
        },
        created(){
            ipcRenderer.on('version', (event, version)=>{//接收当前版本号
                this.$nextTick(()=>{
                    this.version=version;
                });
            });
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>