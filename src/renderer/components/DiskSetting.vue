<template>
    <div class="CloudDiskSettingWindow">
        <div class="CloudDiskSetting-head">
            <Icon :type="'md-settings '+this.loading"></Icon>
            <p>设置</p>
            <button class="sf-icon-times" @click="close"></button>
            <button class="sf-icon-window-minimize" @click="mini"></button>
        </div>
        <div class="CloudDiskSetting-main">
            <SettingMenu v-bind:data="SettingMenuData" v-on:change="change"></SettingMenu>
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
                <div class="CloudDiskSettingContainer" v-show="SettingMenuData.Safety.active">
                    <p class="SettingBigTitle">绑定设置</p>
                    <p class="SettingSecTitle">修改安全邮箱</p>
                    <p class="SettingInfo">当前绑定邮箱：{{Email}}<button @click="OpenChangeEmailDialog">[修改]</button></p>
                    <p class="SettingSecTitle">更换手机</p>
                    <p class="SettingInfo">当前绑定手机号：{{Phone}}<button>[修改]</button></p>
                    <p class="SettingSecTitle">微信登录绑定</p>
                    <p class="SettingInfo">暂未开放</p>
                    <p class="SettingSecTitle">QQ登录绑定</p>
                    <p class="SettingInfo">暂未开放</p>
                </div>
                <div class="CloudDiskSettingContainer" v-show="SettingMenuData.Trans.active">
                    <p class="SettingBigTitle">传输设置</p>
                    <p class="SettingSecTitle">下载目录设置</p>
                    <div class="SettingForm">
                        <Input type="text" v-model="TransDownFolder"style="width: 100%" />
                    </div>
                    <p class="SettingSecTitle">同时上传数</p>
                    <div class="SettingForm">
                        <InputNumber :max="5"  :min="1" v-model="MaxUpTrans"></InputNumber>
                    </div>
                    <p class="SettingSecTitle">同时下载数</p>
                    <div class="SettingForm">
                        <InputNumber :max="5" :min="1" v-model="MaxDownTrans"></InputNumber>
                    </div>
                    <p class="SettingTips">*请不要在正在下载文件的情况下修改下载目录</p>
                    <p class="SettingTips">*修改后将立刻保存生效</p>
                </div>
                <div class="CloudDiskSettingContainer" v-show="SettingMenuData.Notice.active">
                    <p class="SettingBigTitle">提醒设置</p>
                </div>
            </div>
        </div>
        <el-dialog title="更换邮箱" :visible.sync="ShowChangeEmailWindow1" width="300px" top="70px">
            <div style="height: 120px;">
                <p class="SettingSecTitle">我们需要以下信息</p>
                <Input type="password" v-model="ChangeEmailData.pass" placeholder="当前账号密码" clearable style="width: 100%" />
                <Input type="text" v-model="ChangeEmailData.email" placeholder="您的新邮箱地址" clearable style="width: 100%" />
            </div>
            <span slot="footer" class="dialog-footer">
                <button class="el-button el-button--default el-button--small" @click="ShowChangeEmailWindow1 = false">取 消</button>
                <button class="el-button el-button--default el-button--small el-button--primary" @click="ChangeEmail">确 定</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Api from '../api/api';
    import SettingMenu from './DiskSetting/SettingMenu';
    import electron from 'electron';
    let DiskSetting=electron.remote.getCurrentWindow();
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "DiskSetting",
        components:{SettingMenu},
        watch:{
            MaxUpTrans: {
                handler(newValue, oldValue) {
                    localStorage.MaxUpTrans=this.MaxUpTrans;
                },
                deep: true
            },
            MaxDownTrans: {
                handler(newValue, oldValue) {
                    localStorage.MaxDownTrans=this.MaxDownTrans;
                },
                deep: true
            },
            TransDownFolder: {
                handler(newValue, oldValue) {
                    localStorage.TransDownFolder=this.TransDownFolder
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
                user:'',
                LoginTime:0,
                loading:'',
                Phone:'',
                Email:'',
                TransDownFolder:'',
                MaxUpTrans:1,
                MaxDownTrans:1,
                ShowChangeEmailWindow1:false,
                ChangeEmailData:{
                    ctype:1,
                    pass:'',
                    email:''
                }
            }
        },
        created(){
            this.user=localStorage.username;
            this.LoginTime=localStorage.LoginTime;
            this.TransDownFolder=localStorage.TransDownFolder;
            this.MaxUpTrans=parseInt(localStorage.MaxUpTrans);
            this.MaxDownTrans=parseInt(localStorage.MaxDownTrans);
            this.Phone=localStorage.Phone;
            this.Email=localStorage.email;
        },
        methods:{
            change(item,index){
                for(let i in this.SettingMenuData){
                    this.SettingMenuData[i].active='';
                }
                this.SettingMenuData[index].active='active';
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
                Api.User.ChangePass(this.ChangePass,(rs)=>{
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
                    this.ShowChangeEmailWindow1=true;
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
                    this.ShowChangeEmailWindow1=false;
                    return
                }
                this.loading='sf-spin';
                if(this.ChangeEmailData.ctype===1) {
                    this.SendVerifyEmail();
                }
            },
            SendVerifyEmail(){
                Api.User.ChangeSafeEmail(this.ChangeEmailData,(rs)=>{
                    this.loading=false;
                    if(!rs[0]){
                        this.$Message.error('服务器错误');
                        return
                    }
                    if(rs[0].state==='success'){
                        this.ChangeEmailData.ctype=2;
                        this.ShowChangeEmailWindow1=false;
                        this.SubmitChangeEmail();
                        this.$Message.success('认证邮件已发送，授权码10分钟有效');
                    }else {
                        this.$Message.error('密码错误');
                    }
                })
            },
            SubmitChangeEmail(){
                this.InputConfrim({
                    title:"验证邮箱",
                    tips:"请输入邮箱内的验证码",
                    callback:(code)=>{
                        Api.User.ChangeSafeEmail({
                            code:code,
                            ctype:2
                        },(rs)=>{
                            this.loading=false;
                            if(!rs[0]){
                                this.$Message.error('服务器错误');
                                return
                            }
                            if(rs[0].state==='success'){
                                this.$Message.success('安全邮箱已修改');
                                this.Email=rs[0].email;
                                localStorage.email=rs[0].email;
                                this.getUser();
                            }else {
                                this.$Message.error('授权码错误或失效');
                            }
                            this.ChangeEmailData.ctype=1;
                        })
                    }
                })
            },
            getUser(){
                Api.User.UserInfo((rs)=>{
                    this.$nextTick(()=>{
                        rs=rs[0];
                        ipc.send('user',rs);
                    });
                },()=>{
                })
            },
            InputConfrim(options){
                this.$prompt(options.tips, options.title, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:options.value||'',
                }).then(({ value }) => {
                    options.callback(value)
                }).catch(() => {
                });
            },
            close(){
                DiskSetting.close();
            },
            mini(){
                DiskSetting.minimize();
            }
        }
    }
</script>

<style scoped>

</style>