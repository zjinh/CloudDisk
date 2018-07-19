<template>
    <div class="CloudDiskShareWindow">
        <div v-show="!ShareResult.success">
            <ul>
                <li :class="ShareType.public?'CloudDiskShareActive':''" @click="SwitchShare('public')"><Tooltip content="公开分享" placement="bottom">公开分享 </Tooltip></li>
                <li :class="ShareType.classify?'CloudDiskShareActive':''" @click="SwitchShare('classify')"><Tooltip content="加密分享" placement="bottom">加密分享 </Tooltip></li>
            </ul>
            <div class="CloudDiskShareWContent" v-show="ShareType.public">
                <p>任何人查看链接即可查看、保存</p>
            </div>
            <div class="CloudDiskShareWContent" v-show="ShareType.classify">
                <p>输入密码才能查看、更安全</p>
            </div>
        </div>
        <div v-show="ShareResult.success">
            <span >分享链接已生成，快复制给好友吧</span>
            <div class="CloudDiskShareLine">
                <span>链接：</span>
                <input type="text" style="width: 278px" :value="ShareResult.address" readonly >
                <input type="text" :value="ShareResult.Copy"  ref="CopyResult" tabindex="-1">
            </div>
            <div class="CloudDiskShareLine">
                <span v-show="ShareType.classify&&ShareResult.pass.length">密码：</span>
                <input type="text" style="width: 125px;" v-show="ShareType.classify&&ShareResult.pass.length" :value="ShareResult.pass" readonly >
                <button v-show="ShareType.classify&&ShareResult.pass.length" @click="CopyAddress">复制链接及密码</button>
                <button v-show="ShareType.public||!ShareResult.pass.length" @click="CopyAddress">复制链接</button>
            </div>
        </div>
    </div>

</template>

<script>
    import Api from '../../api/api';
    export default {
        name: "DiskShare",
        data(){
            return{
                ShareType:{
                    public:true,
                    classify:false
                },
                ShareResult:{
                    pass:'',
                    address:'',
                    Copy:'',
                    success:false,
                }
            }
        },
        methods:{
            init(){
                this.ShareType={
                    public:true,
                    classify:false
                };
                this.ShareResult={
                    pass:'',
                    address:'',
                    Copy:'',
                    success:false,
                }
            },
            SwitchShare(type){
                for(let i in this.ShareType){
                    this.ShareType[i]=false
                }
                this.ShareType[type]=true;
            },
            ShareFile(item){
                let ShareType=0;
                if(this.ShareType.public){
                    ShareType=1
                }else{
                    ShareType=2;
                }
                Api.Disk.Share({
                    shareType:ShareType,
                    id: item.disk_id
                },(rs)=>{
                    if(!rs[0]){
                        this.$Message.error('分享失败，请稍后重试');
                        return
                    }
                    this.$nextTick(()=>{
                        this.ShareResult.success=true;
                        if (rs[0].share) {
                            this.$Message.warning('该资源已经分享,请不要重复分享')
                        }
                        this.ShareResult.address=localStorage.server+'/s/' + rs[0].addres;
                        this.ShareResult.Copy='链接：'+this.ShareResult.address;
                        if (rs[0].password) {
                            this.SwitchShare('classify');
                            this.ShareResult.pass=rs[0].password;
                            this.ShareResult.Copy='链接：'+this.ShareResult.address+',密码：'+this.ShareResult.pass
                        }
                        if(rs[0].state==='success'){
                            this.$Message.success('分享链接已生成，复制给好友吧')
                        }
                    });
                })
            },
            CopyAddress(){
                this.$refs.CopyResult.select();
                document.execCommand('copy')
            }
        }
    }
</script>

<style scoped>

</style>