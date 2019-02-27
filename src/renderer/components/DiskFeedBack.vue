<template>
    <div class="CloudDiskAbout">
        <div class="CloudDiskAbout-head">
            <img src="../../../static/img/bar/disk.png" draggable="false">
            <p>问题反馈</p>
            <button class="sf-icon-times" @click="close"></button>
        </div>
        <div class="CloudDiskFeedBack-main">
            <p>我们需要以下信息</p>
            <Input v-model="FeedBackTitle" placeholder="简单的描述下问题" clearable style="width:100%" />
            <Input v-model="FeedBackContent" type="textarea" :rows="4" placeholder="尽量详细的描述遇到的问题" />
            <span class="version">当前版本号:v{{version}}</span>
            <button class="el-button el-button--default el-button--small el-button--primary " @click="FeedBack">提交</button>
        </div>
    </div>
</template>

<script>
    import electron from 'electron';
    let DiskFeedBack=electron.remote.getCurrentWindow();
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
                DiskFeedBack.close();
            },

        }
    }
</script>

<style scoped>

</style>