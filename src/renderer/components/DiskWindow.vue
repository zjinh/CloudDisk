<template>
    <div class="CloudDiskMain">
        <div class="CloudDiskHeaderDrag">
            <ul class="CloudDiskFuncMenu">
                <img draggable="false" src="../../../static/img/bar/disk.png"><span>CloudDisk</span>
                <li><p> 网盘</p><div class="CloudDiskFuncLine" style="width:100%;"></div></li>
                <li><p> 分享</p><div class="CloudDiskFuncLine"></div></li>
                <li><p> 传输</p><div class="CloudDiskFuncLine"></div></li>
            </ul>
            <section class="CloudDiskHeaderControl">
                <span></span>
                <button type="button" class="sf-icon-chevron-down"></button>
                <button type="button" class="sf-icon-window-minimize" @click="mini"></button>
                <button type="button" :class="ButtonState" @click="restore"></button>
                <button type="button" class="sf-icon-times" style="font-size:14px" @click="close"></button>
            </section>
            <div class="CloudDiskUser">
                <span>{{Logined.username}}</span>
                <img draggable="false" :src="Logined.userhead">
            </div>
        </div>
        <div class="CloudDiskFuncMain">
            <div class="CloudDiskHead">
                <div class="CloudDiskHeadLeft">
                    <div class="CloudDiskNav">
                        <button class="sf-icon-arrow-left CloudDiskDisable"> 后退</button>
                        <span class="CloudDiskNavLine">|</span>
                        <button>{{CurrectClassify}}</button>
                        <div class="CloudDiskNavBar" id="CloudDiskNavBar"></div>
                    </div>
                </div>
                <div class="CloudDiskHeadRight">
                    <input class="CDsearchInput" placeholder="搜索" id="CDsearchInput">
                    <button class="sf-icon-search" id="CloudDiskSearchBtn"></button>
                    <button class="sf-icon-sort-amount-up" id="CloudDiskNormalSort"></button>
                    <button class="sf-icon-th-large" onclick="CloudDisk.ViewMode(this)"></button>
                </div>
            </div>
            <div class="CloudDiskLeft">
                <ClassifyMenu v-bind:data="ClassifyData"  v-on:updateClassify="updateClassify"></ClassifyMenu>
                <ul class="CloudDiskClassify" id="CloudDiskShareClass" style="display: none">
                    <li ripple class="CloudDiskClassifyActive"><span></span>我的分享</li>
                    <li ripple><span></span>已失效的</li>
                </ul>
                <ul class="CloudDiskClassify"style="display: none">
                    <li ripple class="CloudDiskClassifyActive"><span class="sf-icon-download"></span>正在下载</li>
                    <li ripple><span class="sf-icon-upload"></span>正在上传</li>
                    <li ripple><span class="sf-icon-check-circle"></span>传输完成</li>
                </ul>
                <div class="CloudDiskSelectTips" id="CloudDiskSelectTips"></div>
                <div class="CloudDiskCapacity">
                    <div class="CloudDiskSliderContainer">
                        <div class="CloudDiskSlider" id="CloudDiskInfoSlider"></div>
                    </div>
                    <p id="CloudDiskInfoShow">--/--</p>
                </div>
            </div>
            <div class="CloudDiskRight">
                <div class="CloudDiskMainFunc" id="CloudDiskTrashFunc">
                    <span class="sf-icon-info-circle"> 回收站仍然占用网盘空间，文件保存10天后将被自动清除。</span>
                    <button id="TrashBtn" class="CloudDiskDisable" onclick="CloudDisk.TrashClean(this)">清空回收站</button>
                </div>
                <div class="CloudDiskMainFunc" id="CloudDiskMainFunc">
                    <div class="CloudDiskFuncBlock" state="up" onclick="CloudDisk.FileSort(0,'disk_name')" ripple style="width:calc(55% - 15px)">
                        文件名
                    </div>
                    <div class="CloudDiskFuncBlock" state="up" onclick="CloudDisk.FileSort(1,'create_time')" ripple>
                        修改日期
                    </div>
                    <div class="CloudDiskFuncBlock" state="up" onclick="CloudDisk.FileSort(2,'disk_size')" ripple>
                        大小
                    </div>
                </div>
                <div class="CloudDiskMain1" id="CloudDiskMainContainer">
                    <div class='CloudDiskLoading'><div class='sf-icon-hdd'><div class='CloudDiskLoading-beat'><div></div> <div></div> <div></div> </div></div>正在加载</div>
                </div>
            </div>
        </div>
        <ul class="SlimfMouseMenu">
            <li onclick="CloudDisk.MouseMenu.upload();">我的账户</li>
            <li onclick="CloudDisk.MouseMenu.CreateFolder()">系统设置</li>
            <li class="CloudDiskDisable" onclick="CloudDisk.MouseMenu.paste(this)">关于</li>
            <li onclick="CloudDisk.MouseMenu.refues()">切换账户</li>
            <li onclick="CloudDisk.MouseMenu.refues()">退出</li>
        </ul>
        <ul class="SlimfMouseMenu" id="CloudDiskMouseMenu">
            <li onclick="CloudDisk.MouseMenu.upload();">上传文件</li>
            <li onclick="CloudDisk.MouseMenu.CreateFolder()">新建文件夹</li>
            <li id="CloudDiskPasteButton" class="CloudDiskDisable" onclick="CloudDisk.MouseMenu.paste(this)">粘贴</li>
            <li onclick="CloudDisk.MouseMenu.refues()">刷新</li>
        </ul>
        <ul class="SlimfMouseMenu" id="CloudDiskFileMouseMenu">
            <li onclick="CloudDisk.MouseMenuFile.open();">打开</li>
            <li id="CloudDiskDownLoadButton" onclick="CloudDisk.MouseMenuFile.Download();">下载</li>
            <li onclick="CloudDisk.MouseMenuFile.moveto()">移动到</li>
            <li id="CloudDiskCopyButton" onclick="CloudDisk.MouseMenuFile.Copy()">复制</li>
            <li onclick="CloudDisk.MouseMenuFile.Cut()">剪切</li>
            <li onclick="CloudDisk.MouseMenuFile.Rename()">重命名</li>
            <li onclick="CloudDisk.MouseMenuFile.Delete()">删除</li>
            <li id="CloudDiskShareButton" onclick="CloudDisk.MouseMenuFile.share()">分享</li>
            <li onclick="CloudDisk.MouseMenuFile.Info()">属性</li>
        </ul>
        <ul class="SlimfMouseMenu" id="CloudDiskShareMouseMenu">
            <li onclick="CloudDisk.MouseMenuFile.open();">打开</li>
            <li onclick="CloudDisk.MouseMenuFile.Rename()">重命名</li>
            <li onclick="CloudDisk.MouseMenuFile.Delete()">删除</li>
            <li onclick="CloudDisk.MouseMenuFile.share()">分享</li>
            <li onclick="CloudDisk.MouseMenuFile.Info()">属性</li>
        </ul>
        <ul class="SlimfMouseMenu" id="CloudDiskTrashMouseMenu">
            <li onclick="CloudDisk.TrashMouseMenu.Restore()">还原</li>
            <li onclick="CloudDisk.TrashMouseMenu.Delete()">删除</li>
            <li onclick="CloudDisk.MouseMenuFile.Info()">属性</li>
        </ul>
    </div>
</template>

<script>
    import Api from '../api/api';
    import ClassifyMenu from './DiskWindow/ClassifyMenu';
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "DiskWindow",
        components:{ClassifyMenu},
        data(){
            return{
                Logined:{},
                ButtonState:"sf-icon-window-maximize",
                CurrectClassify:'全部文件',
                ClassifyData:[
                    {"name":"全部文件","icon":"sf-icon-hdd","data":"","active":"CloudDiskClassifyActive"},
                    {"name":"图片","icon":"","data":"","active":""},
                    {"name":"视频","icon":"","data":"","active":""},
                    {"name":"文档","icon":"","data":"","active":""},
                    {"name":"音乐","icon":"","data":"","active":""},
                    {"name":"种子","icon":"","data":"","active":""},
                    {"name":"其他","icon":"","data":"","active":""},
                    {"name":"回收站","icon":"sf-icon-trash","data":"","active":""},
                ]
            }
        },
        created(){
            this.Bind();
            this.GetUserInfo();
        },
        methods:{
            Bind:function(){
                ipc.on('size',(event,message)=> {
                    if(message>0){
                        this.ButtonState='sf-icon-window-restore';
                    }else {
                        this.ButtonState='sf-icon-window-maximize';
                    }
                });
            },
            GetUserInfo:function () {
                Api.User.UserInfo((rs)=>{
                    rs[0].userhead=localStorage.server+'/'+rs[0].userhead;
                    this.Logined=rs[0];
                },()=>{
                    this.$Message.error({
                        content: '账号状态异常，请重新登录！',
                        onClose:()=> {
                            /////弹出登录页
                        }
                    });
                })
            },
            updateClassify:function(value){//更新网盘分类子组件传回的数据
                this.CurrectClassify=value;
            },
            mini:function () {
                ipc.send('disk-mini');
            },
            close:function () {
                ipc.send('disk-close');
            },
            restore:function () {
                ipc.send('disk-change');
            }
        }
    }
</script>

<style scoped>
    @import url("../../../static/css/Slimf.css");
    @import url("../../../static/css/disk.css");
</style>