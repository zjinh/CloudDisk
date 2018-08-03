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
                    <p class="SettingInfo">当前账号：{{user}}</p>
                    <p class="SettingSecTitle">修改安全邮箱</p>
                    <p class="SettingInfo">当前绑定邮箱：{{user}}</p>
                    <p class="SettingSecTitle">更换手机</p>
                    <p class="SettingInfo">当前绑定手机号：{{user}}</p>
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
    </div>
</template>

<script>
    import Api from '../api/api';
    import SettingMenu from './DiskSetting/SettingMenu';
    import electron from 'electron';
    let DiskSetting=electron.remote.getCurrentWindow();
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
                TransDownFolder:'',
                MaxUpTrans:1,
                MaxDownTrans:1,
            }
        },
        created(){
            this.user=localStorage.username;
            this.LoginTime=localStorage.LoginTime;
            this.TransDownFolder=localStorage.TransDownFolder;
            this.MaxUpTrans=parseInt(localStorage.MaxUpTrans);
            this.MaxDownTrans=parseInt(localStorage.MaxDownTrans);
        },
        methods:{
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
            change(item,index){
                for(let i in this.SettingMenuData){
                    this.SettingMenuData[i].active='';
                }
                this.SettingMenuData[index].active='active';
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