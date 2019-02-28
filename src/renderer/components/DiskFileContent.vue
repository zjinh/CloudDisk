<template>
    <div class="WindowContainer FileContent">
        <WindowsHeader :data=header style="border-bottom: 2px solid #6ce26c;"></WindowsHeader>
        <div class="PDfContainer">
            <iframe :src="LoadUrl"></iframe>
        </div>
    </div>
</template>

<script>
    import WindowsHeader from "./DiskWindow/WindowHeader";
    const path = require('path');
    export default {
        name: "DiskFileContent",
        components:{WindowsHeader},
        data(){
            return{
                NowLoad:{
                    disk_name:'',
                    content:''
                },
                LoadUrl:'',
                header:{
                    title:"",
                }
            }
        },
        created(){
            this.$ipc.on('win-data', (event, data)=>{//接收打开文本文件的数据
                this.$nextTick(()=>{
                    this.NowLoad=data;
                    this.header.title=data.disk_name+' 文件查看';
                    this.LoadUrl=path.join(__static, '/syntaxhighlighter/index.html?id=')+data.disk_id+'&type='+data.type;
                });
            });
        }
    }
</script>

<style scoped>

</style>