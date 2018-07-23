<template>
    <div class="CloudUserMain">
        <div class="CloudDiskInfoControl">
            <button class="sf-icon-times" @click="close"></button>
            <button class="sf-icon-window-minimize" @click="mini"></button>
        </div>
        <div class="CloudUserLeft">
            <div class="CloudUserLeftDown">
                <img draggable="false" :src="UploadSrc?UploadSrc:User.userhead+now">
                <p class="CloudUserName">{{User.username}}</p>
                <p class="CloudUserAge">{{User.sex}},{{User.birth}}岁</p>
            </div>
        </div>
        <div class="CloudUserRight">
            <p class="CloudUserTitle">个人信息</p>
            <form  @submit.prevent="onSubmit" ref="form">
                <div class="CloudUserLine"><label>名称：</label><p>{{User.username}}</p></div>
                <div class="CloudUserLine"><label>邮箱：</label><p>{{User.email}}</p></div>
                <div class="CloudUserLine">
                    <label>手机：</label>
                    <Input :value=User.phone clearable style="width: calc(100% - 50px)" name="phone" :number=true :maxlength=11></Input>
                </div>
                <div class="CloudUserLine">
                    <label>生日：</label>
                    <DatePicker type="date" style="width: calc(100% - 50px)" :value=User.birthday name="birth"></DatePicker>
                </div>
                <div class="CloudUserLine"><label>性别：</label>
                    <Select style="width: calc(100% - 50px)" :value="User.sex" name="sex">
                        <Option v-for="item in sexs" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="CloudUserUpload" onclick="this.childNodes[0].click()">
                    <input type="file" name="userhead"  @change="preview()" ref="file">
                </div>
                <div class="CloudUserLine" style="height: 72px;">
                    <label>签名:</label>
                    <textarea class="ivu-input" name="underwrite" :value="User.underwrite" :maxlength=50></textarea>
                </div>
                <button class="el-button el-button--default el-button--small el-button--primary " @click="update">更新</button>
                <button v-if="UploadSrc" class="el-button el-button--default el-button--small el-button--primary " @click="clear">清空头像文件</button>
            </form>
        </div>
    </div>
</template>

<script>
    import Api from '../api/api';
    import electron from 'electron';
    const {ipcRenderer} = require('electron');
    let AccountWindow=electron.remote.getCurrentWindow();
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "DiskAccount",
        data(){
              return{
                  User:{
                      userhead:''
                  },
                  UploadSrc:false,
                  sexs:[
                      {
                          value: '男',
                          label: '男'
                      },
                      {
                          value: '女',
                          label: '女'
                      },
                      {
                          value: '保密',
                          label: '保密'
                      },
                  ]
              }
        },
        created(){
            ipcRenderer.on('user-data', (event, data)=>{//接收打开文件的数据
                this.$nextTick(()=>{
                    data.birth=this.age(data.birthday);
                    this.User=data;
                });
            });
        },
        computed:{
            now(){
                return '?'+Date.now();
            }
        },
        methods:{
            clear(){
                this.UploadSrc=false;
                this.$refs.file.value='';
            },
            preview(){
                this.UploadSrc=false;
                let elm=event.target;
                let user_pic = elm.value;
                if (user_pic.length > 1 && user_pic) {
                    let type =  this.StringBefore(user_pic,'.');
                    if (!this.StringExist(type,'png,jpg,jpeg,bmp,gif,PNG,JPG,JPEG,BMP,GIF')) {
                        this.$Message.error('所选格式为' + type + ' 请重新选择上传的文件');
                        return false
                    }
                    elm.files&&elm.files[0]?this.UploadSrc = window.URL.createObjectURL(elm.files[0]):"";
                }
            },
            update(){
                let formdata = new FormData(this.$refs.form);
                Api.User.Update(formdata,(r)=>{
                    if (r[0].state==='success') {
                        this.$Message.success('信息已更新');
                        this.getUser();
                    }else{
                        this.$Message.error('信息更新失败');
                    }
                    this.clear();
                });
                return false;
            },
            getUser(){
                Api.User.UserInfo((rs)=>{
                    this.$nextTick(()=>{
                        rs=rs[0];
                        rs.userhead=localStorage.server+'/'+rs.userhead+'?'+Date.now();
                        rs.birth=this.age(rs.birthday);
                        this.User=rs;
                        ipc.send('user',rs);
                    });
                },()=>{
                })
            },
            onSubmit(){return false;},
            StringExist (str, substr) {
                if(typeof str !== "string"){ return; }
                if(substr==='|*|'){return true}
                for(let i=0;i<substr.split(',').length;i++){
                    if(str.indexOf(substr.split(',')[i]) >= 0 === true ){ return true; }
                }
                return false;
            },
            StringBefore (str,substr) {
                return str.substring(str.lastIndexOf(substr) + 1, str.length);
            },
            age(birth){
                birth = Date.parse(birth?birth:"".replace('/-/g', "/"));
                return parseInt((new Date() - new Date(birth)) / (1000 * 60 * 60 * 24 * 365));
            },
            close(){
                AccountWindow.close();
            },
            mini(){
                AccountWindow.minimize();
            }
        }
    }
</script>

<style scoped>

</style>