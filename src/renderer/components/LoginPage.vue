<template>
    <div>
        <section style="-webkit-app-region: drag" class="CloudIndexSection" v-show="!LoginSuccess">
            <section style="-webkit-app-region: no-drag">
                <button type="button" class="sf-icon-cog" @click="ServerSetting"></button>
                <button type="button" class="sf-icon-window-minimize" @click="mini"></button>
                <button type="button" class="sf-icon-times" style="font-size:16px" @click="close"></button>
            </section>
        </section>
        <div class="CloudIndexMain">
            <div class="CloudIndexLeft">
                <div class="CloudIndexHead" style="-webkit-app-region: drag" >
                    <h1>{{HeadText.h1}}</h1>
                    <p>{{HeadText.tips}}</p>
                </div>
                <div class="CloudIndexForm" v-show="ShowState.login.state">
                    <Logininput v-bind:data="LoginUserInput"></Logininput>
                    <Logininput v-bind:data="LoginPassInput"></Logininput>
                    <div class="CloudIndex-LineContainer">
                        <label><Checkbox v-model="RemberPass">记住我</Checkbox></label>
                        <a @click="changeType('forget')">忘记密码？</a>
                    </div>
                    <div class="CloudIndex-postBut">
                        <button @click="login" :class="LoginButtonState">登录</button>
                    </div>
                    <div class="CloudIndex-OtherLogin">
                        <label>其他登录</label>
                        <ul>
                            <li class="sf-icon-wechat" ripple><span>&nbsp&nbsp微信</span></li>
                            <div></div>
                            <li class="sf-icon-qq" ripple><span>&nbsp&nbspQQ</span></li>
                        </ul>
                    </div>
                    <div class="CloudIndex-Tips">
                        <p>使用邮箱&nbsp<span @click="changeType('register')">创建一个新用户</span></p>
                    </div>
                </div>
                <div class="CloudIndexForm" v-show="ShowState.register.state">
                    <Logininput v-bind:data="RegisterUserInput"></Logininput>
                    <Logininput v-bind:data="RegisterMailInput"></Logininput>
                    <Logininput v-bind:data="RegisterPassInput"></Logininput>
                    <VerifyInput v-bind:data="RegisterCodeInput"></VerifyInput>
                    <div class="CloudIndex-postBut">
                        <button post>创建</button>
                    </div>
                    <div class="CloudIndex-Tips">
                        <p>已经有账号&nbsp<span @click="changeType('login')">前往登录</span></p>
                    </div>
                </div>
                <div class="CloudIndexForm"  v-show="ShowState.forget.state">
                    <Logininput v-bind:data="ForgetUserInput"></Logininput>
                    <Logininput v-bind:data="ForgetMailInput"></Logininput>
                    <VerifyInput v-bind:data="ForgetCodeInput"></VerifyInput>
                    <div class="CloudIndex-LineContainer">
                        <p>填写以上信息开始吧</p>
                    </div>
                    <div class="CloudIndex-postBut">
                        <button post>开始</button>
                    </div>
                    <div class="CloudIndex-Tips">
                        <p>没有问题了&nbsp<span @click="changeType('login')">前往登录</span></p>
                    </div>
                </div>
                <div class="CloudIndexForm" v-show="ShowState.verify.state">
                    <Logininput v-bind:data="VerifyUserInput"></Logininput>
                    <Logininput v-bind:data="VerifyPassInput"></Logininput>
                    <Logininput v-bind:data="VerifyCodeInput"></Logininput>
                    <div class="CloudIndex-Tips">
                        <p style="text-align: left">没有收到邮件&nbsp<span id="resendBtn">重新发送</span></p>
                    </div>
                    <div class="CloudIndex-postBut">
                        <button post>激活</button>
                    </div>
                    <div class="CloudIndex-Tips">
                        <p>账号激活了&nbsp<span @click="changeType('login')">前往登录</span></p>
                    </div>
                </div>
            </div>
            <div class="CloudIndexRight">
                <img draggable="false" src="../../../static/img/logo/log.png">
            </div>
        </div>
        <div class="CloudIndexLogining" v-show="LoginSuccess">
            <ul>
                <li class="sf-icon-music"></li>
                <li class="sf-icon-users"></li>
                <li>
                    <img draggable="false" :src="User.head">
                    <div class="circle"></div>
                </li>
                <li class="sf-icon-video"></li>
                <li class="sf-icon-comments"></li>
                <p>正在加载用户信息</p>
            </ul>
        </div>
        <ServerWindow></ServerWindow>
    </div>
</template>

<script>
    import Logininput from './LoginPage/l-input';
    import VerifyInput from './LoginPage/Verify-Input';
    import ServerWindow from './LoginPage/ServerWindow';
    import Api from '../api/api';
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "LoginPage",
        components:{Logininput,VerifyInput,ServerWindow},
        data(){
            return{
                /*服务器值*/
                ServerAddress:'http://cloud.com:100',
                /*这里为组件传值*/
                RemberPass:false,
                LoginButtonState:false,
                LoginSuccess:false,
                /*登录组件数据*/
                LoginUserInput:{
                    icon:"sf-icon-user",
                    text:"用户名/手机号/邮箱/CloudID",
                    value:""
                },
                LoginPassInput:{
                    icon:"sf-icon-lock",
                    type:'password',
                    text:"输入您的密码",
                    value:""
                },
                /*注册组件数据*/
                RegisterUserInput:{
                    icon:"sf-icon-user",
                    text:"用户名",
                    value:""
                },
                RegisterMailInput:{
                    icon:"sf-icon-envelope",
                    text:"输入您的邮箱",
                    value:""
                },
                RegisterPassInput:{
                    icon:"sf-icon-lock",
                    type:'password',
                    text:"设置登录密码",
                    value:""
                },
                RegisterCodeInput:{
                    url:"http://cloud.com:100/service/verifyCode",
                    text:"验证码",
                    value:""
                },
                /*忘记密码组件数据*/
                ForgetUserInput:{
                    icon:"sf-icon-user",
                    text:"用户名",
                    value:""
                },
                ForgetMailInput:{
                    icon:"sf-icon-envelope",
                    text:"输入您的注册邮箱",
                    value:""
                },
                ForgetCodeInput:{
                    url:"http://cloud.com:100/service/verifyCode",
                    text:"验证码",
                    value:""
                },
                /*验证激活组件数据*/
                VerifyUserInput:{
                    icon:"sf-icon-user",
                    text:"用户名",
                    disabled:true,
                    value:123
                },
                VerifyPassInput:{
                    icon:"sf-icon-lock",
                    type:'password',
                    text:"您的密码",
                    value:""
                },
                VerifyCodeInput:{
                    icon:"sf-icon-keyboard",
                    text:"邮箱激活码",
                    value:""
                },
                /*登录页面显示切换参数*/
                HeadText:{
                    h1: "欢迎",
                    tips: "请登录后继续"
                },
                ShowState:{
                    login: {
                        h1: "欢迎",
                        tips: "请登录后继续",
                        state:true
                    },
                    register: {
                        h1:"开始",
                        tips:"创建一个新用户",
                        state:false
                    },
                    forget: {
                        h1:"帮助",
                        tips:"找回您的账号",
                        state:false
                    },
                    verify: {
                        h1:"准备",
                        tips:"激活您的账号",
                        state:false
                    }
                },
                /*登录成功的值*/
                User:{
                    head:null
                }
            }
        },
        created:function () {

        },
        mounted:function () {

        },
        methods:{
            login:function () {
                let _this=this;
                let username=this.LoginUserInput.value;
                let password=this.LoginPassInput.value;
                if (!username.length){
                    this.$Message.warning('请输入用户名');
                    return false;
                }
                if (!password.length){
                    this.$Message.warning('请输入密码');
                    return false;
                }
                if(this.LoginButtonState){
                    this.$Message.warning('正在验证登录信息');
                    return false;
                }
                this.LoginButtonState='CloudIndex-posting';
                Api.Login({
                    username:username,
                    password:password,
                },function (rs) {
                    rs=rs[0];
                    console.log(rs);
                    _this.$Message[rs.state](rs.msg);
                    _this.LoginButtonState='';
                    if(rs.state==='success'){
                        _this.LoginSuccess=true;
                        _this.User.head=_this.ServerAddress+'/'+rs.head;
                        ipc.send('login-success');
                    }
                });
            },
            changeType:function (type) {
                for(let item in this.ShowState){
                    this.ShowState[item].state = false
                }
                this.ShowState[type].state = true;
                this.HeadText.h1=this.ShowState[type].h1;
                this.HeadText.tips=this.ShowState[type].tips
            },
            ServerSetting:function(){
                this.$Modal.confirm({
                    title: 'Title',
                    content: '<input type="text" v-model="ServerAddress" :value="{{ServerAddress}}">',
                    okText: 'OK',
                    cancelText: 'Cancel'
                });

            },
            mini:function () {
                ipc.send('login-mini');
            },
            close:function () {
                ipc.send('login-close');
            }
        }
    }
</script>

<style scoped>
    @import url("../../../static/css/Slimf.css");
    @import url("../../../static/css/login.css");
</style>