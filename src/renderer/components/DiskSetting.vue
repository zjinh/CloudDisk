<template>
    <div class="CloudDiskSettingWindow">
        <div class="CloudDiskSetting-head">
            <Icon :type="'md-settings '+this.loading"></Icon>
            <p>设置</p>
            <button class="sf-icon-times" @click="close"></button>
            <button class="sf-icon-window-minimize" @click="mini"></button>
        </div>
        <div class="CloudDiskSetting-main">
            <SettingMenu :data="SettingMenuData" @change="change"></SettingMenu>
            <div class="CloudDiskSettingContent">
                <div class="CloudDiskSettingContainer" v-show="SettingMenuData.Account.active">
                    <p class="SettingBigTitle">用户设置</p>
                    <p class="SettingSecTitle">账号当前状态</p>
                    <p class="SettingInfo">最近登录时间：{{LoginTime}}<Time :time="LoginTime" :interval="1" /></p>
                    <p class="SettingSecTitle">修改账号密码</p>
                    <div class="SettingForm">
                        <Input type="password" v-model="ChangePass.oldpass" placeholder="当前账号密码" clearable style="width: 100%" />
                        <Input type="password" v-model="ChangePass.newpass" placeholder="新密码" clearable style="width: 100%" />
                        <Input type="password" v-model="ChangePass.againPass" placeholder="再次输入密码" clearable style="width: 100%" />
                        <button class="el-button el-button--default el-button--small el-button--primary " @click="ChangePassword">修改</button>
                    </div>
                </div>
                <div class="CloudDiskSettingContainer" v-show="SettingMenuData.System.active">
                    <p class="SettingBigTitle">系统设置</p>
                    <p class="SettingSecTitle">开机自启动</p>
                    <div class="SettingForm">
                        <Checkbox v-model="SettingData.AutoStartFlag">系统启动后自动运行CloudDisk</Checkbox>
                    </div>
                    <p class="SettingSecTitle">自动登录</p>
                    <div class="SettingForm" style="width: 100%">
                        <Checkbox v-model="SettingData.AutoLogin">打开CloudDisk后自动登录(需勾选记住密码)</Checkbox>
                    </div>
                </div>
                <div class="CloudDiskSettingContainer" v-show="SettingMenuData.Safety.active">
                    <p class="SettingBigTitle">绑定设置</p>
                    <p class="SettingSecTitle">修改安全邮箱</p>
                    <p class="SettingInfo">当前绑定邮箱：{{SettingData.Email}}<button @click="OpenChangeEmailDialog">[修改]</button></p>
                    <p class="SettingSecTitle">更换手机</p>
                    <p class="SettingInfo">当前绑定手机号：{{SettingData.Phone}}<button @click="ChangePhone">[修改]</button></p>
                </div>
                <div class="CloudDiskSettingContainer" v-show="SettingMenuData.Trans.active">
                    <p class="SettingBigTitle">传输设置</p>
                    <p class="SettingSecTitle">下载目录设置</p>
                    <div class="SettingInfo">
                        当前目录：{{SettingData.TransDownFolder}}
                        <button @click="ChangeTransAddress">[修改]</button>
                    </div>
                    <p class="SettingSecTitle">同时上传数</p>
                    <div class="SettingForm">
                        <InputNumber :max="5"  :min="1" v-model="SettingData.MaxUpTrans"></InputNumber>
                    </div>
                    <p class="SettingSecTitle">同时下载数</p>
                    <div class="SettingForm" style="margin-bottom: 0">
                        <InputNumber :max="5" :min="1" v-model="SettingData.MaxDownTrans"></InputNumber>
                    </div>
                    <p class="SettingTips">*请不要在正在下载文件的情况下修改下载目录</p>
                    <p class="SettingTips">*下次登录生效</p>
                </div>
                <div class="CloudDiskSettingContainer" v-show="SettingMenuData.Notice.active">
                    <p class="SettingBigTitle">提醒设置</p>
                    <p class="SettingSecTitle">弹窗提醒</p>
                    <div class="SettingForm">
                        <Checkbox v-model="SettingData.NoticeBubble">传输完成后气泡提示</Checkbox>
                    </div>
                    <p class="SettingSecTitle">声音提醒</p>
                    <div class="SettingForm" style="width: 100%">
                        <Checkbox v-model="SettingData.NoticeFlag">传输完成后声音提醒</Checkbox>
                        <div class="SettingForm" style="width: 100%">
                            <RadioGroup v-model="SettingData.NoticeVoice" @on-change="VoiceChange">
                                <Radio label="音效一" :disabled="!SettingData.NoticeFlag"></Radio>
                                <Radio label="音效二" :disabled="!SettingData.NoticeFlag"></Radio>
                                <Radio label="音效三" :disabled="!SettingData.NoticeFlag"></Radio>
                                <Radio label="音效四" :disabled="!SettingData.NoticeFlag"></Radio>
                            </RadioGroup>
                        </div>
                        <audio :src="VoiceSrc" ref="audio"></audio>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="更换邮箱" :visible.sync="ShowEmailDialog" width="300px" top="70px">
            <div style="height: 120px;">
                <p class="SettingSecTitle">我们需要以下信息</p>
                <Input type="password" v-model="ChangeEmailData.pass" placeholder="当前账号密码" clearable style="width: 100%" />
                <Input type="text" v-model="ChangeEmailData.email" placeholder="您的新邮箱地址" clearable style="width: 100%" />
            </div>
            <span slot="footer" class="dialog-footer">
                <button class="el-button el-button--default el-button--small" @click="ShowEmailDialog = false">取 消</button>
                <button class="el-button el-button--default el-button--small el-button--primary" @click="ChangeEmail">确 定</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import StartOnBoot from '../api/StartOnBoot';
    import SettingMenu from './DiskSetting/SettingMenu';
    export default {
        name: "DiskSetting",
        components:{SettingMenu},
        watch:{
            SettingData: {
                handler() {
                    if(this.SettingData.AutoStartFlag===true){
                        StartOnBoot.enableAutoStart('CloudDisk',process.execPath)
                    }else{
                        StartOnBoot.disableAutoStart('CloudDisk')
                    }
                    this.$Api.LocalFile.Write('setting',this.SettingData);
                },
                deep: true
            },
        },
        data(){
            return{
                SettingMenuData:{
                    Account:{
                        active:"active",
                        name:"用户",
                        icon:"sf-icon-user"
                    },
                    System:{
                        active:"",
                        name:"系统",
                        icon:"sf-icon-hashtag"
                    },
                    Safety:{
                        active:"",
                        name:"绑定",
                        icon:"sf-icon-lock"
                    },
                    Trans:{
                        active:"",
                        name:"传输",
                        icon:"sf-icon-exchange"
                    },
                    Notice:{
                        active:"",
                        name:"提醒",
                        icon:"sf-icon-bell"
                    },
                },
                ChangePass:{
                    oldpass:'',
                    newpass:'',
                    againPass:'',
                },
                ChangeEmailData:{
                    ctype:1,
                    pass:'',
                    email:''
                },
                LoginTime:0,
                VoiceSrc:'',//提醒测试音效.
                ShowEmailDialog:false,
                EmailSendFlag:false,
                SettingData:{
                    AutoLogin:false,
                    AutoStartFlag:false,
                    Phone:"",
                    Email:'',
                    TransDownFolder:'',
                    MaxUpTrans:1,
                    MaxDownTrans:1,
                    NoticeBubble:true,//气泡提示
                    NoticeFlag:true,//提醒声音
                    NoticeVoice:'音效一',//哪个提醒声音
                },
                loading:'',
            }
        },
        created(){
            this.LoginTime=localStorage.LoginTime;
            this.GetLocalSetting();
        },
        methods:{
            change(item,index){
                for(let i in this.SettingMenuData){
                    this.SettingMenuData[i].active='';
                }
                this.SettingMenuData[index].active='active';
            },
            GetUserInfo () {
                this.$Api.User.UserInfo((rs)=>{
                    this.SettingData.Phone=rs[0].phone;
                    this.SettingData.Email=rs[0].email;
                });
            },//获取用户信息,
            GetLocalSetting(){
                this.$Api.LocalFile.Read('setting',(data)=>{
                    if(data.Email!==undefined){
                        this.$nextTick(()=>{
                            this.SettingData=data;
                        });
                    }else{
                        this.SettingData.TransDownFolder=process.env.USERPROFILE;
                        this.$Api.LocalFile.Write('setting',this.SettingData);
                    }
                    switch (this.SettingData.NoticeVoice.substr(-5)) {
                        case "1.wav":
                            this.SettingData.NoticeVoice='音效一';
                            break;
                        case "2.wav":
                            this.SettingData.NoticeVoice='音效二';
                            break;
                        case "3.wav":
                            this.SettingData.NoticeVoice='音效三';
                            break;
                        case "4.wav":
                            this.SettingData.NoticeVoice='音效四';
                            break;
                    }
                    this.GetUserInfo();
                });
            },
            ChangePassword(){
                if(this.loading){
                    this.$Message.warning('正在进行其他操作，请等待');
                    return;
                }
                if(!this.ChangePass.oldpass.length){
                    this.$Message.warning('请先输入原密码');
                    return;
                }
                if(!this.ChangePass.newpass.length){
                    this.$Message.warning('请输入新密码');
                    return;
                }
                if(!this.ChangePass.againPass.length){
                    this.$Message.warning('请再次输入新密码');
                    return;
                }
                if(this.ChangePass.newpass!==this.ChangePass.againPass){
                    this.$Message.error('密码不一致，请检查');
                    return;
                }
                if(this.ChangePass.newpass===this.ChangePass.oldpass){
                    this.$Message.warning('新旧密码一致，取消操作');
                    this.ChangePass.newpass='';
                    this.ChangePass.againPass='';
                    return;
                }
                this.loading='sf-spin';
                this.$Api.User.ChangePass(this.ChangePass,(rs)=>{
                    this.loading=false;
                    rs=rs[0];
                    if(!rs){
                        this.$Message.error('服务器错误，请稍后重试');
                        return
                    }
                    if(rs.state==='success'){
                        this.$Message.success('修改成功，请牢记密码');
                        this.ChangePass.oldpass='';
                        this.ChangePass.newpass='';
                        this.ChangePass.againPass='';
                    }else{
                        this.$Message.error(rs.msg);
                    }
                })
            },
            OpenChangeEmailDialog(){
                if(this.ChangeEmailData.ctype===1) {
                    this.ShowEmailDialog=true;
                }else{
                    this.SubmitChangeEmail();
                }
            },
            ChangeEmail(){
                if(this.loading){
                    this.$Message.warning('正在进行其他操作，请等待');
                    return;
                }
                if(!this.ChangeEmailData.pass.length){
                    this.$Message.warning('请输入您的密码');
                    return
                }
                if(!this.ChangeEmailData.email.length){
                    this.$Message.warning('请输入新的邮箱地址');
                    return
                }
                if(this.ChangeEmailData.email&&!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.ChangeEmailData.email)) {
                    this.$Message.error('请输入正确的邮箱');
                    return;
                }
                if(this.ChangeEmailData.email===this.Email){
                    this.$Message.warning('新旧邮箱地址一致，操作取消');
                    this.ShowEmailDialog=false;
                    return
                }
                if(this.ChangeEmailData.ctype===1&&this.EmailSendFlag){
                    this.MailSended();
                }else if(this.ChangeEmailData.ctype===1) {
                    this.loading='sf-spin';
                    this.SendVerifyEmail();
                }
            },
            SendVerifyEmail(){
                this.$Api.User.ChangeSafeEmail(this.ChangeEmailData,(rs)=>{
                    this.loading=false;
                    if(!rs[0]){
                        this.$Message.error('服务器错误');
                        return
                    }
                    if(rs[0].state==='success'){
                        this.ChangeEmailData.ctype=2;
                        this.ShowEmailDialog=false;
                        this.ChangeEmailData.pass='';
                        this.ChangeEmailData.email='';
                        this.SubmitChangeEmail();
                        this.$Message.success('认证邮件已发送，授权码10分钟有效');
                        this.EmailSendFlag=false;
                    }else {
                        if(rs[0].state==='warning'){
                            this.EmailSendFlag=true;
                            this.MailSended();
                        }
                        this.$Message.error(rs[0].msg);
                    }
                })
            },
            MailSended(){
                this.ShowEmailDialog=false;
                this.$confirm('10分钟内无法再进行更改邮箱操作，如果您已收到授权码，请点击继续', '操作终止', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString:true,
                    type: 'warning',
                }).then(() => {
                    this.SubmitChangeEmail();
                }).catch(() => {
                });
            },
            SubmitChangeEmail(){
                this.InputConfrim({
                    title:"验证邮箱",
                    tips:"请输入邮箱内的验证码",
                    callback:(code)=>{
                        this.$Api.User.ChangeSafeEmail({
                            code:code,
                            ctype:2
                        },(rs)=>{
                            this.loading=false;
                            if(!rs[0]){
                                return this.$Message.error('服务器错误');
                            }
                            if(rs[0].state==='success'){
                                this.$Message.success('安全邮箱已修改');
                                this.SettingData.Email=rs[0].email;
                            }else {
                                this.$Message.error(rs[0].msg);
                            }
                            this.ChangeEmailData.ctype=1;
                        })
                    }
                })
            },
            ChangePhone(){

            },
            VoiceChange(a){
                switch (a) {
                    case "音效一":
                        this.VoiceSrc=this.$path.join(__static,'/voice/1.wav');
                        this.PlayVoice();
                        break;
                    case "音效二":
                        this.VoiceSrc=this.$path.join(__static,'/voice/2.wav');
                        this.PlayVoice();
                        break;
                    case "音效三":
                        this.VoiceSrc=this.$path.join(__static,'/voice/3.wav');
                        this.PlayVoice();
                        break;
                    case "音效四":
                        this.VoiceSrc=this.$path.join(__static,'/voice/4.wav');
                        this.PlayVoice();
                        break;
                }
                localStorage.NoticeVoice=this.VoiceSrc;
            },
            PlayVoice(){
                this.$refs.audio.currentTime=0;
                this.$refs.audio.pause();
                this.$refs.audio.load();
                setTimeout(()=>{
                    this.$refs.audio.play();
                },200)
            },
            ChangeTransAddress(){
                this.$electron.remote.dialog.showOpenDialog({
                    //默认路径
                    defaultPath :'../Desktop',
                    //选择操作，此处是打开文件夹
                    properties: [
                        'openDirectory',
                    ],
                    filters: [
                        { name: 'All', extensions: ['*'] },
                    ]
                },(res)=>{
                    res=res[0]||process.env.USERPROFILE;
                    //回调函数内容，此处是将路径内容显示在input框内
                    this.SettingData.TransDownFolder=res;
                })
            },
            close(){
                this.$electron.remote.getCurrentWindow().close();
            },
            mini(){
                this.$electron.remote.getCurrentWindow().minimize();
            }
        }
    }
</script>

<style scoped>
    /*设置窗口*/
    .CloudDiskSettingWindow{
        width: 100%;
        height: 100%;
        background: #fff;
    }
    .CloudDiskSetting-head{
        width: 100%;
        height: 50px;
        line-height: 50px;
        background: #2d8cf0;
        -webkit-app-region: drag;
    }
    .CloudDiskSetting-head i{
        float: left;
        font-size: 30px;
        color: #fff;
        line-height: 50px;
        margin: 0 15px;
        margin-right: 10px;
    }
    .CloudDiskSetting-head p{
        float: left;
        line-height: 50px;
        font-size: 16px;
        color: #fff;
    }
    .CloudDiskSetting-head button{
        float: right;
        width: 40px;
        height: 30px;
        line-height: 30px;
        font-size: 15px;
        -webkit-app-region: no-drag;
        background: none;
        color: #fff;
    }
    .CloudDiskSetting-head .sf-icon-window-minimize{
        font-size: 12px;
    }
    .CloudDiskSetting-head button:hover{
        background: rgba(255,255,255,0.2);
    }
    .CloudDiskSetting-head .sf-icon-times:hover{
        background: #E83C3C;
    }
    .CloudDiskSetting-main{
        width: 100%;
        height:calc(100% - 50px);
        padding: 10px;
    }
    .CloudSettingMenu{
        width: 100px;
        height: 100%;
        float: left;
        overflow: unset!important;
    }
    .CloudSettingMenu li{
        width: 100%;
        height: 35px;
        background: #fff;
        color: #6e6e6e;
        border-radius: 5px 0 0 5px;
        border: 1px solid #fff;
    }
    .CloudSettingMenu li *{
        float: left;
        line-height: 35px;
    }
    .CloudSettingMenu li.active{
        width: calc(100% + 1px);
        border: 1px solid #eee;
        border-right: none;
        color: #6e6e6e!important;
        cursor: default!important;
    }
    .CloudSettingMenu li:hover{
        color: #2d8cf0;
        cursor: pointer;
    }
    .CloudSettingMenu li span{
        width: 35px;
        height: 35px;
        text-align: center;
    }
    .CloudSettingMenu li p{
        width: calc(100% - 60px);
    }
    .CloudDiskSettingContent{
        width: calc(100% - 100px);
        height: 100%;
        border: 1px solid #eee;
        padding-left: 20px;
    }
    .CloudDiskSettingContainer{
        width: 100%;
        height: 100%;
    }
    .SettingBigTitle{
        width: 100%;
        font-size: 16px;
        line-height: 35px;
        margin-bottom: 10px;
        color: #2d8cf0;
    }
    .SettingSecTitle{
        width: 100%;
        font-size: 14px;
        border-left: 2px solid #2d8cf0;
        text-indent: 5px;
        margin: 5px 0;
    }
    .SettingTips{
        color: #E83C3C;
        width: 100%;
        font-size: 12px;
        margin-top: 5px;
    }
    .ivu-input-number,.ivu-input-number-input,.ivu-input-number-input-wrap{
        overflow: hidden!important;
    }
    .SettingInfo{
        width: 100%;
        font-size: 14px;
        padding-left: 5px;
        line-height: 30px;
    }
    .SettingInfo span{
        background: #2d8cf0;
        color: #fff;
        border-radius: 5px;
        padding: 3px 5px;
        font-size: 12px;
        margin-left: 10px;
    }
    .SettingInfo button{
        background: none;
        color: #2d8cf0;
        font-size: 14px;
        margin-left: 10px;
    }
    .SettingForm{
        margin: 8px 0;
        width: 200px;
    }
    .SettingForm .ivu-input-wrapper,.SettingForm .ivu-input-number{
        margin: 5px 0;
    }
    .SettingForm button{
        float: right;
        margin-top: 10px;
    }
</style>