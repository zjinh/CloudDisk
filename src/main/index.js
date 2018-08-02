import { app, BrowserWindow,ipcMain,Menu,Tray,nativeImage } from 'electron'
const path = require('path');
import { autoUpdater } from 'electron-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

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
        label: '退出',
        click: function () {
            DiskWindow.close();
        }
    }
];
autoUpdater.setFeedURL('http://cloud.com:100/update');
const LoginURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;
const DiskURL= process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/main`
    : `file://${__dirname}/index.html#/main`;
const InfoURL= process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/info`
    : `file://${__dirname}/index.html#/info`;
const MusicPlayerURL= process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/music-player`
    : `file://${__dirname}/index.html#/music-player`;
const VideoPlayerURL= process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/video-player`
    : `file://${__dirname}/index.html#/video-player`;
const PdfViewerUrl= process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/pdf-viewer`
    : `file://${__dirname}/index.html#/pdf-viewer`;
const AccountUrl= process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/disk-account`
    : `file://${__dirname}/index.html#/disk-account`;
const AboutUrl= process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/disk-about`
    : `file://${__dirname}/index.html#/disk-about`;
const PictureShowerUrl= process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/picture-shower`
    : `file://${__dirname}/index.html#/picture-shower`;
const FileShowerUrl= process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/file-shower`
    : `file://${__dirname}/index.html#/file-shower`;
const FeedBackUrl=process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/disk-feedback`
    : `file://${__dirname}/index.html#/disk-feedback`;
const SettingWindowUrl=process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/disk-setting`
    : `file://${__dirname}/index.html#/disk-setting`;
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
        //这个事件无法使用
        console.log(event)
        event.sender.send('download-progress',progressObj)
    });
    autoUpdater.on('update-downloaded',  function () {
        event.sender.send('check-for-update',message.downloaded);//返回一条信息
        //通过main进程发送事件给renderer进程，提示更新信息
    });
    //执行自动更新检查
}
function CreateLoginWindow () {
    Menu.setApplicationMenu(null);
    LoginWindow = new BrowserWindow({
        width: 850,
        height: 550,
        title:'CloudDisk-登录',
        frame:false,
        maximizable:false,
        resizable:false,
        webPreferences:{
            webSecurity:(process.env.NODE_ENV === 'development')?false:true
        }
    });
    LoginWindow.loadURL(LoginURL);
    LoginWindow.on('closed', function() {
        LoginWindow = null;
    });
}
function CreateDiskWindow() {
    Menu.setApplicationMenu(null);
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
    DiskWindow = new BrowserWindow({
        width: 950,
        minWidth:800,
        minHeight:610,
        height: 610,
        title:'CloudDisk',
        frame:false,
        webPreferences:{
            webSecurity:(process.env.NODE_ENV === 'development')?false:true
        }
    });
    DiskWindow.loadURL(DiskURL);
    DiskWindow.on('closed', function() {
        DiskWindow = null;
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
    });
}
function CreateDiskInfo(data) {
    Menu.setApplicationMenu(null);
    Menu.setApplicationMenu(null);
    let id= 'DiskInfo'+data.disk_id;
    if(DiskInfo){
        DiskInfo.show();
        DiskInfo.focus();
        DiskInfo.webContents.send('DiskInfo',data);
        return
    }
    DiskInfo= new BrowserWindow({
        id:id,
        width: 300,
        height: 450,
        title:'文件属性',
        maximizable:false,
        minimizable:false,
        resizable:false,
        frame:false,
        webPreferences:{
            webSecurity:(process.env.NODE_ENV === 'development')?false:true
        },
    });
    DiskInfo.loadURL(InfoURL);
    DiskInfo.on('closed', function() {
        DiskInfo = null;
    });
    DiskInfo.webContents.on('did-finish-load', ()=>{
        DiskInfo.webContents.send('DiskInfo',data);
    });
}
function CreateMusicPlayer(data) {
    if(MusicPlayer){
        MusicPlayer.show();
        MusicPlayer.focus();
        MusicPlayer.webContents.send('MusicList',data);
        return
    }
    Menu.setApplicationMenu(null);
    Menu.setApplicationMenu(null);
    MusicPlayer= new BrowserWindow({
        width: 350,
        height: 500,
        title:'音乐播放器',
        maximizable:false,
        minimizable:false,
        resizable:false,
        frame:false,
        webPreferences:{
            webSecurity:(process.env.NODE_ENV === 'development')?false:true
        },
    });
    MusicPlayer.setThumbarButtons(MusicButtons);
    MusicPlayer.loadURL(MusicPlayerURL);
    MusicPlayer.on('closed', function() {
        MusicPlayer = null;
    });
    MusicPlayer.webContents.on('did-finish-load', ()=>{
        MusicPlayer.webContents.send('MusicList',data);
    });
}
function CreateVideoPlayer(data) {
    if(VideoPlayer){
        VideoPlayer.show();
        VideoPlayer.focus();
        VideoPlayer.webContents.send('VideoList',data);
        return
    }
    Menu.setApplicationMenu(null);
    Menu.setApplicationMenu(null);
    VideoPlayer= new BrowserWindow({
        width: 750,
        height: 500,
        minHeight:350,
        minWidth:500,
        title:'视频播放器',
        frame:false,
        webPreferences:{
            webSecurity:(process.env.NODE_ENV === 'development')?false:true
        },
    });
    VideoPlayer.setThumbarButtons(VideoButtons);
    VideoPlayer.loadURL(VideoPlayerURL);
    VideoPlayer.on('closed', function() {
        VideoPlayer = null;
    });
    VideoPlayer.webContents.on('did-finish-load', ()=>{
        VideoPlayer.webContents.send('VideoList',data);
    });
}
function CreatePictureViewer(data) {
    if(PictureViewer){
        PictureViewer.show();
        PictureViewer.focus();
        PictureViewer.webContents.send('PhotoList',data);
        return
    }
    Menu.setApplicationMenu(null);
    Menu.setApplicationMenu(null);
    PictureViewer= new BrowserWindow({
        width: 750,
        height: 500,
        minHeight:350,
        minWidth:500,
        title:'图片查看',
        backgroundColor:'#4f4f4f',
        frame:false,
        webPreferences:{
            webSecurity:(process.env.NODE_ENV === 'development')?false:true
        },
    });
    PictureViewer.loadURL(PictureShowerUrl);
    PictureViewer.on('closed', function() {
        PictureViewer = null;
    });
    PictureViewer.webContents.on('did-finish-load', ()=>{
        PictureViewer.webContents.send('PhotoList',data);
    });
}
function CreatePdfViewer(data) {
    if(PdfWindow){
        PdfWindow.show();
        PdfWindow.focus();
        PdfWindow.webContents.send('pdf-file',data);
        return
    }
    Menu.setApplicationMenu(null);
    Menu.setApplicationMenu(null);
    PdfWindow= new BrowserWindow({
        width: 750,
        height: 500,
        minHeight:350,
        minWidth:500,
        title:'PDF阅读器',
        frame:false,
        webPreferences:{
            webSecurity:(process.env.NODE_ENV === 'development')?false:true
        },
        show:false
    });
    PdfWindow.loadURL(PdfViewerUrl);
    PdfWindow.on('closed', function() {
        PdfWindow = null;
    });
    PdfWindow.on('ready-to-show',()=>{
        PdfWindow.show();
        DiskWindow.webContents.send('pdf-load-success');
    });
    PdfWindow.webContents.on('did-finish-load', ()=>{
        PdfWindow.webContents.send('pdf-file',data);
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
    AccountWindow= new BrowserWindow({
        width: 670,
        height: 420,
        title:'个人信息',
        maximizable:false,
        resizable:false,
        frame:false,
        webPreferences:{
            webSecurity:(process.env.NODE_ENV === 'development')?false:true
        }
    });
    AccountWindow.loadURL(AccountUrl);
    AccountWindow.on('closed', function() {
        AccountWindow = null;
    });
    AccountWindow.webContents.on('did-finish-load', ()=>{
        AccountWindow.webContents.send('user-data',data);
    });
}
function CreateAboutWindow() {
    if(AboutWindow){
        AboutWindow.show();
        AboutWindow.focus();
        return
    }
    Menu.setApplicationMenu(null);
    Menu.setApplicationMenu(null);
    AboutWindow= new BrowserWindow({
        width: 470,
        height: 300,
        title:'关于CloudDisk',
        maximizable:false,
        minimizable:false,
        resizable:false,
        frame:false,
        webPreferences:{
            webSecurity:(process.env.NODE_ENV === 'development')?false:true
        }
    });
    AboutWindow.loadURL(AboutUrl);
    AboutWindow.on('closed', function() {
        AccountWindow = null;
    });
    AboutWindow.webContents.on('did-finish-load', ()=>{
        AboutWindow.webContents.send('version',require("../../package.json").version);
    });
}
function CreateFileWindow(data) {
    if(FileWindow){
        FileWindow.show();
        FileWindow.focus();
        FileWindow.webContents.send('file',data);
        return
    }
    Menu.setApplicationMenu(null);
    Menu.setApplicationMenu(null);
    FileWindow= new BrowserWindow({
        width: 750,
        height: 500,
        minHeight:350,
        minWidth:500,
        title:'文件查看',
        frame:false,
        webPreferences:{
            webSecurity:(process.env.NODE_ENV === 'development')?false:true
        }
    });
    FileWindow.loadURL(FileShowerUrl);
    FileWindow.on('closed', function() {
        FileWindow = null;
    });
    FileWindow.webContents.on('did-finish-load', ()=>{
        FileWindow.webContents.send('file',data);
    });
}
function CreateFeedBackWindow() {
    if(FeedBackWindow){
        FeedBackWindow.show();
        FeedBackWindow.focus();
        return
    }
    Menu.setApplicationMenu(null);
    Menu.setApplicationMenu(null);
    FeedBackWindow= new BrowserWindow({
        width: 470,
        height: 320,
        minHeight:320,
        minWidth:500,
        title:'问题反馈',
        maximizable:false,
        minimizable:false,
        resizable:false,
        frame:false,
        webPreferences:{
            webSecurity:(process.env.NODE_ENV === 'development')?false:true
        }
    });
    FeedBackWindow.loadURL(FeedBackUrl);
    FeedBackWindow.on('closed', function() {
        FeedBackWindow = null;
    });
    FeedBackWindow.webContents.on('did-finish-load', ()=>{
        FeedBackWindow.webContents.send('version',require("../../package.json").version);
    });
}
function CreateSettingWindow(data) {
    if(SettingWindow){
        SettingWindow.show();
        SettingWindow.focus();
        return
    }
    Menu.setApplicationMenu(null);
    Menu.setApplicationMenu(null);
    SettingWindow= new BrowserWindow({
        width: 750,
        height: 500,
        minHeight:350,
        minWidth:500,
        title:'系统设置',
        frame:false,
        webPreferences:{
            webSecurity:(process.env.NODE_ENV === 'development')?false:true
        }
    });
    SettingWindow.loadURL(SettingWindowUrl);
    SettingWindow.on('closed', function() {
        SettingWindow = null;
    });
}
function BindIpc() {
    /*登录窗口指令*/
    ipcMain.on('login-success', ()=> {
        let a=setTimeout(function () {
            clearTimeout(a);
            CreateDiskWindow();
            LoginWindow.close();
        },2000)
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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
