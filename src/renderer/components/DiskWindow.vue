<template>
    <div class="CloudDiskMain" v-on:keydown="keyBoard" tabindex="1">
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
                        <button class="sf-icon-arrow-left CloudDiskDisable"> 后退</button>
                        <span class="CloudDiskNavLine">|</span>
                        <button @click="NavHomeLoad">{{ClassifyName}}</button>
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
                <div class="CloudDiskMainFunc" v-show="DiskData.DiskShowState!=='CloudDiskMFile'">
                    <div :class="'CloudDiskFuncBlock sf-icon-sort-alpha-'+DiskSortState.alpha" @click="DiskSort('alpha','disk_name')" ripple style="width:54%;text-indent: 10px;">
                        文件名
                    </div>
                    <div :class="'CloudDiskFuncBlock sf-icon-sort-numeric-'+DiskSortState.mum" @click="DiskSort('mum','create_time')" ripple>
                        修改日期
                    </div>
                    <div :class="'CloudDiskFuncBlock sf-icon-sort-numeric-'+DiskSortState.mum1" @click="DiskSort('mum1','disk_size')" ripple>
                        大小
                    </div>
                </div>
                <div  class="CloudDiskMain1" @mousewheel="LoadMore" @mousedown="ClearSelect">
                    <DiskFile v-on:SelectFiles="SelectFiles" v-if="LoadCompany&&DiskType!=='trans'" v-bind:data="UserDiskData" v-bind:DiskData="DiskData"></DiskFile>
                    <div class='CloudDiskLoading' v-show="!LoadCompany&&DiskType!=='trans'"><div class='sf-icon-hdd'><div class='CloudDiskLoading-beat'><div></div> <div></div> <div></div> </div></div>正在加载</div>
                    <div class='CloudDiskEmptyTips' v-if="LoadCompany&&DiskType!=='trans'" v-show="!UserDiskData.length>0"><span class='sf-icon-hdd'></span>这里什么都没有</div>
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
                    text:'0B/0B'
                },
                /*网盘一些记录的参数*/
                DiskPage:1,//网盘加载的页数
                NowDiskID:null,
                DiskAllCount:0,
                DiskLoadCount:0,
                loadClassify:'normal',//网盘加载的分类

                DiskData:{
                    Clipboard: [],
                    SelectFiles:[],
                    KeyFlag: false,
                    DiskShowState:'CloudDiskMFile',//初始化大图标文件
                },
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
            keyBoard:function(e){
                e.stopPropagation();
                if (e.ctrlKey) {
                    this.DiskData.KeyFlag = 'Ctrl';
                } else if (e.shiftKey) {
                    this.DiskData.KeyFlag = 'Shift';
                }
                document.onkeyup = ()=> {
                    this.DiskData.KeyFlag = false;
                };
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
                    if (this.DiskPage === 1) {
                        this.DiskAllCount=0;
                        this.DiskLoadCount=0;
                    }
                    this.LoadCompany=true;
                    rs.forEach((item)=> {
                        item.active=false;//设置未选择
                        item.size=this.FileSize(item.disk_size);//计算文件大小
                        item.icon = this.IconGet(item.disk_realname,item.disk_main)//区别文件类型设置图表
                        this.UserDiskData.push(item);
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
                        }
                        this.DiskAllCount=rs[0].all_count;
                        this.DiskLoadCount=this.DiskLoadCount+rs.length;
                    }
                    console.log(this.UserDiskData)
                })
            },
            updateClassify:function(value){//更新网盘分类子组件传回的数据
                this.ClassifyName=value.name;
                this.loadClassify=value.data;
                this.DiskPage = 1;
                this.GetMainFile(null,this.loadClassify);
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
            /*导航栏首页点击加载*/
            NavHomeLoad:function(){
                if(this.DiskType!=='trans') {
                    this.GetMainFile(null, this.loadClassify);
                }
            },
            changeType:function(type){
                this.UserDiskData=[];//清空数据
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
            SwitchSearch:function(){
                if(!this.ShowSearch){
                    this.ShowSearch=true;
                }else if(this.SearchKey&&this.ShowSearch){
                    this.$Message.info('开始搜索'+this.SearchKey);
                }else{
                    this.ShowSearch=false;
                }
            },
            SearchDisk:function(){

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
            /*数据操作方法*/
            SelectFiles:function(event,item,index){
                event.stopPropagation();
                event.preventDefault();
                if(event.button===0){
                    if(this.DiskData.KeyFlag==='Ctrl'){//Ctrl多选
                        if(item.active){
                            item.active=false;
                            this.RemoveSelect(index);
                        }else{
                            item.active=true;
                            this.DiskData.SelectFiles.push(item);
                        }
                    }else if(this.DiskData.KeyFlag==='Shift'){//Shift多选
                        let Start = index,End;
                        this.ClearSelect();
                        item.active=true;
                        if(item.active) {
                            for (let i = 0; i < this.UserDiskData.length; i++) {
                                if (this.UserDiskData[i] === item) {
                                    Start = i;
                                }
                                if (this.UserDiskData[i] === item) {
                                    End = i;
                                }
                            }
                        }
                        console.log(Start,End)
                        for (let j =  Math.min(End,Start); j < Math.max(End,Start) +1 ; j++) {
                            this.UserDiskData[j].active=true;
                            this.DiskData.SelectFiles.push(this.UserDiskData[j]);
                        }
                    }else if(!this.DiskData.KeyFlag){//单选
                        this.ClearSelect();
                        item.active=true;
                        this.DiskData.SelectFiles.push(item);
                    }
                }
                console.log(this.DiskData.SelectFiles)
            },
            RemoveSelect:function(index){
                this.DiskData.SelectFiles.splice(index,1)
            },
            ClearSelect:function(){
                this.UserDiskData.forEach((item)=>{
                    item.active=false;
                    this.DiskData.SelectFiles=[];
                })
            },
            /*通用方法*/
            FileSize:function (bytes) {
                bytes=parseFloat(bytes);
                if (bytes === 0) return '0B';
                let k = 1024,
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
            },
            IconGet:function (name,filemain) {
                let prefix='../../../../static/img/disk/';
                let type = this.StringBefore(name, ".");
                if(!filemain){
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