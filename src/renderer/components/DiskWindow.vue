<template>
    <div class="CloudDiskMain"
         @keydown.stop.ctrl.67="isDisk?DiskCopy():''"
         @keydown.stop.ctrl.88="isDisk? DiskCut():''"
         @keydown.stop.ctrl.86="isDisk? DiskPaste():''"
         @keydown.stop.ctrl.85="isDisk? UploadFile():''"
         @keydown.stop.ctrl.82="isTrash? DiskRestore():''"
         @keydown.stop.!ctrl.46="isDisk? DiskTrash():''"
         @keydown.stop.ctrl.46="isTrash? DiskDelete():''"
         @keydown.stop.ctrl.79="isDisk? OpenFile(''):''"
         @keydown.stop.ctrl.77="isDisk? DiskRename(''):''"
         @keydown.stop.113="isDisk? DiskRename(''):''"
         @keydown.stop.alt.enter="isDisk? DiskInfo(''):''"
         @keydown.stop.ctrl="DiskData.KeyFlag = 'Ctrl'"
         @keydown.stop.shift="DiskData.KeyFlag = 'Shift'"
         @keyup="DiskData.KeyFlag =null"
         tabindex="1" ref="CloudDiskMain">
        <div class="CloudDiskHeaderDrag" :style="{background: HeadSrc}">
            <ul class="CloudDiskFuncMenu">
                <img draggable="false" :src="static+'/img/bar/disk.png'"><span>CloudDisk</span>
                <li @click="changeType('disk')"><p> 网盘</p><div class="CloudDiskFuncLine" v-if="DiskType==='disk'"></div></li>
                <li @click="changeType('share')"><p> 分享</p><div class="CloudDiskFuncLine" v-if="DiskType==='share'"></div></li>
                <li @click="changeType('trans')"><p> 传输</p><div class="CloudDiskFuncLine" v-if="DiskType==='trans'"></div></li>
            </ul>
            <div class="CloudDiskHeaderControl">
                <span></span>
                <button type="button" class="sf-icon-chevron-down" @click="DropMenuShow?DropMenuShow=false:DropMenuShow=true"></button>
                <Dropdown placement="bottom-start" trigger="custom" :visible.sync="DropMenuShow" @on-click="SystemDropDown">
                    <DropdownMenu slot="list">
                        <DropdownItem name="account">
                            <img draggable="false" :src="Logined.userhead">
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
            <div class="CloudDiskUser" @click="showAccount">
                <span>{{Logined.username}}</span>
                <img draggable="false" :src="Logined.userhead?Logined.userhead+now:''">
            </div>
        </div>
        <div class="CloudDiskFuncMain">
            <div class="CloudDiskHead">
                <div class="CloudDiskHeadLeft">
                    <div class="CloudDiskNav">
                        <button class="sf-icon-chevron-left" @click="NavBack" :disabled="DiskData.NavData.length===0"></button>
                        <button class="sf-icon-home" @click="NavHomeLoad" style="font-size: 16px;" :disabled="DiskType==='trans'"></button>
                        <button :class="'sf-icon-redo'+(!LoadCompany?' sf-spin':'')" @click="DiskRefush" :disabled="DiskType==='trans'"></button>
                        <span class="CloudDiskNavLine"></span>
                        <button @click="NavHomeLoad" style="padding-right: 0;">{{ClassifyName}}/</button>
                        <DiskNav :data="DiskData" @SwitchNav="SwitchNav"></DiskNav>
                    </div>
                </div>
                <div class="CloudDiskHeadRight">
                    <input class="CDsearchInput" type="text" placeholder="搜索" v-model="DiskSearch.SearchKey" @keyup.enter.native="SwitchSearch" :style="DiskSearch.ShowSearch?{width:'170px',border:'1px solid #eee'}:''">
                    <button class="sf-icon-search" @click="SwitchSearch" v-show="DiskType!=='trans'" :disabled="DiskType==='share'"></button>
                    <button :class="'sf-icon-sort-amount-'+DiskSortState.amount" @click="DiskSort('amount','disk_name')" v-show="DiskType!=='trans'"></button>
                    <button :class="DiskStateIcon" @click="changeState" v-show="DiskType!=='trans'"></button>
                </div>
            </div>
            <div class="CloudDiskLeft">
                <ClassifyMenu :data="ClassifyData" @updateClassify="updateClassify" v-show="DiskType==='disk'"></ClassifyMenu>
                <ClassifyMenu :data="ShareData" @updateClassify="updateClassify" v-show="DiskType==='share'"></ClassifyMenu>
                <ClassifyMenu :data="TransData" @updateClassify="updateClassify" v-show="DiskType==='trans'"></ClassifyMenu>
                <img :src="BottomSrc" draggable="false">
                <div class="CloudDiskSelectTips" v-show="DiskType!=='trans'">{{DiskData.SelectTips}}</div>
                <div class="CloudDiskCapacity" v-show="DiskType!=='trans'">
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
                <div class="CloudDiskMain1" @scroll="LoadMore" @mousedown="MainMouseFunc" @dragover.prevent.stop="ShowUploadTips=true" @dragleave.prevent.stop="ShowUploadTips=false" @drop.prevent.stop="UploadDrop" ref="CloudDiskMain">
                    <div class="CloudDiskUploadTips" v-show="ShowUploadTips&&DiskType==='disk'&&loadClassify==='normal'">
                        松开鼠标开始上传文件
                    </div>
                    <DiskFile @SelectFiles="SelectFiles" @OpenFile="OpenFile" v-if="LoadCompany&&DiskType!=='trans'" :data="UserDiskData" :DiskData="DiskData"></DiskFile>
                    <div class='CloudDiskLoading' v-show="!LoadCompany&&DiskType!=='trans'"><div class='sf-icon-hdd'><div class='CloudDiskLoading-beat'><div></div> <div></div> <div></div> </div></div>正在加载</div>
                    <div class='CloudDiskEmptyTips' v-if="LoadCompany&&DiskType!=='trans'" v-show="!UserDiskData.length>0"><span class='sf-icon-hdd'></span>这里什么都没有</div>
                    <div class="MouseSelect" v-show="MouseSelectData.width" :style="{'width':MouseSelectData.width,'height':MouseSelectData.height,'left':MouseSelectData.left,'top':MouseSelectData.top}"></div>
                    <ul class="CloudDisTrans" v-show="DiskType==='trans'">
                        <DiskTransList :data="TransformData" @ControlTrans="ControlTrans"></DiskTransList>
                    </ul>
                </div>
            </div>
        </div>
        <ul class="MouseMenu" v-show="DiskMouseState.DiskShareMenu.show" ref="DiskShareMenu">
            <li @click="OpenFile('')" :disabled="DiskData.SelectFiles.length>1" >打开</li>
            <li @click="DiskRename" :disabled="DiskData.SelectFiles.length>1">重命名</li>
            <li @click="DiskTrash">删除</li>
            <li @click="DiskShare" :disabled="DiskData.SelectFiles.length>1">查看分享</li>
            <li @click="CancelShare" :disabled="DiskData.SelectFiles.length>1">取消分享</li>
            <li @click="DiskInfo" :disabled="DiskData.SelectFiles.length>1">属性<span>Alt+Enter</span></li>
        </ul>
        <ul class="MouseMenu" v-show="DiskMouseState.DiskMainMenu.show" ref="DiskMainMenu">
            <li @click="UploadFile" :disabled="ClassifyName!=='网盘'">上传文件<span>Ctrl+U</span></li>
            <li @click="CreateFolder" :disabled="ClassifyName!=='网盘'">新建文件夹<span>Ctrl+N</span></li>
            <li @click="DiskData.Clipboard=[]" v-if="ClassifyName==='网盘'" :disabled="DiskData.Clipboard.length===0">清空剪切板</li>
            <li @click="DiskPaste" v-if="ClassifyName==='网盘'" :disabled="DiskData.Clipboard.length===0">粘贴<span>Ctrl+V</span></li>
            <li @click="DiskRefush">刷新<span>F5</span></li>
        </ul>
        <ul class="MouseMenu" v-show="DiskMouseState.DiskFileMenu.show" ref="DiskFileMenu" >
            <li @click="OpenFile('')" :disabled="DiskData.SelectFiles.length>1">打开<span>Ctrl+O</span></li>
            <li @click="DiskDownload">下载</li>
            <li @click="DiskMoveTo">移动到</li>
            <li @click="DiskCopy">复制<span>Ctrl+C</span></li>
            <li @click="DiskCut">剪切<span>Ctrl+X</span></li>
            <li @click="DiskRename" :disabled="DiskData.SelectFiles.length>1">重命名<span>Ctrl+M/F2</span></li>
            <li @click="DiskTrash">删除<span>Delete</span></li>
            <li @click="DiskShare" :disabled="DiskData.SelectFiles.length>1">分享</li>
            <li @click="DiskInfo" :disabled="DiskData.SelectFiles.length>1">属性<span>Alt+Enter</span></li>
        </ul>
        <ul class="MouseMenu" v-show="DiskMouseState.TrashFileMenu.show" ref="TrashFileMenu">
            <li @click="DiskRestore">还原<span>Ctrl+R</span></li>
            <li @click="DiskDelete">删除<span>Ctrl+Del</span></li>
            <li @click="DiskInfo" :disabled="DiskData.SelectFiles.length>1">属性<span>Alt+Enter</span></li>
        </ul>
        <el-dialog title="选择目标文件夹" :visible.sync="showTree" width="350px">
            <div style="height: 200px; overflow: auto">
                <DiskTree @SelectDiskTree="SelectDiskTree" ref="DiskTree"></DiskTree>
            </div>
            <span slot="footer" class="dialog-footer">
                <button class="el-button el-button--default el-button--small" @click="showTree = false">取 消</button>
                <button class="el-button el-button--default el-button--small el-button--primary" @click="DiskMoveUp">确 定</button>
            </span>
        </el-dialog>
        <el-dialog title="解压到" :visible.sync="ShowUnZip" width="350px">
            <div style="height: 200px; overflow: auto">
                <DiskTree @SelectDiskTree="SelectDiskTree" ref="DiskTree"></DiskTree>
            </div>
            <span slot="footer" class="dialog-footer">
                <button class="el-button el-button--default el-button--small" @click="ShowUnZip = false">取 消</button>
                <button class="el-button el-button--default el-button--small el-button--primary" @click="DiskUnZip">确 定</button>
            </span>
        </el-dialog>
        <el-dialog title="分享方式" :visible.sync="showShare" width="350px" top="150px">
            <div style="height: 150px;">
                <p class="CloudDiskShareTips">准备分享<span>{{DiskData.NowSelect.disk_name}}</span></p>
                <DiskShare ref="DiskShareModel" @close="showShare=false" @updateShare="updateShare"></DiskShare>
            </div>
            <span slot="footer" class="dialog-footer">
                <button class="el-button el-button--default el-button--small" @click="showShare = false">取 消</button>
                <button class="el-button el-button--default el-button--small el-button--primary" @click="Share">确 定</button>
            </span>
        </el-dialog>
        <input type="file" id="FileArea" @change="PreparUpload" hidden ref="FileArea" multiple="multiple">
        <audio :src="NoticeSrc" ref="NoticeAudio"></audio>
    </div>
</template>

<script>
    import ClassifyMenu from './DiskWindow/ClassifyMenu';
    import DiskFile from './DiskWindow/DiskFile';
    import DiskNav from './DiskWindow/DiskNav';
    import DiskTree from './DiskWindow/DiskTree';
    import DiskShare from './DiskWindow/DiskShare';
    import DiskTransList from './DiskWindow/DiskTransList';
    import electron from 'electron';
    const fs= require('fs');
    let address=process.env.HOMEDRIVE+process.env.HOMEPATH+'/CloudDisk\/';//用户文件地址
    let AccountFile=null;
    const path = require('path');
    let DiskWindow=electron.remote.getCurrentWindow();
    let ipc=electron.ipcRenderer;
    export default {
        name: "DiskWindow",
        components:{ClassifyMenu,DiskFile,DiskNav,DiskTree,DiskShare,DiskTransList},
        data(){
            return{
                QuitFlag:false,
                Logined:{},
                UserDiskData:[],//存放用户网盘数据
                LoadCompany:false,//是否加载完成
                ButtonState:"sf-icon-window-maximize",//右上角窗口按钮状态
                ClassifyName:'网盘',//地址栏左侧分类显示文本
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
                    {"name":"正在下载","icon":"sf-icon-download","count":0,"data":"download","active":"CloudDiskClassifyActive"},
                    {"name":"正在上传","icon":"sf-icon-upload","count":0,"data":"upload","active":""},
                    {"name":"传输完成","icon":"sf-icon-check-circle","count":0,"data":"finish","active":""},
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
                    SelectTips:'0个项目',//选择文件提示
                },
                /*树目录参数*/
                showTree:false,
                SelectTrees:false,
                /*解压到参数*/
                ShowUnZip:false,
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
                DropMenuShow:false,
                /*上传提示*/
                ShowUploadTips:false,
                /*文件传输列表参数*/
                TransformData:[],
                SelectUploadFiles:[],
                SelectDownLoadFiles:[],
                UploadCount:0,
                DownloadCount:0,
                FinishCount:0,
                NoticeSrc:'',
                /*自动切换背景*/
                HeadSrc:'url(' + require('../../../static/img/bg/Autumn-1.png') + ')',
                BottomSrc:path.join(__static,'/img/bg/Autumn-bottom-1.png'),
                /*记录用户个人信息文件*/
                DiskUploadData:[],
                DiskDownLoadData:[],
                DiskUserAllData:[],
            }
        },
        watch:{
            UserDiskData: {
                handler(newValue, oldValue) {
                    this.DiskSearch.ShowSearch=false;
                    this.DropMenuShow=false;
                    this.DiskData.SelectFiles=[];
                    this.UserDiskData.forEach((item,index)=>{
                        if (item.active){
                            item.index=index;
                            this.DiskData.SelectFiles.push(item);
                        }
                    });
                    if(this.DiskData.SelectFiles.length){
                        this.DiskData.SelectTips='选中'+this.DiskData.SelectFiles.length+'个项目'
                    }else{
                        this.DiskData.SelectTips=this.UserDiskData.length+'个项目'
                    }
                    for(let item in this.DiskMouseState){
                        this.DiskMouseState[item].show = false
                    }
                },
                deep: true
            },
            loadClassify: {
                handler(newValue, oldValue) {
                    if(this.DiskType==='trans'){
                        this.$nextTick(()=>{
                            this.TransformData.forEach((item,index)=>{
                                if(item.state==='finish'&&this.loadClassify!=='finish'){
                                    item.show=false;
                                }
                                if(item.trans_type===this.loadClassify&&item.state!=='finish'){
                                    item.show=true;
                                }else{
                                    item.show=false;
                                }
                                if(item.state===this.loadClassify){
                                    item.show=true;
                                }
                            })
                        });
                    }
                },
                deep: true
            },
            TransformData:{
                handler(newValue, oldValue) {
                    this.$nextTick(()=>{
                        this.UploadCount=0;
                        this.DownloadCount=0;
                        this.FinishCount=0;
                        this.TransformData.forEach((item,index)=>{
                            if(item.trans_type==='upload'&&item.state!=='finish'){
                                this.UploadCount++;
                            }else if(item.trans_type==='upload'&&item.state==='finish'){
                                this.FinishCount++;
                            }
                            if(item.trans_type==='download'&&item.state!=='finish'){
                                this.DownloadCount++;
                            }else if(item.trans_type==='download'&&item.state==='finish'){
                                this.FinishCount++;
                            }
                        });
                        this.TransData[0].count=this.DownloadCount;
                        this.TransData[1].count=this.UploadCount;
                        this.TransData[2].count=this.FinishCount;
                    });
                },
                deep: true
            }
        },
        computed:{
            now(){
                return '?'+Date.now();
            },
            static(){
                return path.join(__static)
            },
            isDisk(){
                return this.loadClassify!=='trash'&&this.DiskType==='disk';
            },
            isTrash(){
                return this.loadClassify==='trash'&&this.DiskType==='disk'
            }
        },
        created(){
            this.Bind();
            this.GetUserInfo();
            this.GetMainFile(null,this.loadClassify);
            this.NoticeSrc=localStorage.NoticeVoice;
        },
        methods:{
            Bind(){
                DiskWindow.on('maximize',()=>{
                    this.ButtonState='sf-icon-window-restore';
                });
                DiskWindow.on('unmaximize',()=>{
                    this.ButtonState='sf-icon-window-maximize';
                });
                document.onclick=document.onmousewheel=()=>{
                    for(let item in this.DiskMouseState){
                        this.DiskMouseState[item].show = false
                    }
                };
                window.addEventListener( "dragenter", function (e) {
                    e.preventDefault();
                }, false);
                window.addEventListener( "dragover", function (e) {
                    e.preventDefault();
                }, false );
                window.addEventListener( "dragleave", function (e) {
                    e.preventDefault();
                }, false );
                window.addEventListener( "drop", function (e) {
                    e.preventDefault();
                }, false );
                window.onbeforeunload=()=>{
                    if(!this.QuitFlag&&process.env.NODE_ENV !== 'development') {
                        DiskWindow.hide();
                        return false
                    }
                };
                ipc.on('exit',()=>{
                    this.SystemDropDown('exit');
                });
                setInterval(()=>{
                    this.TimeBackground();
                },1000);
            },
            GetUserInfo () {
                this.$Api.User.UserInfo((rs)=>{
                    this.Logined=rs[0];
                    localStorage.LoginTime=rs[0].login_time;
                    localStorage.Phone=rs[0].phone;
                    localStorage.email=rs[0].email;
                    this.AccountfileExist(rs[0].userid);
                },()=>{
                    this.$Message.error({
                        content: '账号状态异常，请重新登录！',
                        onClose:()=> {
                            /////弹出登录页
                            ipc.send('system','logoff');
                        }
                    });
                });
            },//获取用户信息
            GetMainFile(id,type){
               if(this.DiskType==='trans'){
                   return
               }
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
                this.$Api.Disk.LoadMainFile({
                    id: id,
                    page: this.DiskPage,
                    loadtype: this.loadClassify
                },(rs)=>{
                    this.PrintFile(rs);
                })
            },//获取用户文件
            PrintFile(rs){
                if (this.DiskPage === 1) {
                    this.DiskAllCount=0;
                    this.DiskLoadCount=0;
                }
                this.LoadCompany=true;
                rs.forEach((item)=> {
                    this.UserDiskData.push(item);
                });
                if(rs.length){
                    this.DiskSize.total=rs[0].max_size;
                    this.DiskSize.use=rs[0].use_size;
                    let Percent=(this.DiskSize.use/this.DiskSize.total)*100;
                    this.DiskSize.Percent=Percent+'%';
                    this.DiskSize.text=this.$Api.FileSize(this.DiskSize.use)+'/'+this.$Api.FileSize(this.DiskSize.total)
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
            updateClassify(value){//更新网盘分类子组件传回的数据
                this.ClassifyName=value.name==='全部文件'?'网盘':value.name;
                this.loadClassify=value.data;
                this.DiskPage = 1;
                this.GetMainFile(null,this.loadClassify);
                this.DiskData.NavData=[];
            },
            LoadMore(){
                let elm=event.target;
                if (elm.scrollTop+ elm.offsetHeight >= elm.scrollHeight-32 && this.DiskLoadCount< this.DiskAllCount) {
                    if (this.LoadCompany) {
                        this.DiskPage++;
                        this.GetMainFile(this.NowDiskID, this.loadClassify);
                    }
                }
            },//下拉加载更多
            changeType(type){
                this.UserDiskData=[];//清空数据
                this.DiskData.NavData=[];
                this.DiskType=type;
                if(type==='disk') {
                    this.ClassifyData.forEach(function (item) {
                        item.active='';
                    });
                    this.ClassifyName='网盘';
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
                    this.TransData.forEach(function (item) {
                        item.active='';
                    });
                    this.ClassifyName=this.TransData[0].name;
                    this.loadClassify=this.TransData[0].data;
                    this.TransData[0].active='CloudDiskClassifyActive';
                }
            },//切换网盘分享、传输等
            /*网盘搜索*/
            SwitchSearch(){//搜索有问题
                if(this.DiskSearch.ShowSearch===false){
                    this.DiskSearch.ShowSearch=true;
                }else if(this.DiskSearch.SearchKey.length&&this.DiskSearch.ShowSearch){
                    this.DiskPage=1;
                    this.UserDiskData=[];
                    this.ClassifyData.forEach((item)=>{
                       item.active='';
                    });
                    this.ClassifyName='搜索';
                    this.SearchDisk();
                    this.DiskData.NavData=[];
                }else{
                    this.DiskSearch.ShowSearch=false;
                }
            },
            SearchDisk(){
                this.$Api.Disk.Search({
                    id:this.DiskSearch.SearchKey,
                    page: this.DiskPage,
                },(rs)=>{
                    this.PrintFile(rs);
                });
            },
            //切换文件显示模式
            changeState(){
                this.DiskData.DiskShowState==='CloudDiskMFile'?this.DiskData.DiskShowState='CloudDiskMList':this.DiskData.DiskShowState='CloudDiskMFile';
                this.DiskStateIcon==='sf-icon-th-large'?this.DiskStateIcon='sf-icon-list-ul':this.DiskStateIcon='sf-icon-th-large';
            },
            //网盘排序方法(排序自段)
            DiskSort(type,key){
                if(this.DiskSortState[type]==='up'){
                    this.UserDiskData=this.ArraySort(this.UserDiskData, key, '<');
                    this.DiskSortState[type]='down';
                }else{
                    this.UserDiskData=this.ArraySort(this.UserDiskData, key, '>');
                    this.DiskSortState[type]='up';
                }
            },
            /*选择文件数据操作方法*/
            SelectFiles(event,item,index){
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
            RemoveSelect(index){
                this.DiskData.SelectFiles.splice(index,1)
            },
            ClearSelect(){
                this.UserDiskData.forEach((item)=>{
                    item.active=false;
                });
                this.DiskData.SelectFiles=[];
            },
            /*导航栏函数*/
            SwitchNav(item){
                for (let i = this.DiskData.NavData.length - 1; i > 0; i--) {
                    if (item ===  this.DiskData.NavData[i]) {
                        break;
                    }
                    this.DiskData.NavData.splice(i,1);
                }
                this.GetMainFile(item.disk_id, 'normal');
            },///导航栏点击切换
            NavHomeLoad(){
               if(this.DiskType==='share'){
                    this.changeType('share');
                    this.DiskData.NavData=[];
                }else if(this.DiskType!=='trans'&&this.ClassifyName!=='搜索') {
                   this.GetMainFile(null, this.loadClassify);
                   this.DiskData.NavData=[];
               }else if(this.ClassifyName==='搜索'){
                    this.changeType('disk');
                    this.DiskData.NavData=[];
                }
            },//导航栏首页点击加载
            NavBack(){
                if(this.DiskData.NavData.length>1) {
                    this.SwitchNav(this.DiskData.NavData[this.DiskData.NavData.length - 2])
                }else{
                    this.NavHomeLoad();
                }
            },//导航栏后退
            /*打开文件夹/文件*/
            OpenFile(item){
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
                    let type=this.DiskData.NowSelect.type;
                    if (type==='zip') {
                        this.ShowUnZip=true;
                        this.$nextTick(()=>{
                            this.$refs.DiskTree.init();
                        });
                    }
                    else if (this.$Api.StringExist(type, 'apng,png,jpg,jpeg,bmp,gif')) {
                        let data=[];
                        this.UserDiskData.forEach((item)=>{
                            if(this.$Api.StringExist(item.type, 'apng,png,jpg,jpeg,bmp,gif')){
                                data.push(item)
                            }
                        });
                        ipc.send('file-control','image',data);
                    }
                    else if (this.$Api.StringExist(type, 'mp4,rmvb,mkv')) {
                        let data=[];
                        this.UserDiskData.forEach((item)=>{
                            if(this.$Api.StringExist(item.type, 'mp4,rmvb,mkv')){
                                data.push(item)
                            }
                        });
                        ipc.send('file-control','video',data);
                    }
                    else if (this.$Api.StringExist(type, 'm4a,mp3,ogg,flac,f4a,wav,ape,ncm')) {
                        let data=[];
                        this.UserDiskData.forEach((item)=>{
                            if(this.$Api.StringExist(item.type, 'm4a,mp3,ogg,flac,f4a,wav,ape,ncm')){
                                data.push(item)
                            }
                        });
                        ipc.send('file-control','audio',data);
                    }
                    else if (this.$Api.StringExist(type, 'doc,docx')) {
                        this.$Message.warning('暂不支持打开word文档文件');
                    }
                    else if (this.$Api.StringExist(type, 'ppt,pptx')) {
                        this.$Message.warning('暂不支持打开幻灯片文件');
                    }
                    else if (this.$Api.StringExist(type, 'xls,xlsx')) {
                        this.$Message.warning('暂不支持打开Excel表格');
                    }
                    else if (type==='pdf') {
                        this.$Message.info('正在加载插件');
                        ipc.send('file-control','pdf',this.DiskData.NowSelect);
                    }
                    else if (this.$Api.StringExist(type, 'ini,txt,md,xml,aspx,php,phtml,js,c,htm,html,log,cpp,java')) {
                        ipc.send('file-control','text',this.DiskData.NowSelect);
                    }
                    else if (this.$Api.StringExist(type, 'exe,msi')) {
                        this.$Message.warning('暂不支持打开windows安装程序');
                    }
                    else if (type=== 'torrent') {
                        this.$Message.warning('暂不支持打开bt种子文件');
                    }
                    else if (type==='vcf') {
                        this.$Message.warning('暂不支持打开通讯录文件');
                    }
                    else {
                        this.$Message.warning('暂不支持打开'+type+'文件');
                    }
                }
            },
            /*右键菜单函数*/
            UploadDrop(e){
                if(this.loadClassify==='normal') {
                    this.PreparUpload(e.dataTransfer);
                    this.ShowUploadTips = false;
                }
            },//拖拽上传
            UploadFile(){
                if(this.loadClassify==='normal') {
                    this.$refs.FileArea.value='';
                    this.$refs.FileArea.click();
                }
            },//上传文件
            PreparUpload(data){
                if(data.target){
                    data=data.target;
                    for(let k=0;k<data.files.length;k++){
                        this.SelectUploadFiles.push(data.files[k]);
                    }
                }else{
                    for(let k=0;k<data.files.length;k++){
                        this.SelectUploadFiles.push(data.files[k]);
                    }
                }
                let fileArea=data.files;
                let file;
                let count=0;
                let OneFile={};
                this.$nextTick(()=>{
                    for (let i = 0; i<fileArea.length; i++) {
                        file = fileArea[i];
                        if (file.name.split('.').length>1) {
                            OneFile = {
                                name: file.name,
                                chunk: 0,
                                size: this.$Api.FileSize(file.size),
                                paused: false,
                                trans_type: 'upload',
                                state: 'default',
                                orginSize: file.size,
                                disk_main: file.path,
                                show: false,
                                type: this.$Api.StringBefore(file.name, ".").toLowerCase(),
                                $icon: '',
                                percent:0,
                                buttonVal:'sf-icon-pause'
                            };
                            OneFile.$icon=this.$Api.IconGet(OneFile);
                            //debugger
                            for (let j=0;j<this.DiskUploadData.length;j++){
                                let item=this.DiskUploadData[j];
                                if(item.name===OneFile.name&&item.percent!==100&&item.disk_main===OneFile.disk_main){
                                    item.buttonVal='sf-icon-pause';
                                    item.paused=false;
                                    this.PostUpload(item);
                                    return false
                                }
                            }
                            count++;
                            this.DiskUploadData.push(OneFile);
                            this.TransformData.push(OneFile);
                            this.PostUpload(OneFile,'first');
                        }
                    }
                    this.$Notice.info({
                        title: '开始上传',
                        desc: count+'个文件已加入上传列队'
                    });
                });
            },//处理上传
            FindTheFile(fileName){
                let files = this.SelectUploadFiles,
                    theFile;
                for (let i = 0, j = files.length; i < j; ++i) {
                    if (files[i].name === fileName) {
                        theFile = files[i];
                        break;
                    }
                }
                return theFile ? theFile : [];
            },//查找上传的文件
            ControlTrans(item,index){
                if(event.target.className==='sf-icon-times'){
                    this.TransformData.splice(index,1);
                    this.WriteAccountFile('upload', this.TransformData);
                    return
                }
                if(item.state==='finish'){
                    this.TransformData.splice(index,1);
                    this.WriteAccountFile('upload', this.TransformData);
                    return
                }
                if (!item.paused) {
                    this.$nextTick(()=>{
                        item.buttonVal='sf-icon-play';
                        item.state = 'paused';
                        item.paused=true;
                    });
                }else if (item.paused) {
                    this.$nextTick(()=>{
                        item.buttonVal='sf-icon-pause';
                        item.state = 'uploading';
                        item.paused=false;
                    });
                }
                if(item.trans_type==='upload') {
                    this.PostUpload(item);
                }
            },//上传控制
            PostUpload(item,times) {
                let fileName = item.name,
                    eachSize = item.orginSize/150,
                    totalSize = item.orginSize,
                    chunks = Math.ceil(totalSize / eachSize),
                    chunk=item.chunk || 0;
                // 上传之前查询是否以及上传过分片
                chunk = parseInt(chunk, 10);
                // 判断是否为末分片
                let isLastChunk = (chunk === (chunks - 1) ? 1 : 0);
                // 如果第一次上传就为末分片，即文件已经上传完成，则重新覆盖上传
                if (times === 'first' && isLastChunk === 1) {
                    localStorage.setItem('upload_'+fileName + '_chunk', 0);
                    chunk = 0;
                    isLastChunk = 0;
                }
                // 设置分片的开始结尾
                let blobFrom = chunk * eachSize, // 分段开始
                    blobTo = (chunk + 1) * eachSize > totalSize ? totalSize : (chunk + 1) * eachSize, // 分段结尾
                    percent = parseFloat((100 * blobTo / totalSize).toFixed(1)), // 已上传的百分比
                    fd = new FormData();
                this.$nextTick(()=>{
                    item.chunk=this.$Api.FileSize(blobTo);
                });
                fd.append('theFile', this.FindTheFile(fileName).slice(blobFrom, blobTo)); // 分好段的文件
                fd.append('fileName', fileName); // 文件名
                fd.append('parent_id', this.NowDiskID); // 当前目录id
                fd.append('totalSize', totalSize); // 文件总大小
                fd.append('isLastChunk', isLastChunk); // 是否为末段
                fd.append('isFirstUpload', times === 'first' ? 1 : 0); // 是否是第一段（第一次上传）
                // 上传
                this.$Api.Disk.Upload(fd,(rs)=>{
                    // 上传成功
                    if (parseInt(rs.status) === 200) {
                        // 记录已经上传的百分比
                        this.$nextTick(()=>{
                            item.percent=parseFloat(percent);
                        });
                        // 已经上传完毕
                        if (rs.data) {
                            this.$nextTick(()=>{
                                item.state='finish';
                                item.show=false;
                                item.buttonVal='sf-icon-trash';
                                if(this.NowDiskID===rs.data.parent_id) {
                                    this.UserDiskData.push(rs.data);
                                }
                            });
                            /*播放提示音*/
                            this.PlayNoticeVoice();
                            this.ShowMsgBox(item.name+'上传完成');
                        }else {
                            item.chunk = ++chunk;
                            // 这样设置可以暂停，但点击后动态的设置就暂停不了..
                            if (item.buttonVal === 'sf-icon-pause') {
                                item.paused = false;
                            } else {
                                item.paused = true;
                            }
                            if (!item.paused&&item.state!=='finish') {
                                this.PostUpload(item);
                            }
                        }
                        this.$nextTick(()=> {
                            this.WriteAccountFile('upload', this.TransformData);
                        });
                    }else{
                        this.$nextTick(()=>{
                            item.state='fail';
                            item.buttonVal='sf-icon-play';
                            //删除记录
                            this.WriteAccountFile('upload', this.TransformData);
                        });
                    }
                });
            },
            DiskDownload(){
                if(this.DiskData.SelectFiles.length){
                    this.SelectDownLoadFiles=this.DiskData.SelectFiles;
                    if(this.DiskData.SelectFiles.length===1){
                        this.$Message.info(this.DiskData.SelectFiles[0].disk_name+' 开始下载');
                    }else {
                        this.$Message.info('所选' + this.SelectDownLoadFiles.length + '开始下载');
                    }
                }else{
                    this.SelectDownLoadFiles.push(this.DiskData.NowSelect);
                    this.$Message.info(this.DiskData.NowSelect.disk_name+' 开始下载');
                }
                this.SelectDownLoadFiles.forEach((item)=>{
                    // 定义回调函数
                    function downloadFileCallback(arg, percentage)
                    {
                        if (arg === "progress")
                        {
                            // 显示进度
                            console.log(percentage)
                        }
                        else if (arg === "finished")
                        {
                            // 通知完成
                        }
                    }
                })
            },//下载文件
            CreateFolder(){
                if(this.ClassifyName==='网盘') {
                    this.InputConfrim({
                        title: "新建文件夹",
                        tips: '请输入文件夹名称',
                        callback: (value) => {
                            if(value.length===0){
                                this.$Message.error('文件夹名称不能为空');
                                return
                            }
                            this.$Api.Disk.NewFolder({
                                name: value,
                                parent_id: this.NowDiskID,
                            }, (rs) => {
                                rs = rs[0];
                                if (rs.disk_id) {
                                    this.UserDiskData.push(rs);
                                    this.$Message.success(value + ' 已创建')
                                } else {
                                    this.$Message.error(value + ' 已存在');
                                }
                            });
                        }
                    })
                }
            },//右键新建文件夹
            DiskPaste(){
                if(this.DiskData.Clipboard.length&&this.ClassifyName==='网盘'){
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
                        this.$Api.Disk.Copy({
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
                                        item.parent_id=this.NowDiskID;
                                        this.UserDiskData.push(item);
                                    });
                                }
                                this.$Message.success('复制成功，共'+this.DiskData.Clipboard.length+'个项目');
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
                        this.$Api.Disk.Cut({
                            id:data,
                            parent_id:this.NowDiskID
                        },(rs)=>{
                            rs=rs[0];
                            if(rs.state==='success'){
                                this.DiskData.Clipboard.forEach((item)=>{
                                    item.parent_id=this.NowDiskID;
                                    this.UserDiskData.push(item);
                                });
                                this.$Message.success('剪贴成功，共'+this.DiskData.Clipboard.length+'个项目');
                                this.DiskData.Clipboard=[];
                            }else{
                                this.$Message.error('剪贴失败')
                            }
                        })
                    }
                }
            },//右键粘贴
            DiskMoveTo(){
                this.showTree=true;
                this.$nextTick(()=>{
                    //第一次打开会报错
                    try {
                        this.$refs.DiskTree.init();
                    }catch (e) {

                    }
                });
            },
            DiskCopy(){
                this.DiskData.Clipboard=[];
                this.DiskData.ClipboardState='copy';
                if(this.DiskData.SelectFiles.length){
                    this.DiskData.Clipboard=this.DiskData.SelectFiles;
                    if(this.DiskData.SelectFiles.length===1){
                        this.$Message.info(this.DiskData.SelectFiles[0].disk_name+' 已复制到剪贴板');
                    }else {
                        this.$Message.info('所选' + this.DiskData.Clipboard.length + '个项目已复制到剪贴板');
                    }
                }else{
                    this.DiskData.Clipboard.push(this.DiskData.NowSelect);
                    this.$Message.info(this.DiskData.NowSelect.disk_name+' 已复制到剪贴板');
                }
            },//复制
            DiskCut(){
                this.DiskData.Clipboard=[];
                this.DiskData.ClipboardState='cut';
                if(this.DiskData.SelectFiles.length){
                    this.DiskData.Clipboard=this.DiskData.SelectFiles;
                    if(this.DiskData.SelectFiles.length===1){
                        this.$Message.info(this.DiskData.SelectFiles[0].disk_name+' 已剪切到剪贴板');
                    }else {
                        this.$Message.info('所选' + this.DiskData.Clipboard.length + '个项目剪切到剪贴板');
                    }
                }else{
                    this.DiskData.Clipboard.push(this.DiskData.NowSelect);
                    this.$Message.info(this.DiskData.NowSelect.disk_name+' 已剪切到剪贴板');
                }
            },//剪切
            DiskRename(){
                if(this.DiskData.SelectFiles.length<2){
                    this.InputConfrim({
                        title:"重命名",
                        tips:'请输入新的文件/文件夹名称',
                        value:this.DiskData.NowSelect.disk_name,
                        callback:(value)=>{
                            if(value.length===0){
                                this.$Message.error('文件名不能为空');
                                return
                            }
                            this.$Api.Disk.Rename({
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
            DiskTrash(){
                let delete_data=[];
                let tips='';
                if(this.DiskData.SelectFiles.length){
                    delete_data=this.DiskData.SelectFiles;
                    if(this.DiskData.SelectFiles.length===1){
                        tips=delete_data[0].disk_name+'移入回收站';
                    }else {
                        tips =this.DiskData.SelectFiles[0].disk_name + ' 等' + this.DiskData.SelectFiles.length + '个项目移入回收站';
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
                        this.$Api.Disk.Trash({
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
            DiskRefush(){
                this.DiskPage=1;
                this.GetMainFile(this.NowDiskID, this.loadClassify);
            },//右键刷新
            DiskCleanTrash(){
                this.Confrim({
                    title:'清空回收站',
                    tips:'该操作将清空回收站且不可恢复,是否继续',
                    callback:()=> {
                        this.$Message.info('正在清空回收站');
                        this.$Api.Disk.Delete({
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
            DiskDelete(){
                let delete_data=[];
                let tips='';
                if(this.DiskData.SelectFiles.length){
                    delete_data=this.DiskData.SelectFiles;
                    if(this.DiskData.SelectFiles.length===1){
                        tips=delete_data[0].disk_name+'删除';
                    }else {
                        tips =this.DiskData.SelectFiles[0].disk_name + ' 等' + this.DiskData.SelectFiles.length + '个项目删除';
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
                        this.$Api.Disk.Delete({
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
            DiskRestore(){
                let Restore_data=[];
                let tips='';
                if(this.DiskData.SelectFiles.length){
                    Restore_data=this.DiskData.SelectFiles;
                    if(this.DiskData.SelectFiles.length===1){
                        tips=Restore_data[0].disk_name+'移出回收站';
                    }else {
                        tips =this.DiskData.SelectFiles[0].disk_name + ' 等' + this.DiskData.SelectFiles.length + '个项目移出回收站';
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
                        this.$Api.Disk.Restore({
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
            Share(){
                this.$refs.DiskShareModel.ShareFile(this.DiskData.NowSelect)
            },//提交文件分享
            updateShare(address){
                this.FindInDisk(this.DiskData.NowSelect,(item)=>{
                    item.share=address;
                });
            },//更新文件分享状态
            DiskShare(){
                if(this.DiskData.SelectFiles.length<2) {
                    if (this.DiskData.NowSelect.share) {
                        let message = '该文件分享地址为:' + this.DiskData.NowSelect.shareAddress;
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
            },//文件分享
            CancelShare(){
                if(this.DiskData.SelectFiles.length<2) {
                    this.Confrim({
                        title: '取消分享',
                        tips: '您确认取消分享'+this.DiskData.NowSelect.disk_name+'吗',
                        callback: () => {
                            this.$Api.Disk.CancelShare({
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
            },//取消分享
            DiskInfo(){
                if(this.DiskData.SelectFiles.length<2) {
                    ipc.send('file-control','attributes',this.DiskData.NowSelect);
                }
            },//文件属性
            DiskUnZip(){
                if(!this.SelectTrees){
                    return this.$Message.warning('请选择一个解压目录');
                }
                this.ShowUnZip=false;
                if(this.DiskData.NowSelect.disk_size>209715200){
                    return this.$Message.warning('为了更好的性能，目前只能解压小于200M的压缩包');
                }
                this.$Message.info('开始解压，这可能需要一点时间');
                this.$Api.Disk.UnZip({
                    url: this.DiskData.NowSelect.disk_main.split(localStorage.server)[1],
                    parent_id: this.SelectTrees.disk_id,
                },(rs)=>{
                    if(!rs[0]){
                        return this.$Message.error('解压失败');
                    }
                    rs=rs[0];
                    if(rs.state==='success'){
                        this.$Message.success('解压完成');
                        this.$nextTick(()=>{
                            this.UserDiskData.push(rs.data);
                        });
                        this.ShowUnZip=false;
                        this.SelectTrees=false;
                    }else{
                        this.$Message.error('解压失败')
                    }
                })
            },
            /*树目录操作方法*/
            DiskMoveUp(){
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
                    this.$Api.Disk.Cut({
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
            SelectDiskTree(item){
                this.SelectTrees=item;
            },//选择树目录
            /*通用方法*/
            MakeSelectData  (orgin_data) {
                let data = '';
                for (let j = 0; j < orgin_data.length; j++) {
                    data = data + orgin_data[j].disk_id + ',';
                }
                return data.substring(0, data.length - 1);
            },//处理被选中文件的数据收集
            RemoveSelectData(data){
                for (let i = 0; i < this.UserDiskData.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        if (data[j].disk_id === this.UserDiskData[i].disk_id) {
                            this.UserDiskData.splice(i, 1);
                        }
                    }
                }
            },
            MainMouseFunc(){
                //this.ClearSelect();
                if(this.DiskType!=='trans') {
                    this.MouseMenu('DiskMainMenu', event);
                    this.MouseSelect(event);
                }
            },
            MouseMenu(menu_main,e){
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
            MouseSelect(event){
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
            Confrim(options){
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
            FindInDisk(list,callback){
                let result=null;
                this.UserDiskData.forEach((item)=>{
                    if(item.disk_id===list.disk_id){
                        result=item;
                        callback(item);
                    }
                });
                return result;
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
            ArraySort(array, key,type){
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
            /*系统操作函数*/
            TimeBackground(){
                let season='Spring';
                let tag=0;
                let D=new Date();
                let month=D.getMonth();
                let hHour=D.getHours();
                if(month>2&&month<6){
                    season='Spring'
                }else if(month>5&&month<9){
                    season='Summer';
                }else if(month>8&&month<12){
                    season='Autumn'
                }else if(month===12||month===1||month===2){
                    season='Winter'
                }
                if(hHour>=1&&hHour<=8){
                    tag=0;
                }
                else if(hHour>8&&hHour<=16){
                    tag=1
                }else if(hHour>16&&hHour<=18){
                    tag=2
                }else if(hHour>18&&hHour<=24){
                    tag=3
                }
                this.HeadSrc= 'url(' + require('../../../static/img/bg/'+season+'-'+tag+'.png') + ')';
                this.BottomSrc=path.join(__static,'/img/bg/'+season+'-bottom-'+tag+'.png')
            },
            mini () {
                DiskWindow.minimize();
            },
            close () {
                DiskWindow.hide();
            },
            restore () {
                if (DiskWindow.isMaximized()) {
                    DiskWindow.restore();
                } else {
                    DiskWindow.maximize();
                }
            },
            showAccount(){
                if(this.Logined.userid){
                    ipc.send('system','account',this.Logined)
                }
            },
            showAbout(){
                ipc.send('system','about')
            },
            ShowFeedBack(){
                ipc.send('system','feedback')
            },
            ShowSetting(){
                ipc.send('system','setting')
            },
            SystemDropDown (name) {
                this.DropMenuShow=false;
                let tips='';
                switch (name){
                    case 'account':
                        this.showAccount();
                        break;
                    case 'setting':
                        this.ShowSetting();
                        break;
                    case 'about':
                        this.showAbout();
                        break;
                    case 'feedback':
                        this.ShowFeedBack();
                        break;
                    case 'switch':
                        if(this.UploadCount>0){
                            tips=this.UploadCount+'个文件正在上传，切换后将在下次登录后重新选择以继续传输<br>'
                        }else if(this.DownloadCount>0){
                            tips=this.DownloadCount+'个文件正在下载，切换将暂停传输'
                        }
                        this.Confrim({
                            title:'切换账号',
                            tips:tips+'确认退出当前账号吗',
                            callback:()=> {
                                this.QuitFlag=true;
                                ipc.send('system','logoff');
                            }
                        });
                        break;
                    case 'exit':
                        if(this.UploadCount>0){
                            tips=this.UploadCount+'个文件正在上传，退出后将在下次打开后重新选择以继续传输<br>'
                        }else if(this.DownloadCount>0){
                            tips=this.DownloadCount+'个文件正在下载，退出将暂停传输'
                        }
                        this.Confrim({
                            title:'退出',
                            tips:tips+'确认退出CloudDisk吗?',
                            type:'info',
                            callback:()=> {
                                this.QuitFlag=true;
                                DiskWindow.close();
                            }
                        });
                        break;
                    }
            },
            PlayNoticeVoice(){
                if(eval(localStorage.NoticeFlag)){
                    this.NoticeSrc=localStorage.NoticeVoice;
                    let a=setTimeout(()=>{
                        clearTimeout(a);
                        this.$refs.NoticeAudio.play();
                    },200)
                }
            },
            ShowMsgBox(msg){
                if(eval(localStorage.NoticeBubble)){
                    ipc.send('system','popup', msg);
                }
            },
            /*本地账户存储*/
            AccountfileExist(user){
                fs.exists(address,(exists)=>{
                    if(!exists){
                        fs.mkdir(address,(err)=>{
                            if(err) {
                                return this.$Message.error('用户文件创建失败');
                            }
                        })
                    }
                });
                fs.exists(address+ user+".json",(exists)=>{
                    if(!exists){
                        let content={
                            download:[],
                            upload:[],
                        };
                        fs.writeFile(address+ user+".json",JSON.stringify(content),(err)=>{
                            this.GetAccountData();
                        });
                    }else{
                        this.GetAccountData();
                    }
                });
                AccountFile=address+ user+".json";
            },
            ReadAccountFile(type){
                if(!this.Logined.userid){
                    return this.$Message.error('缺少用户数据')
                }
                return new Promise((resolve, reject)=>{
                    fs.readFile(AccountFile,{flag:'r+',encoding:'utf8'},(err,data)=>{
                        data=JSON.parse(data);
                        this.DiskUserAllData=data;
                        resolve(data[type]);
                    })
                })
            },
            WriteAccountFile(type,data){
                this.DiskUserAllData[type]=data;
                fs.writeFile(AccountFile,JSON.stringify(this.DiskUserAllData), (err)=>{});
            },
            GetAccountData(){
                this.ReadAccountFile('upload').then((res)=>{
                    this.DiskUploadData=res;
                    this.DiskUploadData.forEach((item)=>{
                        this.TransformData.push(item);
                    })
                });
            }
        }
    }
</script>

<style scoped>

</style>