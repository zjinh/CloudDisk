<template>
    <div class="CloudDiskMain" v-on:keydown="keyBoard"  tabindex="1" ref="CloudDiskMain">
        <div class="CloudDiskHeaderDrag">
            <ul class="CloudDiskFuncMenu">
                <img draggable="false" src="../../../static/img/bar/disk.png"><span>CloudDisk</span>
                <li @click="changeType('disk')"><p> 网盘</p><div class="CloudDiskFuncLine" v-if="DiskType==='disk'"></div></li>
                <li @click="changeType('share')"><p> 分享</p><div class="CloudDiskFuncLine" v-if="DiskType==='share'"></div></li>
                <li @click="changeType('trans')"><p> 传输</p><div class="CloudDiskFuncLine" v-if="DiskType==='trans'"></div></li>
            </ul>
            <div class="CloudDiskHeaderControl">
                <span></span>
                <button type="button" class="sf-icon-chevron-down"></button>
                <button type="button" class="sf-icon-window-minimize" @click="mini"></button>
                <button type="button" :class="ButtonState" @click="restore"></button>
                <button type="button" class="sf-icon-times" style="font-size:16px" @click="close"></button>
            </div>
            <div class="CloudDiskUser">
                <span>{{Logined.username}}</span>
                <img draggable="false" :src="Logined.userhead">
            </div>
        </div>
        <div class="CloudDiskFuncMain">
            <div class="CloudDiskHead">
                <div class="CloudDiskHeadLeft">
                    <div class="CloudDiskNav">
                        <button class="sf-icon-chevron-left" @click="NavBack" :disabled="DiskData.NavData.length===0"> 后退</button>
                        <span class="CloudDiskNavLine">|</span>
                        <button @click="NavHomeLoad">{{ClassifyName}}</button>
                        <DiskNav v-bind:data="DiskData" v-on:SwitchNav="SwitchNav"></DiskNav>
                    </div>
                </div>
                <div class="CloudDiskHeadRight">
                    <input class="CDsearchInput" placeholder="搜索"
                           v-model="DiskSearch.SearchKey"
                           @keyup.enter.native="SearchDisk"
                           :style="DiskSearch.ShowSearch?{width:'170px',border:'1px solid #eee'}:''">
                    <button class="sf-icon-search" @click="SwitchSearch" v-show="DiskType!=='trans'" :disabled="DiskType==='share'"></button>
                    <button :class="'sf-icon-sort-amount-'+DiskSortState.amount" @click="DiskSort('amount','disk_name')" v-show="DiskType!=='trans'"></button>
                    <button :class="DiskStateIcon" @click="changeState" v-show="DiskType!=='trans'"></button>
                </div>
            </div>
            <div class="CloudDiskLeft">
                <ClassifyMenu v-bind:data="ClassifyData" v-on:updateClassify="updateClassify" v-show="DiskType==='disk'"></ClassifyMenu>
                <ClassifyMenu v-bind:data="ShareData" v-on:updateClassify="updateClassify" v-show="DiskType==='share'"></ClassifyMenu>
                <ClassifyMenu v-bind:data="TransData" v-on:updateClassify="updateClassify" v-show="DiskType==='trans'"></ClassifyMenu>
                <div class="CloudDiskSelectTips">{{DiskData.SelectTips}}</div>
                <div class="CloudDiskCapacity">
                    <div class="CloudDiskSliderContainer">
                        <div class="CloudDiskSlider" :style="{'width':DiskSize.Percent,background:DiskSize.Background}"></div>
                    </div>
                    <p>{{DiskSize.text}}</p>
                </div>
            </div>
            <div class="CloudDiskRight">
                <div class="CloudDiskMainFunc" v-show="ClassifyName==='回收站'">
                    <span class="sf-icon-info-circle TrashTips"> 回收站仍然占用网盘空间，文件保存10天后将被自动清除</span>
                    <button :disabled="ClassifyName==='回收站'&&UserDiskData.length===0" @click="DiskCleanTrash">清空回收站</button>
                </div>
                <div class="CloudDiskMainFunc" v-show="DiskData.DiskShowState!=='CloudDiskMFile'&&DiskType!=='trans'">
                    <div :class="'CloudDiskFuncBlock sf-icon-sort-alpha-'+DiskSortState.alpha" @click="DiskSort('alpha','disk_name')" ripple style="width:53%;">
                        文件名
                    </div>
                    <div :class="'CloudDiskFuncBlock sf-icon-sort-numeric-'+DiskSortState.mum" @click="DiskSort('mum','create_time')" ripple>
                        修改日期
                    </div>
                    <div :class="'CloudDiskFuncBlock sf-icon-sort-numeric-'+DiskSortState.mum1" @click="DiskSort('mum1','disk_size')" ripple style="width: 25%">
                        大小
                    </div>
                </div>
                <div  class="CloudDiskMain1" @scroll="LoadMore" @mousedown="MainMouseFunc" ref="CloudDiskMain">
                    <DiskFile v-on:SelectFiles="SelectFiles" v-on:OpenFile="OpenFile" v-if="LoadCompany&&DiskType!=='trans'" v-bind:data="UserDiskData" v-bind:DiskData="DiskData"></DiskFile>
                    <div class='CloudDiskLoading' v-show="!LoadCompany&&DiskType!=='trans'"><div class='sf-icon-hdd'><div class='CloudDiskLoading-beat'><div></div> <div></div> <div></div> </div></div>正在加载</div>
                    <div class='CloudDiskEmptyTips' v-if="LoadCompany&&DiskType!=='trans'" v-show="!UserDiskData.length>0"><span class='sf-icon-hdd'></span>这里什么都没有</div>
                    <div class="SlimfMouseSelect" v-show="MouseSelectData.width" :style="{'width':MouseSelectData.width,'height':MouseSelectData.height,'left':MouseSelectData.left,'top':MouseSelectData.top}"></div>
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
        <ul class="SlimfMouseMenu" v-show="DiskMouseState.DiskShareMenu.show" ref="DiskShareMenu">
            <li @click="OpenFile('')" :disabled="DiskData.SelectFiles.length>1" >打开</li>
            <li @click="DiskRename" :disabled="DiskData.SelectFiles.length>1">重命名</li>
            <li @click="DiskTrash">删除</li>
            <li @click="DiskShare" :disabled="DiskData.SelectFiles.length>1">查看分享</li>
            <li @click="CancelShare" :disabled="DiskData.SelectFiles.length>1">取消分享</li>
            <li @click="DiskInfo" :disabled="DiskData.SelectFiles.length>1">属性<span>Alt+Enter</span></li>
        </ul>
        <ul class="SlimfMouseMenu" v-show="DiskMouseState.DiskMainMenu.show" ref="DiskMainMenu">
            <li @click="UploadFile" :disabled="ClassifyName!=='全部文件'">上传文件<span>Ctrl+U</span></li>
            <li @click="CreateFolder" :disabled="ClassifyName!=='全部文件'">新建文件夹<span>Ctrl+N</span></li>
            <li @click="DiskData.Clipboard=[]" v-if="ClassifyName==='全部文件'" :disabled="DiskData.Clipboard.length===0">清空剪切板</li>
            <li @click="DiskPaste" v-if="ClassifyName==='全部文件'" :disabled="DiskData.Clipboard.length===0">粘贴<span>Ctrl+V</span></li>
            <li @click="DiskRefush">刷新<span>F5</span></li>
        </ul>
        <ul class="SlimfMouseMenu" v-show="DiskMouseState.DiskFileMenu.show" ref="DiskFileMenu" >
            <li @click="OpenFile('')" :disabled="DiskData.SelectFiles.length>1">打开<span>Ctrl+O</span></li>
            <li onclick="CloudDisk.MouseMenuFile.Download();">下载</li>
            <li @click="DiskMoveTo">移动到</li>
            <li @click="DiskCopy">复制<span>Ctrl+C</span></li>
            <li @click="DiskCut">剪切<span>Ctrl+X</span></li>
            <li @click="DiskRename" :disabled="DiskData.SelectFiles.length>1">重命名<span>Ctrl+M/F2</span></li>
            <li @click="DiskTrash">删除<span>Delete</span></li>
            <li @click="DiskShare" :disabled="DiskData.SelectFiles.length>1">分享</li>
            <li @click="DiskInfo" :disabled="DiskData.SelectFiles.length>1">属性<span>Alt+Enter</span></li>
        </ul>
        <ul class="SlimfMouseMenu" v-show="DiskMouseState.TrashFileMenu.show" ref="TrashFileMenu">
            <li @click="DiskRestore">还原<span>Ctrl+R</span></li>
            <li @click="DiskDelete">删除<span>Ctrl+Del</span></li>
            <li @click="DiskInfo" :disabled="DiskData.SelectFiles.length>1">属性<span>Alt+Enter</span></li>
        </ul>
        <el-dialog title="选择目标文件夹" :visible.sync="showTree" width="350px">
            <div style="height: 200px; overflow: auto">
                <DiskTree v-on:SelectDiskTree="SelectDiskTree" ref="DiskTree"></DiskTree>
            </div>
            <span slot="footer" class="dialog-footer">
                <button class="el-button el-button--default el-button--small" @click="showTree = false">取 消</button>
                <button class="el-button el-button--default el-button--small el-button--primary" @click="DiskMoveUp">确 定</button>
            </span>
        </el-dialog>
        <el-dialog title="分享方式" :visible.sync="showShare" width="350px" top="150px">
            <div style="height: 150px;">
                <p class="CloudDiskShareTips">准备分享<span>{{DiskData.NowSelect.disk_name}}</span></p>
                <DiskShare ref="DiskShareModel" v-on:close="showShare=false"></DiskShare>
            </div>
            <span slot="footer" class="dialog-footer">
                <button class="el-button el-button--default el-button--small" @click="showShare = false">取 消</button>
                <button class="el-button el-button--default el-button--small el-button--primary" @click="Share">确 定</button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Api from '../api/api';
    import ClassifyMenu from './DiskWindow/ClassifyMenu';
    import DiskFile from './DiskWindow/DiskFile';
    import DiskNav from './DiskWindow/DiskNav';
    import DiskTree from './DiskWindow/DiskTree';
    import DiskShare from './DiskWindow/DiskShare';
    import electron from 'electron';
    const path = require('path');
    let DiskWindow=electron.remote.getCurrentWindow();
    let ipc=require('electron').ipcRenderer;
    export default {
        name: "DiskWindow",
        components:{ClassifyMenu,DiskFile,DiskNav,DiskTree,DiskShare},
        data(){
            return{
                Logined:{},
                UserDiskData:[],//存放用户网盘数据
                LoadCompany:false,//是否加载完成
                ButtonState:"sf-icon-window-maximize",//右上角窗口按钮状态
                ClassifyName:'全部文件',//地址栏左侧分类显示文本
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
                ],//传输分类参数
                /*网盘大小*/
                DiskSize:{
                    total:0,
                    use:0,
                    Percent:'0%',
                    Background:'#2682fc',
                    text:'0B/0B',
                },
                /*网盘一些记录的参数*/
                DiskPage:1,//网盘加载的页数
                DiskPosting:false,
                NowDiskID:null,
                DiskAllCount:0,
                DiskLoadCount:0,
                loadClassify:'normal',//网盘加载的分类
                DiskSearch:{
                    ShowSearch:false,//搜索框打开关闭
                    SearchKey:'',//搜索关键词
                },//搜索参数
                DiskData:{
                    ClipboardState:false,//剪切板是复制还是剪切
                    Clipboard: [],//剪切板的文件
                    SelectFiles:[],//选择的文件
                    NavData:[],//记录导航栏数据
                    KeyFlag: false,//全局键盘记录
                    NowSelect:false,//记录一个选择的文件
                    DiskShowState:'CloudDiskMFile',//文件显示类型，默认图标,
                    SelectTips:'共0个文件/文件夹',//选择文件提示
                },
                /*树目录参数*/
                showTree:false,
                SelectTrees:false,
                /*分享窗口参数*/
                showShare:false,
                /*排序参数*/
                DiskSortState:{
                    amount:'up',
                    mum:'up',
                    mum1:'up',
                    alpha:'up',
                },
                /*拖拽选择参数*/
                MouseSelectData:{
                    left:0,
                    top:0,
                    width:0,
                    height:0
                },
                /*右键菜单状态*/
                DiskMouseState:{
                    DiskMainMenu:{
                        show:false,
                        top:0,
                        left:0
                    },
                    DiskFileMenu:{
                        show:false,
                        top:0,
                        left:0
                    },
                    TrashFileMenu:{
                        show:false,
                        top:0,
                        left:0
                    },
                    DiskShareMenu:{
                        show:false,
                        top:0,
                        left:0
                    }
                },
            }
        },
        watch:{
            UserDiskData: {
                handler(newValue, oldValue) {
                    this.DiskSearch.ShowSearch=false;
                    this.DiskData.SelectFiles=[];
                    this.UserDiskData.forEach((item,index)=>{
                        if (item.active){
                            item.index=index;
                            this.DiskData.SelectFiles.push(item);
                        }
                    });
                    if(this.DiskData.SelectFiles.length){
                        this.DiskData.SelectTips='已选择'+this.DiskData.SelectFiles.length+'个文件/文件夹'
                    }else{
                        this.DiskData.SelectTips='共'+this.UserDiskData.length+'个文件/文件夹'
                    }
                    for(let item in this.DiskMouseState){
                        this.DiskMouseState[item].show = false
                    }
                },
                deep: true
            },
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
                document.onclick=document.onmousewheel=()=>{
                    for(let item in this.DiskMouseState){
                        this.DiskMouseState[item].show = false
                    }
                };
            },
            keyBoard:function(e){
                e.stopPropagation();
                e.preventDefault();
                if((e.ctrlKey)&&(e.keyCode===67)){//复制快捷键
                    if(this.loadClassify!=='trash'&&this.DiskType==='disk'){
                        this.DiskCopy();
                    }
                }else if((e.ctrlKey)&&(e.keyCode===88)){//剪切快捷键
                    if(this.loadClassify!=='trash'&&this.DiskType==='disk'){
                        this.DiskCut();
                    }
                }else if((e.ctrlKey)&&(e.keyCode===86)){//粘贴快捷键
                    if(this.loadClassify!=='trash'&&this.DiskType==='disk'){
                        this.DiskPaste();
                    }
                }else if((e.ctrlKey)&&(e.keyCode===85)){//上传快捷键
                    if(this.loadClassify!=='trash'&&this.DiskType==='disk'){
                        this.UploadFile();
                    }
                }else if((e.ctrlKey)&&(e.keyCode===82)){//恢复快捷键
                    if(this.loadClassify==='trash'&&this.DiskType==='disk'){
                        this.DiskRestore();
                    }
                }else if((!e.ctrlKey)&&(e.keyCode===46)){//删除快捷键
                    if(this.loadClassify!=='trash'&&this.DiskType==='disk'){
                        this.DiskTrash();
                    }
                }else if((e.ctrlKey)&&(e.keyCode===46)){//彻底删除快捷键
                    if(this.loadClassify==='trash'&&this.DiskType==='disk'){
                        this.DiskDelete();
                    }
                }else if((e.ctrlKey)&&(e.keyCode===79)){//打开快捷键
                    if(this.loadClassify!=='trash'&&this.DiskType==='disk'){
                        this.OpenFile('');
                    }
                }else if((e.ctrlKey)&&(e.keyCode===77)||(e.keyCode===113)){//重名名快捷键
                    if(this.loadClassify!=='trash'&&this.DiskType==='disk'){
                        this.DiskRename();
                    }
                }else if (e.ctrlKey) {
                    this.DiskData.KeyFlag = 'Ctrl';
                } else if (e.shiftKey) {
                    this.DiskData.KeyFlag = 'Shift';
                }
                document.onkeyup = ()=> {
                    this.DiskData.KeyFlag = false;
                };
            },//键盘事件
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
            },//获取用户信息
            GetMainFile:function(id,type){
                if(this.DiskPage===1){
                    this.UserDiskData=[];//清空数据
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
                    this.PrintFile(rs);
                })
            },//获取用户文件
            InsertFileData:function(item){
                item.active=false;//设置未选择
                item.size=this.FileSize(item.disk_size);//计算文件大小
                item.type=this.StringBefore(item.disk_realname, ".");
                item.icon =this.IconGet(item);//区别文件类型设置图表
                this.UserDiskData.push(item);
            },
            PrintFile:function(rs){
                if (this.DiskPage === 1) {
                    this.DiskAllCount=0;
                    this.DiskLoadCount=0;
                }
                this.LoadCompany=true;
                rs.forEach((item)=> {
                    this.InsertFileData(item);
                });
                if(rs.length){
                    this.DiskSize.total=rs[0].max_size;
                    this.DiskSize.use=rs[0].use_size;
                    let Percent=(this.DiskSize.use/this.DiskSize.total)*100;
                    this.DiskSize.Percent=Percent+'%';
                    this.DiskSize.text=this.FileSize(this.DiskSize.use)+'/'+this.FileSize(this.DiskSize.total)
                    if (65 < Percent && Percent < 85) {
                        this.DiskSize.Background = '#f7ab21';
                    } else if (Percent >= 85) {
                        this.DiskSize.Background = '#e83c3c';
                    }else{
                        this.DiskSize.Background = '#2682fc';
                    }
                    this.DiskAllCount=rs[0].all_count;
                    this.DiskLoadCount=this.DiskLoadCount+rs.length;
                }
            },
            updateClassify:function(value){//更新网盘分类子组件传回的数据
                this.ClassifyName=value.name;
                this.loadClassify=value.data;
                this.DiskPage = 1;
                this.GetMainFile(null,this.loadClassify);
                this.DiskData.NavData=[];
            },
            LoadMore:function(){
                let elm=event.target;
                if (elm.scrollTop+ elm.offsetHeight >= elm.scrollHeight-32 && this.DiskLoadCount< this.DiskAllCount) {
                    if (this.LoadCompany) {
                        this.DiskPage++;
                        this.GetMainFile(this.NowDiskID, this.loadClassify);
                    }
                }
            },//下拉加载更多
            changeType:function(type){
                this.UserDiskData=[];//清空数据
                this.DiskData.NavData=[];
                this.DiskType=type;
                if(type==='disk') {
                    this.ClassifyData.forEach(function (item) {
                        item.active='';
                    });
                    this.ClassifyName=this.ClassifyData[0].name;
                    this.loadClassify=this.ClassifyData[0].data;
                    this.ClassifyData[0].active='CloudDiskClassifyActive';
                    this.GetMainFile(null,this.ClassifyData[0].data);
                }else if(type==='share'){
                    this.ShareData.forEach(function (item) {
                        item.active='';
                    });
                    this.ClassifyName=this.ShareData[0].name;
                    this.loadClassify=this.ShareData[0].data;
                    this.ShareData[0].active='CloudDiskClassifyActive';
                    this.GetMainFile(null,type);
                }else{

                }
            },//切换网盘分享、传输等
            /*网盘搜索*/
            SwitchSearch:function(){//搜索有问题
                if(this.DiskSearch.ShowSearch===false){
                    this.DiskSearch.ShowSearch=true;
                }else if(this.DiskSearch.SearchKey.length&&this.DiskSearch.ShowSearch){
                    this.DiskPage=1;
                    this.UserDiskData=[];
                    this.ClassifyData.forEach((item)=>{
                       item.active='';
                    });
                    this.ClassifyName='搜索结果';
                    this.SearchDisk();
                    this.DiskData.NavData=[];
                }else{
                    this.DiskSearch.ShowSearch=false;
                }
            },
            SearchDisk:function(){
                Api.Disk.Search({
                    id:this.DiskSearch.SearchKey,
                    page: this.DiskPage,
                },(rs)=>{
                    this.PrintFile(rs);
                });
            },
            //切换文件显示模式
            changeState:function(){
                this.DiskData.DiskShowState==='CloudDiskMFile'?this.DiskData.DiskShowState='CloudDiskMList':this.DiskData.DiskShowState='CloudDiskMFile';
                this.DiskStateIcon==='sf-icon-th-large'?this.DiskStateIcon='sf-icon-list-ul':this.DiskStateIcon='sf-icon-th-large';
            },
            //网盘排序方法(排序自段)
            DiskSort:function(type,key){
                if(this.DiskSortState[type]==='up'){
                    this.UserDiskData=this.ArraySort(this.UserDiskData, key, '<');
                    this.DiskSortState[type]='down';
                }else{
                    this.UserDiskData=this.ArraySort(this.UserDiskData, key, '>');
                    this.DiskSortState[type]='up';
                }
            },
            /*选择文件数据操作方法*/
            SelectFiles:function(event,item,index){
                this.$refs.CloudDiskMain.focus();
                event.stopPropagation();
                event.preventDefault();
                if(event.button===0){
                    if(this.DiskData.KeyFlag==='Ctrl'){//Ctrl多选
                        if(item.active){
                            item.active=false;
                        }else{
                            item.active=true;
                        }
                    }else if(this.DiskData.KeyFlag==='Shift'){//Shift多选
                        let Start = index,End;
                        item.active=true;
                        if(this.DiskData.NowSelect) {
                            for (let i = 0; i < this.UserDiskData.length; i++) {
                                if (this.UserDiskData[i] ===  this.DiskData.NowSelect) {
                                    Start = i;
                                }
                                if (this.UserDiskData[i] === item) {
                                    End = i;
                                }
                            }
                        }
                        for (let j =  Math.min(End,Start); j < Math.max(End,Start) +1 ; j++) {
                            this.UserDiskData[j].active=true;
                        }
                    }else if(!this.DiskData.KeyFlag){//单选
                        this.ClearSelect();
                        item.active=true;
                        this.DiskData.NowIndex=index;//记录当前是第几个
                        this.DiskData.NowSelect=item;
                    }
                }else if(event.button===2){
                    this.DiskData.NowIndex=index;
                    this.DiskData.NowSelect=item;
                    if (this.loadClassify !== 'trash') {
                        this.MouseMenu('DiskFileMenu', event);
                    } else {
                        this.MouseMenu('TrashFileMenu', event);
                    }
                    if (this.loadClassify=== 'share') {
                        this.MouseMenu('DiskShareMenu', event);
                    }
                }
            },
            RemoveSelect:function(index){
                this.DiskData.SelectFiles.splice(index,1)
            },
            ClearSelect:function(){
                this.UserDiskData.forEach((item)=>{
                    item.active=false;
                });
                this.DiskData.SelectFiles=[];
            },
            /*导航栏函数*/
            SwitchNav:function(item){
                for (let i = this.DiskData.NavData.length - 1; i > 0; i--) {
                    if (item ===  this.DiskData.NavData[i]) {
                        break;
                    }
                    this.DiskData.NavData.splice(i,1);
                }
                this.GetMainFile(item.disk_id, 'normal');
            },///导航栏点击切换
            NavHomeLoad:function(){
               if(this.DiskType==='share'){
                    this.changeType('share');
                    this.DiskData.NavData=[];
                }else if(this.DiskType!=='trans'&&this.ClassifyName!=='搜索结果') {
                   this.GetMainFile(null, this.loadClassify);
                   this.DiskData.NavData=[];
               }else if(this.ClassifyName==='搜索结果'){
                    this.changeType('disk');
                    this.DiskData.NavData=[];
                }
            },//导航栏首页点击加载
            NavBack:function(){
                if(this.DiskData.NavData.length>1) {
                    this.SwitchNav(this.DiskData.NavData[this.DiskData.NavData.length - 2])
                }else{
                    this.NavHomeLoad();
                }
            },//导航栏后退
            /*打开文件夹/文件*/
            OpenFile:function(item){
                if(this.DiskData.SelectFiles.length>1){
                    return false;
                }
                if(!item){
                    item=this.DiskData.NowSelect;
                }
                if(!item.disk_main){
                    this.DiskData.NavData.push(item);
                    this.ClearSelect();
                    this.GetMainFile(item.disk_id, 'normal');
                }else{
                    this.$Message.info('无法打开文件')
                }
            },
            /*右键菜单函数*/
            UploadFile:function(){
                if(this.loadClassify==='normal') {
                    this.$Message.info('正在开发')
                }
            },//上传文件
            CreateFolder:function(){
                if(this.ClassifyName==='全部文件') {
                    this.InputConfrim({
                        title: "新建文件夹",
                        tips: '请输入文件夹名称',
                        callback: (value) => {
                            Api.Disk.NewFolder({
                                name: value,
                                parent_id: this.NowDiskID,
                            }, (rs) => {
                                rs = rs[0];
                                if (rs.disk_id) {
                                    this.InsertFileData(rs);
                                    this.$Message.success(value + ' 已创建')
                                } else {
                                    this.$Message.error(value + ' 已存在');
                                }
                            });
                        }
                    })
                }
            },//右键新建文件夹
            DiskPaste:function(){
                if(this.DiskData.Clipboard.length&&this.ClassifyName==='全部文件'){
                    let data=this.MakeSelectData(this.DiskData.Clipboard);
                    if(this.DiskData.ClipboardState==='copy'){
                        let size=0;
                        this.DiskData.Clipboard.forEach((item)=>{
                            size=size+parseInt(item.disk_size);
                        });
                        if(size>(this.DiskSize.total-this.DiskSize.use)){
                            this.$Message.error('空间不足！请清理一些文件后重试');
                            return false;
                        }
                        this.$Message.info('正在粘贴文件，请稍候');
                        Api.Disk.Copy({
                            id:data,
                            parent_id:this.NowDiskID
                        },(rs)=>{
                            rs=rs[0];
                            if(rs.state==='success'){
                                let copy_flag=false;//判断是否有复制和粘贴时同一个目录的
                                this.DiskData.Clipboard.forEach((item)=>{
                                    if(item.parent_id===this.NowDiskID){
                                        copy_flag=true;
                                    }
                                });
                                if(copy_flag){
                                    this.DiskRefush();
                                }else{
                                    this.DiskData.Clipboard.forEach((item)=>{
                                        item.disk_name=item.disk_name+'-复制';
                                        this.InsertFileData(item)
                                    });
                                }
                                this.$Message.success('复制成功，共'+this.DiskData.Clipboard.length+'个文件/文件夹');
                                this.DiskData.Clipboard=[];
                            }else{
                                this.$Message.error('复制失败')
                            }
                        })
                    }else if(this.DiskData.ClipboardState==='cut'){
                        let flag=true;
                        if(this.DiskData.Clipboard[0].parent_id===this.NowDiskID){
                            this.$Message.info('剪切和粘贴目录为同一个，已清空剪贴板');
                            this.DiskData.Clipboard=[];
                            return false;
                        }
                        this.DiskData.Clipboard.forEach((item)=>{
                            if(this.NowDiskID===item.disk_id){
                                this.DiskData.Clipboard=[];
                                flag=false;
                            }
                        });
                        if(flag===false){
                            this.$Message.warning('剪贴板内包含粘贴目标，请重新选择');
                            return false;
                        }
                        this.$Message.info('正在粘贴文件，请稍候');
                        Api.Disk.Cut({
                            id:data,
                            parent_id:this.NowDiskID
                        },(rs)=>{
                            rs=rs[0];
                            if(rs.state==='success'){
                                this.DiskData.Clipboard.forEach((item)=>{
                                    this.InsertFileData(item)
                                });
                                this.$Message.success('剪贴成功，共'+this.DiskData.Clipboard.length+'个文件/文件夹');
                                this.DiskData.Clipboard=[];
                            }else{
                                this.$Message.error('剪贴失败')
                            }
                        })
                    }
                }
            },//右键粘贴
            DiskMoveTo:function(){
                this.showTree=true;
                this.$nextTick(()=>{
                    this.$refs.DiskTree.init();
                });
            },
            DiskCopy:function(){
                this.DiskData.Clipboard=[];
                this.DiskData.ClipboardState='copy';
                if(this.DiskData.SelectFiles.length){
                    this.DiskData.Clipboard=this.DiskData.SelectFiles;
                    if(this.DiskData.SelectFiles.length===1){
                        this.$Message.info(this.DiskData.SelectFiles[0].disk_name+' 已复制到剪贴板');
                    }else {
                        this.$Message.info('所选' + this.DiskData.Clipboard.length + '个文件/文件夹已复制到剪贴板');
                    }
                }else{
                    this.DiskData.Clipboard.push(this.DiskData.NowSelect);
                    this.$Message.info(this.DiskData.NowSelect.disk_name+' 已复制到剪贴板');
                }
            },//复制
            DiskCut:function(){
                this.DiskData.Clipboard=[];
                this.DiskData.ClipboardState='cut';
                if(this.DiskData.SelectFiles.length){
                    this.DiskData.Clipboard=this.DiskData.SelectFiles;
                    if(this.DiskData.SelectFiles.length===1){
                        this.$Message.info(this.DiskData.SelectFiles[0].disk_name+' 已剪切到剪贴板');
                    }else {
                        this.$Message.info('所选' + this.DiskData.Clipboard.length + '个文件/文件夹剪切到剪贴板');
                    }
                }else{
                    this.DiskData.Clipboard.push(this.DiskData.NowSelect);
                    this.$Message.info(this.DiskData.NowSelect.disk_name+' 已剪切到剪贴板');
                }
            },//剪切
            DiskRename:function(){
                if(this.DiskData.SelectFiles.length<2){
                    this.InputConfrim({
                        title:"重命名",
                        tips:'请输入新的文件/文件夹名称',
                        value:this.DiskData.NowSelect.disk_name,
                        callback:(value)=>{
                            Api.Disk.Rename({
                                name:value,
                                id:this.DiskData.NowSelect.disk_id
                            },(rs)=>{
                                rs=rs[0];
                                if(rs.state==='success'){
                                    this.UserDiskData[this.DiskData.NowIndex].disk_name=value;
                                    this.$Message.success('已重命名');
                                }else{
                                    this.$Message.error('重命名失败');
                                }
                            });
                        }
                    })
                }
            },//重命名
            DiskTrash:function(){
                let delete_data=[];
                let tips='';
                if(this.DiskData.SelectFiles.length){
                    delete_data=this.DiskData.SelectFiles;
                    if(this.DiskData.SelectFiles.length===1){
                        tips=delete_data[0].disk_name+'移入回收站';
                    }else {
                        tips =this.DiskData.SelectFiles[0].disk_name + ' 等' + this.DiskData.SelectFiles.length + '个文件/文件夹移入回收站';
                    }
                }else{
                    delete_data.push(this.DiskData.NowSelect);
                    tips=delete_data[0].disk_name+'移入回收站';
                }
                let data=this.MakeSelectData(delete_data);
                this.Confrim({
                    title:'移入回收站',
                    tips:'是否将 '+tips,
                    callback:()=> {
                        Api.Disk.Trash({
                            id:data
                        },(rs)=>{
                            rs=rs[0];
                            if(rs.state==='success'){
                                this.$Message.success('成功将 '+tips);
                                this.RemoveSelectData(delete_data)
                            }else{
                                this.$Message.success('删除失败');
                            }
                        })
                    }
                });
            },//删除(回收站)
            DiskRefush:function(){
                this.DiskPage=1;
                this.GetMainFile(this.NowDiskID, this.loadClassify);
            },//右键刷新
            DiskCleanTrash:function(){
                this.Confrim({
                    title:'清空回收站',
                    tips:'该操作将清空回收站且不可恢复,是否继续',
                    callback:()=> {
                        Api.Disk.Delete({
                            id: ''
                        },(rs)=>{
                            rs=rs[0];
                            if(rs.state==='success'){
                                this.$Message.success('回收站已清空');
                                if(this.loadClassify==='trash') {
                                    this.UserDiskData = [];
                                }
                            }else{
                                this.$Message.error('回收站清空失败');
                            }
                        })
                    }
                });
            },//清空回收站
            DiskDelete:function(){
                let delete_data=[];
                let tips='';
                if(this.DiskData.SelectFiles.length){
                    delete_data=this.DiskData.SelectFiles;
                    if(this.DiskData.SelectFiles.length===1){
                        tips=delete_data[0].disk_name+'删除';
                    }else {
                        tips =this.DiskData.SelectFiles[0].disk_name + ' 等' + this.DiskData.SelectFiles.length + '个文件/文件夹删除';
                    }
                }else{
                    delete_data.push(this.DiskData.NowSelect);
                    tips=delete_data[0].disk_name+'删除';
                }
                let data=this.MakeSelectData(delete_data);
                this.Confrim({
                    title:'删除',
                    tips:'是否将 '+tips,
                    callback:()=> {
                        Api.Disk.Delete({
                            id:data
                        },(rs)=>{
                            rs=rs[0];
                            if(rs.state==='success'){
                                this.$Message.success('成功将 '+tips);
                                this.RemoveSelectData(delete_data);
                            }else{
                                this.$Message.success('删除失败');
                            }
                        })
                    }
                });
            },//彻底删除
            DiskRestore:function(){
                let Restore_data=[];
                let tips='';
                if(this.DiskData.SelectFiles.length){
                    Restore_data=this.DiskData.SelectFiles;
                    if(this.DiskData.SelectFiles.length===1){
                        tips=Restore_data[0].disk_name+'移出回收站';
                    }else {
                        tips =this.DiskData.SelectFiles[0].disk_name + ' 等' + this.DiskData.SelectFiles.length + '个文件/文件夹移出回收站';
                    }
                }else{
                    Restore_data.push(this.DiskData.NowSelect);
                    tips=Restore_data[0].disk_name+'移出回收站';
                }
                let data=this.MakeSelectData(Restore_data);
                this.Confrim({
                    title:'还原文件',
                    tips:'是否将 '+tips,
                    callback:()=> {
                        Api.Disk.Restore({
                            id: data
                        }, (rs) => {
                            rs = rs[0];
                            if (rs.state === 'success') {
                                this.$Message.success('成功将 '+tips);
                                this.RemoveSelectData(Restore_data);
                            } else {
                                this.$Message.success('还原失败');
                            }
                        })
                    }
                })
            },//文件还原
            Share:function(){
                this.$refs.DiskShareModel.ShareFile(this.DiskData.NowSelect)
            },
            DiskShare:function(){
                if(this.DiskData.SelectFiles.length<2) {
                    if (this.DiskData.NowSelect.share) {
                        let message = '该文件分享地址为:' + localStorage.server + '/s/' + this.DiskData.NowSelect.share;
                        this.Confrim({
                            title: '分享信息',
                            tips: message,
                            type:'info',
                            callback: () => {}
                        })
                    } else {
                        this.$nextTick(() => {
                            this.$refs.DiskShareModel.init();
                        });
                        this.showShare = true;
                    }
                }
            },
            CancelShare:function(){
                if(this.DiskData.SelectFiles.length<2) {
                    this.Confrim({
                        title: '取消分享',
                        tips: '您确认取消分享'+this.DiskData.NowSelect.disk_name+'吗',
                        callback: () => {
                            Api.Disk.CancelShare({
                                id: this.DiskData.NowSelect.disk_id,
                                share_id: this.DiskData.NowSelect.share
                            },(rs)=>{
                                if (rs[0].state==='success') {
                                    this.$Message.success('分享已取消');
                                    this.$nextTick(()=>{
                                        if(this.loadClassify==='share'){
                                            let data=[];
                                            data.push(this.DiskData.NowSelect);
                                            this.RemoveSelectData(data);
                                        }else{
                                            this.FindInDisk(this.DiskData.NowSelect,(item)=>{
                                                item.share='';
                                            });
                                        }
                                    });
                                } else {
                                    this.$Message.error('操作失败');
                                }
                            })
                        }
                    })
                }
            },
            DiskInfo:function(){
                if(this.DiskData.SelectFiles.length<2) {
                    ipc.send('DiskInfo',this.DiskData.NowSelect);
                }
            },//文件属性
            /*树目录操作方法*/
            DiskMoveUp:function(){
                if(this.DiskData.SelectFiles.length) {
                    this.DiskData.SelectFiles.forEach((item, index) => {
                        if (this.SelectTrees.disk_id === item.disk_id) {
                            this.DiskData.SelectFiles.splice(index, 1);
                        }
                    });
                    let data=this.MakeSelectData(this.DiskData.SelectFiles);
                    if(this.DiskData.SelectFiles[0].parent_id===this.SelectTrees.disk_id){
                        this.$Message.warning('操作取消,所选 '+this.SelectTrees.disk_name+' 为当前所在目录');
                        this.showTree=false;
                        this.SelectTrees=false;
                        return
                    }
                    Api.Disk.Cut({
                        parent_id: this.SelectTrees.disk_id,
                        id: data
                    },(rs)=>{
                        rs=rs[0];
                        if(rs.state==='success'){
                            this.RemoveSelectData(this.DiskData.SelectFiles);
                            this.$Message.success('已移动到 '+this.SelectTrees.disk_name);
                            this.showTree=false;
                            this.SelectTrees=false;
                        }else{
                            this.$Message.error('移动失败')
                        }
                    })
                }else {
                    this.$Message.warning('操作终止！没有选中任何文件')
                }
            },
            SelectDiskTree:function(item){
                this.SelectTrees=item;
            },//选择树目录
            /*通用方法*/
            MakeSelectData :function (orgin_data) {
                let data = '';
                for (let j = 0; j < orgin_data.length; j++) {
                    data = data + orgin_data[j].disk_id + ',';
                }
                return data.substring(0, data.length - 1);
            },//处理被选中文件的数据收集
            RemoveSelectData:function(data){
                for (let i = 0; i < this.UserDiskData.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        if (data[j].disk_id === this.UserDiskData[i].disk_id) {
                            this.UserDiskData.splice(i, 1);
                        }
                    }
                }
            },
            MainMouseFunc:function(){
                //this.ClearSelect();
                this.MouseMenu('DiskMainMenu',event);
                this.MouseSelect(event);
            },
            MouseMenu:function(menu_main,e){
                e.preventDefault();
                e.stopPropagation();
                this.MouseSelectData={
                    left:0,
                    top:0,
                    width:0,
                    height:0
                };
                for(let item in this.DiskMouseState){
                    this.DiskMouseState[item].show = false
                }
                let menu=this.$refs[menu_main];
                let createNode=this.$refs['CloudDiskMain'];
                menu.style.left = e.pageX + -parseFloat(createNode.getBoundingClientRect().left)+createNode.offsetLeft+ 'px';
                menu.style.top = e.pageY + -parseFloat(createNode.getBoundingClientRect().top)+createNode.offsetTop+ 'px';
                if((menu.getBoundingClientRect().left+menu.offsetHeight)-createNode.getBoundingClientRect().left>createNode.offsetWidth){
                    menu.style.left=menu.style.left.split('px')[0]-menu.offsetWidth+'px';
                }
                if((menu.getBoundingClientRect().top+menu.offsetHeight)-createNode.getBoundingClientRect().top>createNode.offsetHeight){
                    menu.style.top=menu.style.top.split('px')[0]-menu.offsetHeight+'px';
                }
                createNode.onmouseup=()=> {
                    if (e.button === 2) {
                        this.DiskMouseState[menu_main].show = true;
                        createNode.onmousedown=null;
                        createNode.onmouseup=null;
                    }
                };
            },
            MouseSelect:function(event){
                event.preventDefault();
                event.stopPropagation();
                let area=event.target;
                let start={
                    x:event.clientX-area.getBoundingClientRect().left+area.scrollLeft,
                    y:event.clientY-area.getBoundingClientRect().top+area.scrollTop,
                    maxy:area.scrollHeight
                };
                this.MouseSelectData.left=start.x;
                this.MouseSelectData.top=start.y;
                document.onmouseup=()=> {
                    this.MouseSelectData = {
                        left: 0,
                        top: 0,
                        width: 0,
                        height: 0
                    };
                    document.onmousemove = null;
                };
                document.onmousemove=(ev)=> {
                    let end = {
                        x: ev.clientX - area.getBoundingClientRect().left + area.scrollLeft,
                        y: ev.clientY - area.getBoundingClientRect().top + area.scrollTop,
                        scrolldown: Math.min(ev.clientY - area.getBoundingClientRect().top, event.clientY - area.getBoundingClientRect().top) + 10 + area.offsetHeight,
                        scrollup: Math.min(ev.clientY - area.getBoundingClientRect().top, event.clientY - area.getBoundingClientRect().top)
                    };
                    this.MouseSelectData = {
                        left: Math.min(start.x, end.x) + "px",
                        top: this.DiskData.DiskShowState === 'CloudDiskMList' ? Math.min(start.y, end.y) - 35 + "px" : Math.min(start.y, end.y) + "px",
                        width: Math.abs(end.x - start.x) + "px",
                        height: Math.abs(end.y - start.y) + "px"
                    };
                    let area_data = {
                        left: Math.min(start.x, end.x),
                        top: this.DiskData.DiskShowState === 'CloudDiskMList' ? Math.min(start.y, end.y) - 35 : Math.min(start.y, end.y),
                        width: Math.abs(end.x - start.x),
                        height: Math.abs(end.y - start.y)
                    };
                    let selList = document.getElementsByClassName(this.DiskData.DiskShowState);
                    this.ClearSelect();
                    for (let i = 0; i < selList.length; i++) {
                        let sl = selList[i].offsetWidth + selList[i].offsetLeft,
                            st = selList[i].offsetHeight + selList[i].offsetTop;
                        let area_l = area_data.left + area_data.width;
                        let area_t = area_data.top + area_data.height;
                        if (sl > area_data.left && st > area_data.top && selList[i].offsetLeft < area_l && selList[i].offsetTop < area_t) {
                            if (this.UserDiskData[i].active === false) {
                                this.UserDiskData[i].active = true;
                            }
                        } else {
                            if (this.UserDiskData[i].active) {
                                this.UserDiskData[i].active = false;
                            }
                        }
                    }
                };
            },
            Confrim:function(options){
                this.$confirm(options.tips, options.title, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString:true,
                    type: options.type||'warning',
                }).then(() => {
                    options.callback()
                }).catch(() => {
                });
            },
            FindInDisk:function(list,callback){
                let result=null;
                this.UserDiskData.forEach((item)=>{
                    if(item.disk_id===list.disk_id){
                        result=item;
                        callback(item);
                    }
                });
                return result;
            },
            InputConfrim:function(options){
                this.$prompt(options.tips, options.title, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:options.value||'',
                }).then(({ value }) => {
                    options.callback(value)
                }).catch(() => {
                });
            },
            FileSize:function (bytes) {
                bytes=parseFloat(bytes);
                if (bytes === 0) return '0B';
                let k = 1024,
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
            },
            IconGet:function (item) {
                let prefix=path.join(__static, '/img/disk/');
                let type = item.type;
                if(!item.disk_main){
                    return prefix+'FolderType.png'
                }
                if (this.StringExist(type, '7z,zip,rar,tar.gz')) {
                    return prefix+'RarType.png';
                }
                else if (this.StringExist(type, 'apng,png,jpg,jpeg,bmp,gif,APNG,PNG,JPG,JPEG,BMP,GIF')) {
                    return prefix+'ImageType.png';
                }
                else if (this.StringExist(type, 'mp4,rmvb,mkv,MP4,RMVB,MKV')) {
                    return prefix+'VideoType.png';
                }
                else if (this.StringExist(type, 'm4a,mp3,ogg,flac,f4a,wav,ape,M4A,MP3,OGG,FLAC,F4A,WAV,APE')) {
                    return prefix+'MusicType.png';
                }
                else if (this.StringExist(type, 'doc,docx,DOC,DOCX')) {
                    return prefix+'DocType.png';
                }
                else if (this.StringExist(type, 'ppt,pptx,PPT,PPTX')) {
                    return prefix+'PptType.png';
                }
                else if (this.StringExist(type, 'xls,xlsx,XLS,XLSX')) {
                    return prefix+'ExcelType.png';
                }
                else if (this.StringExist(type, 'pdf,PDF')) {
                    return prefix+'PdfType.png';
                }
                else if (this.StringExist(type, 'ini,txt,md,INI,TXT,MD')) {
                    return prefix+'TxtType.png';
                }
                else if (this.StringExist(type, 'xml,aspx,php,phtml,.htaccesscss,js,c,XML,ASPX,PHP,PHTML,.HTACCESSCSS,JS,C')) {
                    return prefix+'CodeType.png';
                }
                else if (this.StringExist(type, 'htm,html,HTM,HTML')) {
                    return prefix+'WebType.png';
                }
                else if (this.StringExist(type, 'log,LOG')) {
                    return prefix+'OtherType.png';
                }
                else if (this.StringExist(type, 'exe,msi,EXE,MSI')) {
                    return prefix+'ExeType.png';
                }
                else if (this.StringExist(type, 'torrent,TORRENT')) {
                    return prefix+'BtType.png';
                }
                else if (this.StringExist(type, 'vcf,VCF')) {
                    return prefix+'VcfType.png';
                }
                else {
                    return prefix+'OtherType.png';
                }
            },
            StringExist:function (str, substr) {
                if(typeof str !== "string"){ return; }
                if(substr==='|*|'){return true}
                for(let i=0;i<substr.split(',').length;i++){
                    if(str.indexOf(substr.split(',')[i]) >= 0 === true ){ return true; }
                }
                return false;
            },
            StringBefore:function (str,substr) {
                return str.substring(str.lastIndexOf(substr) + 1, str.length);
            },
            ArraySort:function(array,key,type){
                let temp,unfix;
                for (unfix = array.length - 1; unfix > 0; unfix--) {
                    for (let i = 0; i < unfix; i++) {
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
                DiskWindow.minimize();
            },
            close:function () {
                DiskWindow.hide();
            },
            restore:function () {
                if (DiskWindow.isMaximized()) {
                    DiskWindow.restore();
                } else {
                    DiskWindow.maximize();
                }
            }
        }
    }
</script>

<style scoped>
    @import url("../../../static/css/Slimf.css");
    @import url("../../../static/css/disk.css");
</style>