<template>
    <div class="cd-main">
        <div class="cd-drag-head-big">
            <img src="../../../static/img/bar/disk.png" draggable="false">
            <p>问题反馈</p>
            <button class="sf-icon-times" @click="close"></button>
        </div>
        <div class="CloudDiskFeedBack-main">
            <p>我们需要以下信息</p>
            <Input v-model="FeedBackTitle" placeholder="简单的描述下问题" clearable style="width:100%" />
            <Input v-model="FeedBackContent" type="textarea" :rows="4" placeholder="尽量详细的描述遇到的问题" />
            <span class="version">当前版本号:V{{version}}</span>
            <button class="cd-purple-button" @click="FeedBack">提交</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DiskFeedBack",
        data(){
            return{
                FeedBackTitle:'',
                FeedBackContent:'',
            }
        },
        computed: {
            version(){
                return this.$route.params.version;
            }
        },
        methods:{
            FeedBack(){
                if(!this.FeedBackTitle.length){
                    this.$Message.warning('请先简单描述下问题');
                    return
                }
                if(!this.FeedBackContent.length){
                    this.$Message.warning('详细描述问题不能是空的');
                    return
                }
                this.$Api.User.FeedBack({
                    report_title: this.FeedBackTitle,
                    report_content: this.FeedBackContent
                },(rs)=>{
                    rs=rs[0];
                    if(!rs){
                        this.$Message.error('服务器错误');
                        return;
                    }
                    this.$Message[rs.state](rs.msg);
                    if(rs.state==='success'){
                        this.$Message.info({
                            content:'感谢您的反馈',
                            onClose:()=>{
                                this.close();
                            }
                        });
                        this.$nextTick(()=>{
                            this.FeedBackTitle='';
                            this.FeedBackContent='';
                        });
                    }
                })
            },
            close(){
                this.$electron.remote.getCurrentWindow().close();
            },
        }
    }
</script>

<style scoped>
    /*反馈窗口*/
    .CloudDiskFeedBack-main{
        height: calc(100% - 50px);
        padding: 10px 15px;
        background: #fff;
    }
    .CloudDiskFeedBack-main p{
        font-size: 14px;
        color: #4f4f4f;
    }
    .CloudDiskFeedBack-main .ivu-input-wrapper{
        margin:10px 0;
    }
    .CloudDiskFeedBack-main textarea{
        height: 125px!important;
        resize: none;
    }
    .CloudDiskFeedBack-main .version{
        float: left;
        font-size: 14px;
        color: #6e6e6e;
        margin-top: 5px;
        font-weight: bold;
    }
    .CloudDiskFeedBack-main button{
        float: right;
    }
</style>