<template>
    <div class="CloudDiskHeaderDrag" :style="{background: HeadSrc}">
        <ul class="CloudDiskFuncMenu">
            <img draggable="false" :src="static+'/img/bar/disk.png'"><span>CloudDisk</span>
            <li v-for="(item,index) in HeaderClassify" @click="HeaderType(item.flag)">
                <p> {{item.name}}</p>
                <div class="CloudDiskFuncLine" v-if="data.Type===item.flag"></div>
            </li>
        </ul>
        <div class="CloudDiskHeaderControl">
            <span></span>
            <button type="button" class="sf-icon-chevron-down" @click="DropMenuShow?DropMenuShow=false:DropMenuShow=true"></button>
            <Dropdown placement="bottom-start" trigger="custom" :visible.sync="DropMenuShow" @on-click="SystemDropDown">
                <DropdownMenu slot="list">
                    <DropdownItem name="account">
                        <img draggable="false" :src="UserInfo.userhead">
                        <p>我的账号</p>
                    </DropdownItem>
                    <DropdownItem name="setting">系统设置</DropdownItem>
                    <DropdownItem name="about">关于</DropdownItem>
                    <DropdownItem name="feedback">反馈</DropdownItem>
                    <DropdownItem name="switch">切换账户</DropdownItem>
                    <DropdownItem name="exit">退出</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <button type="button" class="sf-icon-window-minimize" @click="mini"></button>
            <button type="button" :class="ButtonState" @click="restore"></button>
            <button type="button" class="sf-icon-times" style="font-size:16px" @click="close"></button>
        </div>
        <div class="CloudDiskUser" @click="SystemDropDown('account')">
            <span>{{UserInfo.username}}</span>
            <img draggable="false" :src="UserInfo.userhead?UserInfo.userhead+now:''">
        </div>
    </div>
</template>

<script>
    export default {
        name: "DiskHeader",
        props:{
            HeadSrc:{
                type:String
            },
            data:{
                type:Object
            },
            hide:{
                type:Boolean
            },
            count:{
                type:Number
            }
        },
        computed:{
            now(){
                return '?'+Date.now();
            },
            static(){
                return this.$path.join(__static)
            },
        },
        watch:{
            hide:{
                handler(){
                    if(this.hide){
                        this.DropMenuShow=!this.hide;
                    }
                },
                deep:true
            }
        },
        data(){
            return{
                UserInfo:{
                    username:"未登录",
                    userhead:""
                },//用户信息
                QuitFlag:false,//是否允许退出
                ButtonState:"sf-icon-window-maximize",//右上角窗口按钮状态,
                DropMenuShow:false,//用户下拉菜单,
                HeaderClassify:[
                    {name:"网盘",flag:'disk'},
                    {name:"分享",flag:'share'},
                    {name:"传输",flag:'trans'},
                ],
                DiskWindow:false
            }
        },
        beforeMount(){
            this.DiskWindow=this.$electron.remote.getCurrentWindow();
            this.DiskWindow.on('maximize',()=>{
                this.ButtonState='sf-icon-window-restore';
            });
            this.DiskWindow.on('unmaximize',()=>{
                this.ButtonState='sf-icon-window-maximize';
            });
            window.onbeforeunload=()=>{
                if(!this.QuitFlag&&process.env.NODE_ENV !== 'development') {
                    this.DiskWindow.hide();
                    return false
                }
            };
            this.$ipc.on('exit',()=>{
                this.SystemDropDown('exit');
            });
            this.$ipc.on('user-update',()=>{
                this.GetUserInfo();
            });
            this.GetUserInfo();
        },
        methods:{
            mini () {
                this.DiskWindow.minimize();
            },
            close () {
                this.DiskWindow.hide();
            },
            restore () {
                if (this.DiskWindow.isMaximized()) {
                    this.DiskWindow.restore();
                } else {
                    this.DiskWindow.maximize();
                }
            },
            SystemDropDown (command) {
                this.DropMenuShow=false;
                if(command!=='switch'&&command!=='exit') {
                    this.$ipc.send('system', command,command==='account'?this.UserInfo:"");
                }else{
                    let tips='',type='';
                    type=(command==='switch'?'切换':'退出');
                    if(this.count>0){
                        tips=this.count+'个传输任务未完成，'+type+'将暂停传输<br>'
                    }
                    switch (command){
                        case 'switch':
                            this.Confrim({
                                title:'切换账号',
                                tips:tips+'确认退出当前账号吗',
                                callback:()=> {
                                    this.QuitFlag=true;
                                    this.$ipc.send('system','logoff');
                                }
                            });
                            break;
                        case 'exit':
                            this.Confrim({
                                title:'退出',
                                tips:tips+'确认退出CloudDisk吗?',
                                type:'info',
                                callback:()=> {
                                    this.QuitFlag=true;
                                    this.DiskWindow.close();
                                }
                            });
                            break;
                    }
                }
            },
            GetUserInfo () {
                this.$Api.User.UserInfo((rs)=>{
                    this.$nextTick(()=>{
                        this.UserInfo=rs[0];
                    });
                    this.$Api.LocalFile.Exist(rs[0].userid);
                    this.$Api.LocalFile.Write('user',rs[0]);
                    localStorage.LoginTime=rs[0].login_time;
                },()=>{
                    this.$Message.error({
                        content: '账号状态异常，请重新登录！',
                        onClose:()=> {
                            /////弹出登录页
                            this.$ipc.send('system','logoff');
                        }
                    });
                });
            },//获取用户信息,
            HeaderType(commend){
                this.$emit('callback',commend);
            }
        }
    }
</script>

<style scoped>

</style>