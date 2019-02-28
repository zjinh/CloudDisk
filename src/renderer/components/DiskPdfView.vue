<template>
    <div class="PdfWindow">
        <WindowsHeader :data=header></WindowsHeader>
        <div class="PDfContainer">
            <iframe :src="src"></iframe>
        </div>
    </div>
</template>

<script>
    import electron from 'electron';
    const path = require('path');
    import WindowsHeader from "./DiskWindow/WindowHeader";
    let PdfViewer=electron.remote.getCurrentWindow();
    export default {
        name: "DiskPdfView",
        components:{WindowsHeader},
        data(){
            return{
                NowPlay:{
                    disk_name:''
                },
                src:null,
                header:{
                    title:"",
                    background: '#2d8cf0',
                    color:'#fff'
                }
            }
        },
        created(){
            this.$ipc.on('win-data', (event, data)=>{//接收打开pdf文件的数据
                this.$nextTick(()=>{
                    this.NowPlay.disk_name=data.disk_name;
                    this.src=path.join(__static, '/pdf/web/viewer.html?file=')+data.disk_main;
                    PdfViewer.setTitle(data.disk_name+'-PDF阅读器');
                });
                this.header.title=data.disk_name+'-PDF阅读器';
            });
        }
    }
</script>

<style scoped>

</style>