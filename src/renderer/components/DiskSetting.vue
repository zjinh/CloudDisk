<template>
    <div class="CloudDiskSettingWindow">
        <div class="CloudDiskSetting-head">
            <Icon type="gear-b"></Icon>
            <p>设置</p>
            <button class="sf-icon-times" @click="close"></button>
            <button class="sf-icon-window-minimize" @click="mini"></button>
        </div>
        <div class="CloudDiskSetting-main">
            <SettingMenu v-bind:data="SettingMenuData" v-on:change="change"></SettingMenu>
            <div class="CloudDiskSettingContent">
                <div class="CloudDiskSettingContainer" v-show="SettingMenuData.Safety.active">
                    <p class="SettingBigTitle">安全设置</p>
                    <p class="SettingSecTitle">修改账号密码</p>
                    <p class="SettingInfo">当前账号：</p>
                    <div class="SettingForm">
                        <Input v-model="ChangePass.oldpass" placeholder="当前账号密码" clearable style="width: 100%" />
                        <Input v-model="ChangePass.newpass" placeholder="新密码" clearable style="width: 100%" />
                        <Input v-model="ChangePass.againPass" placeholder="再次输入密码" clearable style="width: 100%" />
                        <button class="el-button el-button--default el-button--small el-button--primary " @click="">更新</button>
                    </div>
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
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "DiskSetting",
        components:{SettingMenu},
        data(){
            return{
                SettingMenuData:{
                    Safety:{
                        active:"active",
                        name:"安全",
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
                }
            }
        },
        created(){

        },
        methods:{
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