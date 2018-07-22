<template>
    <div class="CloudDiskInfoContainer">
        <div class="CloudDiskInfoControl">
            <p>{{DiskData.disk_name}} 属性</p>
            <button class="sf-icon-times" @click="close"></button>
        </div>
        <div class="CloudDiskInfoHead">
            <img draggable="false" :src="DiskData.icon">
            <span>{{DiskData.disk_name}}</span>
        </div>
        <div class="CloudDiskInfoList">
            <span>文件类型:</span>
            <div>{{DiskData.disk_type=='folder'?'文件夹':'.'+DiskData.type+'文件'}}</div>
        </div>
        <div class="CloudDiskInfoList">
            <span>文件位置:</span>
            <div ref="address">{{DiskData.address}}</div>
        </div>
        <div class="CloudDiskInfoLine"></div>
        <div class="CloudDiskInfoList">
            <span>文件大小:</span>
            <div>{{DiskData.size}} ({{DiskData.disk_size}}字节)</div>
        </div>
        <div class="CloudDiskInfoList">
            <span>创建时间:</span>
            <div>{{DiskData.create_time}}</div>
        </div>
        <div class="CloudDiskInfoList">
            <span>修改时间:</span>
            <div>{{DiskData.modify_time}}</div>
        </div>
        <div class="CloudDiskInfoLine"></div>
        <div class="CloudDiskInfoList">
            <span>唯一标识:</span>
            <div>{{DiskData.disk_id}}</div>
        </div>
        <div class="CloudDiskInfoList">
            <span>文件分享:</span>
            <input v-show="DiskData.share.length" @focus="copy" ref="share" type="text" >
            <button v-show="DiskData.share" @click="copy" style="margin-top: 2px;">复制</button>
            <div v-if="!DiskData.share">未分享</div>
        </div>
        <div class="CloudDiskInfoLine"></div>
        <div class="CloudDiskInfoList" style="position: absolute;bottom: 10px;">
            <button @click="close">确定</button>
            <button @click="close" class="CloudDiskInfoBack">取消</button>
        </div>
    </div>
</template>

<script>
    import Api from '../api/api';
    import electron from 'electron';
    const {ipcRenderer} = require('electron');
    let DiskInfo=electron.remote.getCurrentWindow();
    export default {
        name: "DiskInfo",
        data(){
          return {
              DiskData:{
                address:'',
                create_time:'',
                disk_id:'',
                disk_main:'',
                disk_name:'',
                disk_realname:'',
                disk_size:'',
                disk_type:'',
                icon:'',
                modify_time:'',
                parent_id:'',
                share:'',
                size:'',
                type:'',
              }
          }
        },
        created(){
            ipcRenderer.on('DiskInfo', (event, data)=>{//接收打开文件的数据
                this.DiskData=data;
                DiskInfo.setTitle(data.disk_name+' 属性');
                this.$refs.share.value=localStorage.server+'/s/'+data.share;
                Api.Disk.Address(data.disk_id,(rs)=>{
                    this.$refs.address.innerHTML='我的网盘'+rs;
                    this.$nextTick(()=>{
                        this.DiskData.address='我的网盘'+rs;
                    });
                })
            });
            if(localStorage.username&&localStorage.password){
                this.RemberPass=true;
            }
            window.addEventListener( "dragenter", function (e) {
                e.preventDefault();
            }, false);
            window.addEventListener( "dragover", function (e) {
                e.preventDefault();
            }, false );
            window.addEventListener( "dragleave", function (e) {
                e.preventDefault();
            }, false );
            window.addEventListener( "drop", function (e) {
                e.preventDefault();
            }, false );
        },
        methods:{
            copy(){
                this.$refs.share.select();
                document.execCommand('copy');
            },
            close(){
                DiskInfo.close();
            }
        }
    }
</script>

<style scoped>

</style>