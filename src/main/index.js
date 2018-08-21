import { app, BrowserWindow,ipcMain,Menu,Tray,nativeImage } from 'electron'
const path = require('path');
import { autoUpdater } from 'electron-updater'
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let version=require("../../package.json").version;
let LoginWindow,DiskWindow,DiskInfo,MusicPlayer,VideoPlayer,PictureViewer,PdfWindow,AccountWindow,AboutWindow,FileWindow,FeedBackWindow,SettingWindow;
/*播放按钮*/
let PlayerIcon = path.join(__static, '/img/player');
let NextBtn = nativeImage.createFromPath(path.join(PlayerIcon, 'next.png'));
let PlayBtn = nativeImage.createFromPath(path.join(PlayerIcon, 'play.png'));
let PauseBtn = nativeImage.createFromPath(path.join(PlayerIcon, 'pause.png'));
let PrevBtn = nativeImage.createFromPath(path.join(PlayerIcon, 'prev.png'));
let MusicButtons = [
    {
        tooltip: '上一曲',
        icon: PrevBtn,
        click: () => {
            MusicPlayer.webContents.send('Prev');
        }
    },
    {
        tooltip: '播放',
        icon: PlayBtn,
        click: () => {
            MusicPlayer.webContents.send('Play');
        }
    },
    {
        tooltip: '下一曲',
        icon:NextBtn,
        click: () => {
            MusicPlayer.webContents.send('Next');
        }
    }
];
let VideoButtons = [
    /*{
        tooltip: '上一个',
        icon: PrevBtn,
        click: () => {
            VideoPlayer.webContents.send('video-Prev');
        }
    },*/
    {
        tooltip: '播放',
        icon: PlayBtn,
        click: () => {
            VideoPlayer.webContents.send('video-Play');
        }
    },
    /*{
        tooltip: '下一个',
        icon:NextBtn,
        click: () => {
            VideoPlayer.webContents.send('video-Next');
        }
    }*/
];
let message={
    appName:'CloudDisk',
    error:'检查更新出错, 请联系开发人员',
    checking:'正在检查更新……',
    updateAva:'检测到新版本，正在下载……',
    updateNotAva:'现在使用的就是最新版本，不用更新',
    downloaded: '最新版本已下载，点击安装进行更新'
};
let appTray = null;//托盘变量
let trayMenuTemplate = [//托盘菜单
    {
        label: '我的网盘',//菜单显示文本项
        click: function () {
            DiskWindow.show();//显示
            DiskWindow.restore();//窗口欢迎
            DiskWindow.focus();//窗口聚焦
        }
    },
    {
        label: '系统设置',//菜单显示文本项
        click: function () {
           CreateSettingWindow();
        }
    },
    {
        label: '反馈',//菜单显示文本项
        click: function () {
            CreateFeedBackWindow();
        }
    },
    {
        label: '关于',//菜单显示文本项
        click: function () {
            CreateAboutWindow();
        }
    },
    {
        label: '退出',
        click: function () {
            DiskWindow.close();
        }
    }
];
autoUpdater.setFeedURL('http://cloud.com:100/update');
function CheckUrl(address) {
    return process.env.NODE_ENV === 'development'
        ? `http://localhost:9080/#/`+address
        : `file://${__dirname}/index.html#/`+address;
}
function CheckUpdate(event) {
    //当开始检查更新的时候触发
    autoUpdater.on('checking-for-update', function() {
        event.sender.send('check-for-update',message.checking);//返回一条信息
    });
    //当发现一个可用更新的时候触发，更新包下载会自动开始
    autoUpdater.on('update-available', function(info) {
        event.sender.send('update-down-success', info);
        event.sender.send('check-for-update',message.updateAva);//返回一条信息
    });
    //当没有可用更新的时候触发
    autoUpdater.on('update-not-available', function(info) {
        event.sender.send('check-for-update',message.updateNotAva);//返回一条信息
    });
    autoUpdater.on('error', function(error){
        event.sender.send('check-for-update',message.error);//返回一条信息
    });
    // 更新下载进度事件
    autoUpdater.on('download-progress', (progressObj)=>{
        event.sender.send('download-progress',progressObj)
    });
    autoUpdater.on('update-downloaded',  function () {
        event.sender.send('check-for-update',message.downloaded);//返回一条信息
        //通过main进程发送事件给renderer进程，提示更新信息
    });
    //执行自动更新检查
}
function CreateWindow(options) {
    let win=null;
    Menu.setApplicationMenu(null);
    win = new BrowserWindow({
        width: options.width||800,
        height: options.height||600,
        minWidth: options.minWidth,
        minHeight: options.minHeight,
        title:options.title||'CloudDisk',
        frame:false,
        x:options.x,
        y:options.y,
        minimizable:options.minimizable === undefined ? true : options.minimizable,
        maximizable:options.maximizable === undefined ? true : options.maximizable,
        resizable:options.resizable === undefined ? true : options.resizable,
        alwaysOnTop:options.alwaysOnTop === undefined ? false : options.alwaysOnTop,
        backgroundColor:options.backgroundColor||'',
        show:false,
        webPreferences:{
            webSecurity:(process.env.NODE_ENV === 'development')?false:true
        }
    });
    win.loadURL(CheckUrl(options.url));
    win.on('closed', function() {
        win = null;
        (typeof options.onclose==='function')?options.onclose():"";
    });
    win.on('ready-to-show',()=>{
        win.show();
        (typeof options.ready==='function')?options.ready():"";
    });
    win.webContents.on('did-finish-load',()=>{
        win.show();
        win.setTitle(options.title);
        (typeof options.callback==='function')?options.callback():"";
    });
    return win;
}
function CreateLoginWindow () {
    LoginWindow=CreateWindow({
        url:'/',
        title:'CloudDisk-欢迎',
        width: 850,
        height: 550,
        alwaysOnTop:true,
        maximizable:false,
        resizable:false,
    });
}
function CreateDiskWindow() {
    let trayIcon = path.join(__static, '/icons');
    appTray = new Tray(path.join(trayIcon, 'icon.ico'));
    //图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    //设置此托盘图标的悬停提示内容
    appTray.setToolTip('CloudDisk');
    //设置此图标的上下文菜单
    appTray.setContextMenu(contextMenu);
    appTray.on("click", function(){
        DiskWindow.isVisible() ? DiskWindow.hide() : DiskWindow.show();
    });
    DiskWindow=CreateWindow({
        url:'main',
        title:'CloudDisk',
        width: 950,
        minWidth:800,
        minHeight:560,
        height: 610,
        onclose:()=>{
            DiskWindow=null;
            DiskInfo?DiskInfo.close():'';
            MusicPlayer?MusicPlayer.close():'';
            VideoPlayer?VideoPlayer.close():'';
            PictureViewer?PictureViewer.close():"";
            PdfWindow?PdfWindow.close():'';
            AccountWindow?AccountWindow.close():'';
            AboutWindow?AboutWindow.close():'';
            FileWindow?FileWindow.close():'';
            FeedBackWindow?FeedBackWindow.close():'';
            SettingWindow?SettingWindow.close():'';
            appTray.destroy();
            if(!LoginWindow) {
                app.quit();
            }
        },
        callback:()=>{
            LoginWindow?LoginWindow.close():"";
        }
    });
}
function CreateDiskInfo(data) {
    if(DiskInfo){
        DiskInfo.show();
        DiskInfo.focus();
        DiskInfo.webContents.send('DiskInfo',data);
        return
    }
    DiskInfo=CreateWindow({
        url:'info',
        width: 300,
        height: 450,
        title:'文件属性',
        maximizable:false,
        minimizable:false,
        resizable:false,
        onclose:()=>{
            DiskInfo=null;
        },
        callback:()=>{
            DiskInfo.webContents.send('DiskInfo',data);
        }
    });
}
function CreateMusicPlayer(data) {
    if(MusicPlayer){
        MusicPlayer.show();
        MusicPlayer.focus();
        MusicPlayer.webContents.send('MusicList',data);
        return
    }
    MusicPlayer=CreateWindow({
        url:'music-player',
        title:'音乐播放器',
        width: 350,
        height: 535,
        maximizable:false,
        minimizable:false,
        resizable:false,
        onclose:()=>{
            MusicPlayer=null;
        },
        callback:()=>{
            MusicPlayer.webContents.send('MusicList',data);
            MusicPlayer.setThumbarButtons(MusicButtons);
        }
    });
}
function CreateVideoPlayer(data) {
    if(VideoPlayer){
        VideoPlayer.show();
        VideoPlayer.focus();
        VideoPlayer.webContents.send('VideoList',data);
        return
    }
    VideoPlayer=CreateWindow({
        url:'video-player',
        title:'视频播放器',
        width: 750,
        height: 500,
        minHeight:350,
        minWidth:500,
        onclose:()=>{
            VideoPlayer=null;
        },
        callback:()=>{
            VideoPlayer.webContents.send('VideoList',data);
            VideoPlayer.setThumbarButtons(VideoButtons);
        }
    });
}
function CreatePictureViewer(data) {
    if(PictureViewer){
        PictureViewer.show();
        PictureViewer.focus();
        PictureViewer.webContents.send('PhotoList',data);
        return
    }
    PictureViewer=CreateWindow({
        url:'picture-shower',
        title:'图片查看',
        width: 750,
        height: 500,
        minHeight:350,
        minWidth:500,
        backgroundColor:'#4f4f4f',
        onclose:()=>{
            PictureViewer=null;
        },
        callback:()=>{
            PictureViewer.webContents.send('PhotoList',data);
        }
    });
}
function CreatePdfViewer(data) {
    if(PdfWindow){
        PdfWindow.show();
        PdfWindow.focus();
        PdfWindow.webContents.send('pdf-file',data);
        return
    }
    PdfWindow=CreateWindow({
        url:'pdf-viewer',
        title:'PDF阅读器',
        width: 750,
        height: 500,
        minHeight:350,
        minWidth:500,
        backgroundColor:'#4f4f4f',
        ready:()=>{
            DiskWindow.webContents.send('pdf-load-success');
        },
        onclose:()=>{
            PdfWindow=null;
        },
        callback:()=>{
            PdfWindow.webContents.send('pdf-file',data);
        }
    });
}
function CreateAccountWindow(data) {
    if(AccountWindow){
        AccountWindow.show();
        AccountWindow.focus();
        return
    }
    Menu.setApplicationMenu(null);
    Menu.setApplicationMenu(null);
    AccountWindow=CreateWindow({
        url:'disk-account',
        title:'个人信息',
        width: 670,
        height: 420,
        maximizable:false,
        resizable:false,
        onclose:()=>{
            AccountWindow=null;
        },
        callback:()=>{
            AccountWindow.webContents.send('user-data',data);
        }
    });
}
function CreateAboutWindow() {
    if(AboutWindow){
        AboutWindow.show();
        AboutWindow.focus();
        return
    }
    AboutWindow=CreateWindow({
        url:'disk-about',
        title:'关于CloudDisk',
        width: 470,
        height: 300,
        maximizable:false,
        minimizable:false,
        resizable:false,
        onclose:()=>{
            AboutWindow=null;
        },
        callback:()=>{
            AboutWindow.webContents.send('version',version);
        }
    });
}
function CreateFileWindow(data) {
    if(FileWindow){
        FileWindow.show();
        FileWindow.focus();
        FileWindow.webContents.send('file',data);
        return
    }
    FileWindow=CreateWindow({
        url:'file-shower',
        title:'文件查看',
        width: 750,
        height: 500,
        minHeight:350,
        minWidth:500,
        onclose:()=>{
            FileWindow=null;
        },
        callback:()=>{
            FileWindow.webContents.send('file',data);
        }
    });
}
function CreateFeedBackWindow() {
    if(FeedBackWindow){
        FeedBackWindow.show();
        FeedBackWindow.focus();
        return
    }
    FeedBackWindow=CreateWindow({
        url:'disk-feedback',
        title:'问题反馈',
        width: 450,
        height: 320,
        maximizable:false,
        minimizable:false,
        resizable:false,
        onclose:()=>{
            FeedBackWindow=null;
        },
        callback:()=>{
            FeedBackWindow.webContents.send('version',version);
        }
    });
}
function CreateSettingWindow(data) {
    if(SettingWindow){
        SettingWindow.show();
        SettingWindow.focus();
        return
    }
    SettingWindow=CreateWindow({
        url:'disk-setting',
        title:'系统设置',
        width: 600,
        height: 400,
        minHeight:350,
        minWidth:500,
        maximizable:false,
        resizable:false,
        onclose:()=>{
            SettingWindow=null;
        }
    });
}
function BindIpc() {
    /*登录窗口指令*/
    ipcMain.on('login-success', ()=> {
        CreateDiskWindow();
    });
    /*网盘窗口指令*/
    ipcMain.on('disk-error', ()=> {
        CreateLoginWindow();
        DiskWindow.close();
    });
    ipcMain.on('DiskInfo', (e,msg)=> {
        CreateDiskInfo(msg)
    });
    ipcMain.on('Music-player',(e,msg)=>{
        CreateMusicPlayer(msg)
    });
    ipcMain.on('play-state',(e,msg)=>{
        if(msg==='pause') {
            MusicButtons[1].icon = PauseBtn;
            MusicButtons[1].tooltip='暂停'
        }else{
            MusicButtons[1].icon =PlayBtn;
            MusicButtons[1].tooltip='播放'
        }
        MusicPlayer.setThumbarButtons(MusicButtons);
    });
    ipcMain.on('Video-player',(e,msg)=>{
        CreateVideoPlayer(msg)
    });
    ipcMain.on('picture-viewer',(e,msg)=>{
        CreatePictureViewer(msg)
    });
    ipcMain.on('video-play-state',(e,msg)=>{
        if(msg==='pause') {
            VideoButtons[0].icon = PauseBtn;
            VideoButtons[0].tooltip='暂停'
        }else{
            VideoButtons[0].icon =PlayBtn;
            VideoButtons[0].tooltip='播放'
        }
        VideoPlayer.setThumbarButtons(VideoButtons);
    });
    ipcMain.on('pdf-viewer',(e,msg)=>{
        CreatePdfViewer(msg)
    });
    ipcMain.on('show-account',(e,msg)=>{
        CreateAccountWindow(msg);
    });
    ipcMain.on('user',(e,msg)=>{
        DiskWindow.webContents.send('user',msg);
    });
    ipcMain.on('show-about',(e,msg)=>{
        CreateAboutWindow();
    });
    ipcMain.on('show-file',(e,msg)=>{
        CreateFileWindow(msg)
    });
    ipcMain.on('show-feedback',(e,msg)=>{
        CreateFeedBackWindow();
    });
    ipcMain.on('show-setting',(e,msg)=>{
        CreateSettingWindow(msg);
    });
    /*更新*/
    /*检查更新*/
    ipcMain.on('check-for-update',(event, arg)=> {
        CheckUpdate(event);
        autoUpdater.checkForUpdates();
    });
    ipcMain.on('update', (event, arg)=> {
        autoUpdater.quitAndInstall();
    });
}

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {});
if (shouldQuit) {
    if (DiskWindow) {
        if (DiskWindow.isMinimized()) {
            DiskWindow.restore();
            DiskWindow.focus()
        }
    }
    if(LoginWindow){
        if (LoginWindow.isMinimized()) {
            LoginWindow.restore();
            LoginWindow.focus()
        }
    }
    app.quit();
}

app.on('ready', function (){
    BindIpc();
    CreateLoginWindow();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', () => {
  if (LoginWindow === null) {
      CreateLoginWindow()
  }
});