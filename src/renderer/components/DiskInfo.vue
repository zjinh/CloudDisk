<template>
    <div class="CloudDiskInfoContainer">
        <WindowsHeader :data=header></WindowsHeader>
        <div class="CloudDiskInfoHead">
            <img draggable="false" :src="DiskData.$icon">
            <span>{{DiskData.disk_name}}</span>
        </div>
        <div class="CloudDiskInfoList">
            <span>文件类型:</span>
            <div>{{DiskData.disk_type==='folder'?'文件夹':'.'+DiskData.type+'文件'}}</div>
        </div>
        <div class="CloudDiskInfoList">
            <span>文件位置:</span>
            <div ref="address">{{DiskData.address}}</div>
        </div>
        <div class="CloudDiskInfoLine"></div>
        <div class="CloudDiskInfoList">
            <span>文件大小:</span>
            <div>{{DiskData.$size}} ({{DiskData.disk_size}}字节)</div>
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
            <Button v-show="DiskData.share" @click="copy" style="margin-top: 2px;">复制</Button>
            <div v-if="!DiskData.share">未分享</div>
        </div>
        <div class="CloudDiskInfoLine"></div>
        <div class="CloudDiskInfoList" style="position: absolute;bottom: 10px;">
            <Button type="primary"  @click="close">确定</Button>
            <Button @click="close" class="CloudDiskInfoBack">取消</Button>
        </div>
    </div>
</template>

<script>
    import WindowsHeader from "./DiskWindow/WindowHeader";
    export default {
        name: "DiskInfo",
        components:{
            WindowsHeader
        },
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
              },
              header:{
                  title:"",
                  resize:false,
                  mini:false
              },
              window:false,
          }
        },
        created(){
            this.window=this.$electron.remote.getCurrentWindow();
            this.$ipc.on('win-data', (event, data)=>{//接收打开文件的数据
                this.DiskData=data;
                this.header.title=data.disk_name+' 属性';
                this.window.setTitle(data.disk_name+' 属性');
                this.$refs.share.value=localStorage.server+'/s/'+data.share;
                this.$Api.Disk.Address(data.disk_id,(rs)=>{
                    this.$refs.address.innerHTML='我的网盘'+rs;
                    this.$nextTick(()=>{
                        this.DiskData.address='我的网盘'+rs;
                    });
                })
            });
        },
        methods:{
            copy(){
                this.$refs.share.select();
                document.execCommand('copy');
            },
            close(){
                this.window.close();
            }
        }
    }
</script>

<style scoped>

</style>