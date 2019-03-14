<template>
    <div class="PdfWindow">
        <WindowsHeader :data=header></WindowsHeader>
        <div class="PDfContainer">
            <iframe :src="src"></iframe>
        </div>
    </div>
</template>

<script>
    import WindowsHeader from "./DiskWindow/WindowHeader";
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
                    background: '#4f4f4f',
                    color:'#fff'
                }
            }
        },
        created(){
            this.$ipc.on('win-data', (event, data)=>{//接收打开pdf文件的数据
                this.$nextTick(()=>{
                    this.NowPlay.disk_name=data.disk_name;
                    this.src=this.$path.join(__static, '/pdf/web/viewer.html?file=')+data.disk_main;
                });
                this.header.title=data.disk_name+'-PDF阅读器';
            });
        }
    }
</script>

<style scoped>
    /*pdf窗口*/
    .PdfWindow{
        width:100%;
        height: 100%;
        background: #4f4f4f;
    }
    .PDfContainer,.FileShowContainer{
        width: 100%;
        height: calc(100% - 32px);
    }
    .PDfContainer iframe{
        width: 100%;
        height: 100%;
    }
</style>