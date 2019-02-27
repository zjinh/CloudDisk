import {app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, screen} from 'electron'
import { autoUpdater } from 'electron-updater'
const path = require('path');
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let version=require("../../package.json").version;
let LoginWindow,MainWindow,DiskInfo,MusicPlayer,VideoPlayer,PictureViewer,PdfWindow,AccountWindow,AboutWindow,FileWindow,FeedBackWindow,SettingWindow,PopupWindow;
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
let appTray = null;//托盘变量
function CheckUrl(router) {
    return process.env.NODE_ENV === 'development'
        ? `http://localhost:9080/#/`+router
        : `file://${__dirname}/index.html#/`+router;
}
function CreateWindow(options,data) {
    let win=null;
    Menu.setApplicationMenu(null);
    win = new BrowserWindow({
        width: options.width||800,
        height: options.height||600,
        minWidth: options.minWidth,
        minHeight: options.minHeight,
        title:options.title||'CloudDisk',
        frame:false,
        useContentSize:options.useContentSize||false,
        transparent:options.transparent||false,
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
    win.on('closed', (event)=> {
        event.sender = null;
        win=null;
        (typeof options.onclose==='function')?options.onclose(event):"";
    });
    win.on('ready-to-show',(event)=>{
        win.show();
        win.focus();
        (typeof options.ready==='function')?options.ready(event):"";
    });
    win.callback=(data)=>{
        win.show();
        win.focus();
        (typeof options.callback==='function')?options.callback(data):"";
    };
    win.webContents.on('did-finish-load',()=>{
        win.setTitle(options.title);
        win.callback(data);
    });
    return win;
}
/*网盘函数*/
let DiskSystem= {
    LoginWindow:(flag)=>{
        if(LoginWindow){
            return LoginWindow.callback(flag);
        }
        LoginWindow=CreateWindow({
            url:'/',
            title:'CloudDisk-欢迎',
            width: 850,
            height: 550,
            alwaysOnTop:true,
            maximizable:false,
            resizable:false,
            onclose:()=>{
                LoginWindow=null;
            },
            callback:(flag)=>{
                LoginWindow.webContents.send('auto-login',flag)
            }
        },flag);
    },
    MainWindow:()=>{
        if(MainWindow){
            return MainWindow.callback();
        }
        let trayIcon = path.join(__static, '/icons');
        appTray = new Tray(path.join(trayIcon, 'icon.ico'));
        //图标的上下文菜单
        let trayMenuTemplate = [//托盘菜单
            {
                label: '我的网盘',//菜单显示文本项
                click: function () {
                    MainWindow.show();//显示
                    MainWindow.restore();//窗口欢迎
                    MainWindow.focus();//窗口聚焦
                }
            },
            {
                label: '系统设置',//菜单显示文本项
                click: function () {
                    DiskSystem.SettingWindow();
                }
            },
            {
                label: '反馈',//菜单显示文本项
                click: function () {
                    DiskSystem.FeedBackWindow();
                }
            },
            {
                label: '关于',//菜单显示文本项
                click: function () {
                    DiskSystem.AboutWindow();
                }
            },
            {
                label: '退出',
                click: function () {
                    MainWindow.show();
                    MainWindow.focus();
                    MainWindow.webContents.send('exit');
                }
            }
        ];
        const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
        //设置此托盘图标的悬停提示内容
        appTray.setToolTip('CloudDisk');
        //设置此图标的上下文菜单
        appTray.setContextMenu(contextMenu);
        appTray.on("click", function(){
            MainWindow.isVisible() ? MainWindow.hide() : MainWindow.show();
        });
        MainWindow=CreateWindow({
            url:'main',
            title:'CloudDisk',
            width: 950,
            minWidth:800,
            minHeight:560,
            height: 610,
            onclose:()=>{
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
                PopupWindow?PopupWindow.close():'';
                appTray.destroy();
                ipcMain.removeAllListeners([]);
                if(!LoginWindow) {
                    app.quit();
                }
            },
            callback:()=>{
                LoginWindow?LoginWindow.close():"";
            }
        });
    },
    AboutWindow:()=>{
        if(AboutWindow){
            return AboutWindow.callback();
        }
        AboutWindow=CreateWindow({
            url:'disk-about/'+version,
            title:'关于CloudDisk',
            width: 470,
            height: 300,
            maximizable:false,
            minimizable:false,
            resizable:false,
            onclose:()=>{
                AboutWindow=null;
            }
        });
    },
    AccountWindow:(data)=>{
        if(AccountWindow){
            return AccountWindow.callback();
        }
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
            callback:(data)=>{
                AccountWindow.webContents.send('user-data',data);
            }
        },data);
    },
    SettingWindow:()=>{
        if(SettingWindow){
            return SettingWindow.callback();
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
    },
    FeedBackWindow:()=>{
        if(FeedBackWindow){
            return FeedBackWindow.callback();
        }
        FeedBackWindow=CreateWindow({
            url:'disk-feedback/'+version,
            title:'问题反馈',
            width: 450,
            height: 320,
            maximizable:false,
            minimizable:false,
            resizable:false,
            onclose:()=>{
                FeedBackWindow=null;
            },
        });
    },
    PopupWindow:(msg)=>{
        if(PopupWindow){
            return PopupWindow.callback(msg);
        }
        PopupWindow=CreateWindow({
            url:"disk-msg",
            height: 150,
            useContentSize: true,
            width: 250,
            resizable:false,
            maximizable:false,
            frame:false,
            transparent:true,
            alwaysOnTop:true,
            x:screen.getPrimaryDisplay().workAreaSize.width-255,
            y:screen.getPrimaryDisplay().workAreaSize.height-155,
            show:false,
            onclose:()=>{
                PopupWindow=null;
            },
            callback:(msg)=>{
                PopupWindow.webContents.send('disk-popup-msg',msg);
            }
        },msg);
    },
    CheckUpdate:(event)=>{
        let message={
            appName:'CloudDisk',
            error:'检查更新出错, 请联系开发人员',
            checking:'正在检查更新……',
            updateAva:'检测到新版本，正在下载……',
            updateNotAva:'现在使用的就是最新版本，不用更新',
            downloaded: '最新版本已下载，点击安装进行更新'
        };
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
    },
    logoff:()=>{
        DiskSystem.LoginWindow(false);
        MainWindow.webContents.send('exit');
        MainWindow.close();
    },
    exit:()=>{

    },
};
function BindIpc() {
    ipcMain.on('user',(e,msg)=>{
        MainWindow.webContents.send('user',msg);
    });
    /*系统操作事件*/
    ipcMain.on('system',(event,type,data)=>{
        switch (type) {
            case 'login':
                autoUpdater.setFeedURL(data+'/update');
                DiskSystem.MainWindow();
                break;
            case 'popup':
                DiskSystem.PopupWindow(data);
                break;
            case 'account':
                DiskSystem.AccountWindow(data);
                break;
            case 'about':
                DiskSystem.AboutWindow();
                break;
            case 'feedback':
                DiskSystem.FeedBackWindow();
                break;
            case 'setting':
                DiskSystem.SettingWindow(data);
                break;
            case 'check-for-update':/*检查更新*/
                DiskSystem.CheckUpdate(event);
                autoUpdater.checkForUpdates();
                break;
            case 'update':/*安装更新*/
                autoUpdater.quitAndInstall();
                break;
            case 'logoff':
                DiskSystem.logoff();
                break;
            case 'exit':

                break;
        }
    });
    /*网盘文件操作事件*/
    ipcMain.on('file-control',(event,type,data)=>{
        switch (type) {
            case 'audio'://音频
                FileViewer.Music(data);
                break;
            case 'video'://视频
                FileViewer.Video(data);
                break;
            case 'image'://图片
                FileViewer.Image(data);
                break;
            case 'pdf':
                FileViewer.Pdf(data);
                break;
            case 'text'://文本
                FileViewer.Text(data);
                break;
            case 'attributes'://属性
                FileViewer.Attributes(data);
                break;

        }
    });
    /*播放器操作事件*/
    ipcMain.on('player-control',(event,type,data)=>{
        switch (type) {
            case 'audio':
                if(data==='pause') {
                    MusicButtons[1].icon = PauseBtn;
                    MusicButtons[1].tooltip='暂停'
                }else{
                    MusicButtons[1].icon =PlayBtn;
                    MusicButtons[1].tooltip='播放'
                }
                MusicPlayer.setThumbarButtons(MusicButtons);
                break;
            case 'video':
                if(data==='pause') {
                    VideoButtons[0].icon = PauseBtn;
                    VideoButtons[0].tooltip='暂停'
                }else{
                    VideoButtons[0].icon =PlayBtn;
                    VideoButtons[0].tooltip='播放'
                }
                VideoPlayer.setThumbarButtons(VideoButtons);
                break;
        }
    });
}
/*文件窗口函数*/
let FileViewer={
    Music:(data)=>{
        if(MusicPlayer){
            return MusicPlayer.callback(data);
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
            callback:(data)=>{
                MusicPlayer.webContents.send('MusicList',data);
                MusicPlayer.setThumbarButtons(MusicButtons);
            }
        },data);
    },
    Video:(data)=>{
        if(VideoPlayer){
            return VideoPlayer.callback(data);
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
            callback:(data)=>{
                VideoPlayer.webContents.send('VideoList',data);
                VideoPlayer.setThumbarButtons(VideoButtons);
            }
        },data);
    },
    Image:(data)=>{
        if(PictureViewer){
            return PictureViewer.callback(data);
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
            callback:(data)=>{
                PictureViewer.webContents.send('PhotoList',data);
            }
        },data);
    },
    Pdf:(data)=>{
        if(PdfWindow){
            return PdfWindow.callback(data);
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
                MainWindow.webContents.send('pdf-load-success');
            },
            onclose:()=>{
                PdfWindow=null;
            },
            callback:(data)=>{
                PdfWindow.webContents.send('pdf-file',data);
            }
        },data);
    },
    Text:(data)=>{
        if(FileWindow){
            return FileWindow.callback(data);
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
            callback:(data)=>{
                FileWindow.webContents.send('file',data);
            }
        },data);
    },
    Attributes:(data)=>{
        if(DiskInfo){
            return DiskInfo.callback(data);
        }
        DiskInfo=CreateWindow({
            url:'info',
            width: 350,
            height: 500,
            title:'文件属性',
            maximizable:false,
            minimizable:false,
            resizable:false,
            onclose:()=>{
                DiskInfo=null;
            },
            callback:(data)=>{
                DiskInfo.webContents.send('DiskInfo',data);
            }
        },data);
    }
};
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if(LoginWindow){
            LoginWindow.show();
            LoginWindow.restore();
            LoginWindow.focus()
        }
        if (MainWindow) {
            MainWindow.show();
            MainWindow.restore();
            MainWindow.focus()
        }
    });
    app.on('ready', function (){
        DiskSystem.LoginWindow(true);
        BindIpc();
    });
}
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', () => {
  if (LoginWindow === null) {
      DiskSystem.LoginWindow(true)
  }
});