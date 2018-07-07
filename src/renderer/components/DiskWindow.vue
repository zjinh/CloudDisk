<template>
    <div class="CloudDiskMain">
        <div class="CloudDiskHeaderDrag">
            <ul class="CloudDiskFuncMenu">
                <img draggable="false" src="../../../static/img/bar/disk.png"><span>CloudDisk</span>
                <li @click="changeType('disk')"><p> 网盘</p><div class="CloudDiskFuncLine" v-if="DiskType==='disk'"></div></li>
                <li @click="changeType('share')"><p> 分享</p><div class="CloudDiskFuncLine" v-if="DiskType==='share'"></div></li>
                <li @click="changeType('trans')"><p> 传输</p><div class="CloudDiskFuncLine" v-if="DiskType==='trans'"></div></li>
            </ul>
            <section class="CloudDiskHeaderControl">
                <span></span>
                <button type="button" class="sf-icon-chevron-down"></button>
                <button type="button" class="sf-icon-window-minimize" @click="mini"></button>
                <button type="button" :class="ButtonState" @click="restore"></button>
                <button type="button" class="sf-icon-times" style="font-size:16px" @click="close"></button>
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
                        <button>{{ClassifyName}}</button>
                        <div class="CloudDiskNavBar" id="CloudDiskNavBar"></div>
                    </div>
                </div>
                <div class="CloudDiskHeadRight">
                    <input class="CDsearchInput" placeholder="搜索" v-model="SearchKey" @blur="ShowSearch=false" :style="ShowSearch?{width:'170px',border:'1px solid #eee'}:''">
                    <button class="sf-icon-search" @click="SwitchSearch"></button>
                    <button :class="'sf-icon-sort-amount-'+DiskSortState.amount" @click="DiskSort('amount','disk_name')"></button>
                    <button :class="DiskStateIcon" @click="changeState"></button>
                </div>
            </div>
            <div class="CloudDiskLeft">
                <ClassifyMenu v-bind:data="ClassifyData" v-on:updateClassify="updateClassify" v-show="DiskType==='disk'"></ClassifyMenu>
                <ClassifyMenu v-bind:data="ShareData" v-on:updateClassify="updateClassify" v-show="DiskType==='share'"></ClassifyMenu>
                <ClassifyMenu v-bind:data="TransData" v-on:updateClassify="updateClassify" v-show="DiskType==='trans'"></ClassifyMenu>

                <div class="CloudDiskSelectTips">已选择N个文件</div>
                <div class="CloudDiskCapacity">
                    <div class="CloudDiskSliderContainer">
                        <div class="CloudDiskSlider" :style="{'width':DiskSize.Percent,background:DiskSize.Background}"></div>
                    </div>
                    <p>{{DiskSize.text}}</p>
                </div>
            </div>
            <div class="CloudDiskRight">
                <div class="CloudDiskMainFunc" v-show="ClassifyName==='回收站'">
                    <span class="sf-icon-info-circle"> 回收站仍然占用网盘空间，文件保存10天后将被自动清除。</span>
                    <button id="TrashBtn" class="CloudDiskDisable" onclick="CloudDisk.TrashClean(this)">清空回收站</button>
                </div>
                <div class="CloudDiskMainFunc" v-show="DiskShowState!=='CloudDiskMFile'">
                    <div :class="'CloudDiskFuncBlock sf-icon-sort-alpha-'+DiskSortState.alpha" @click="DiskSort('alpha','disk_name')" ripple style="width:54%">
                        文件名
                    </div>
                    <div :class="'CloudDiskFuncBlock sf-icon-sort-numeric-'+DiskSortState.mum" @click="DiskSort('mum','create_time')" ripple>
                        修改日期
                    </div>
                    <div :class="'CloudDiskFuncBlock sf-icon-sort-numeric-'+DiskSortState.mum1" @click="DiskSort('mum1','disk_size')" ripple>
                        大小
                    </div>
                </div>
                <div class="CloudDiskMain1">
                    <DiskFile v-if="LoadCompany&&DiskType!=='trans'" v-bind:data="DiskData" v-bind:ShowState="DiskShowState" ref="DiskFile"></DiskFile>
                    <div class='CloudDiskLoading' v-show="!LoadCompany&&DiskType!=='trans'"><div class='sf-icon-hdd'><div class='CloudDiskLoading-beat'><div></div> <div></div> <div></div> </div></div>正在加载</div>
                    <div class='CloudDiskEmptyTips' v-if="LoadCompany&&DiskType!=='trans'" v-show="!DiskData.length>0"><span class='sf-icon-hdd'></span>这里什么都没有</div>
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
    import DiskFile from './DiskWindow/DiskFile';
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "DiskWindow",
        components:{ClassifyMenu,DiskFile},
        data(){
            return{
                Logined:{},
                DiskData:[],//存放用户网盘数据
                LoadCompany:false,//是否加载完成
                ButtonState:"sf-icon-window-maximize",//右上角窗口按钮状态
                ClassifyName:'全部文件',//地址栏左侧分类显示文本
                DiskShowState:'CloudDiskMFile',//初始化大图标文件
                DiskStateIcon:'sf-icon-th-large',//显示状态图片
                DiskType:"disk",//头部分类标签
                ClassifyData:[
                    {"name":"全部文件","icon":"sf-icon-hdd","data":"normal","active":"CloudDiskClassifyActive"},
                    {"name":"图片","icon":"","data":"picture","active":""},
                    {"name":"视频","icon":"","data":"video","active":""},
                    {"name":"文档","icon":"","data":"document","active":""},
                    {"name":"音乐","icon":"","data":"music","active":""},
                    {"name":"种子","icon":"","data":"torrent","active":""},
                    {"name":"其他","icon":"","data":"other","active":""},
                    {"name":"回收站","icon":"sf-icon-trash","data":"trash","active":""},
                ],//网盘分类参数
                ShareData:[
                    {"name":"我的分享","icon":"","data":"share","active":"CloudDiskClassifyActive"},
                    {"name":"失效分享","icon":"","data":"disshare","active":""},
                ],//分享分类参数
                TransData:[
                    {"name":"正在下载","icon":"sf-icon-download","data":"share","active":"CloudDiskClassifyActive"},
                    {"name":"正在上传","icon":"sf-icon-upload","data":"disshare","active":""},
                    {"name":"传输完成","icon":"sf-icon-check-circle","data":"disshare","active":""},
                ],
                /*网盘大小*/
                DiskSize:{
                    total:0,
                    use:0,
                    Percent:'0%',
                    Background:'#2682fc',
                    text:'0B/0B'
                },
                /*网盘一些记录的参数*/
                DiskPage:1,//网盘加载的页数
                NowDiskID:null,
                DiskAllCount:0,
                DiskLoadCount:0,
                loadClassify:'normal',//网盘加载的分类
                /*排序参数*/
                DiskSortState:{
                    amount:'up',
                    mum:'up',
                    mum1:'up',
                    alpha:'up',
                },
                ShowSearch:false,//搜索框打开关闭
                SearchKey:'',//搜索关键词

            }
        },
        created(){
            this.Bind();
            this.GetUserInfo();
            this.GetMainFile(null,this.loadClassify);
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
                            ipc.send('disk-error');
                        }
                    });
                })
            },
            changeType:function(type){
                this.DiskData=[];//清空数据
                this.DiskType=type;
                if(type==='disk') {
                    //this.ClassifyData[0].active='CloudDiskClassifyActive';
                    this.GetMainFile(null,this.ClassifyData[0].data);
                }else if(type==='share'){
                    //this.ShareData[0].active='CloudDiskClassifyActive';
                    this.GetMainFile(null,type);
                }else{

                }
            },//切换网盘分享、传输等
            GetMainFile:function(id,type){
                if(this.DiskPage===1){
                    this.DiskData=[];//清空数据
                    this.LoadCompany=false;
                }
                if (!id) {
                    id = 'null';
                }
                if (this.loadClassify !== type) {
                    this.DiskLoadCount = 0;
                    this.DiskPage = 1;
                    this.LoadCompany=false;
                }
                this.NowDiskID=id;
                this.loadClassify = type;
                Api.Disk.LoadMainFile({
                    id: id,
                    page: this.DiskPage,
                    loadtype: this.loadClassify
                },(rs)=>{
                    if (this.DiskPage === 1) {
                        this.DiskAllCount=0;
                        this.DiskLoadCount=0;
                    }
                    this.LoadCompany=true;
                    this.DiskData=rs;
                    if(rs.length){
                        this.$nextTick(()=>{
                            this.DiskSize.total=rs[0].max_size;
                            this.DiskSize.use=rs[0].use_size;
                            let Percent=(this.DiskSize.use/this.DiskSize.total)*100;
                            this.DiskSize.Percent=Percent+'%';
                            this.DiskSize.text=this.$refs.DiskFile.FileSize(this.DiskSize.use)+'/'+this.$refs.DiskFile.FileSize(this.DiskSize.total)
                            if (65 < Percent && Percent < 85) {
                                this.DiskSize.Background = '#f7ab21';
                            } else if (Percent >= 85) {
                                this.DiskSize.Background = '#e83c3c';
                            }
                        });
                        this.DiskAllCount=rs[0].all_count;
                        this.DiskLoadCount=this.DiskLoadCount+rs.length;
                        //console.log(this.$.refs.DiskFile.FileSize(this.DiskSize.use))
                    }
                    console.log(rs)
                })
            },
            updateClassify:function(value){//更新网盘分类子组件传回的数据
                this.ClassifyName=value.name;
                this.loadClassify=value.data;
                this.GetMainFile(null,this.loadClassify);
            },
            changeState:function(){
                this.DiskShowState==='CloudDiskMFile'?this.DiskShowState='CloudDiskMList':this.DiskShowState='CloudDiskMFile';
                this.DiskStateIcon==='sf-icon-th-large'?this.DiskStateIcon='sf-icon-list-ul':this.DiskStateIcon='sf-icon-th-large';
            },//切换文件显示模式
            /*网盘搜索*/
            SwitchSearch:function(){
                if(!this.ShowSearch){
                    this.ShowSearch=true;
                }else if(this.SearchKey&&this.ShowSearch){
                    this.$Message.info('开始搜索'+this.SearchKey);
                }else{
                    this.ShowSearch=false;
                }
                console.log(this.ShowSearch)
            },
            SearchDisk:function(){

            },
            //网盘排序方法(排序自段)
            DiskSort:function(type,key){
                if(this.DiskSortState[type]==='up'){
                    this.DiskData=this.ArraySort(this.DiskData, key, '<');
                    this.DiskSortState[type]='down';
                }else{
                    this.DiskData=this.ArraySort(this.DiskData, key, '>');
                    this.DiskSortState[type]='up';
                }
            },
            ArraySort:function(array,key,type){
                var temp,unfix;
                for (unfix = array.length - 1; unfix > 0; unfix--) {
                    for (var i = 0; i < unfix; i++) {
                        if (array[i][key] < array[i + 1][key] && type === '<') {
                            temp = array[i];
                            array.splice(i, 1, array[i + 1]);
                            array.splice(i + 1, 1, temp);
                        }
                        else if (array[i][key] > array[i + 1][key] && type !== '<') {
                            temp = array[i];
                            array.splice(i, 1, array[i + 1]);
                            array.splice(i + 1, 1, temp);
                        }
                    }
                }
                return array;
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