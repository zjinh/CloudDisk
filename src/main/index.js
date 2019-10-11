import {app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, screen,session } from 'electron'
import { autoUpdater } from 'electron-updater'
import LocalFile from "../renderer/tools/api/LocalFile";
import User from "../renderer/tools/api/User";
const path = require('path');
let TransDownFolder=process.env.USERPROFILE;
let DownloadList={};
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
        tooltip: '上一首',
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
        tooltip: '下一首',
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
/*窗口控制函数*/
let WindowControl={
    New:(options)=>{
        Menu.setApplicationMenu(null);
        let defaultOptions={
            width: 800,
            height: 600,
            title:'CloudDisk',
            frame:false,
            useContentSize:false,
            transparent:false,
            minimizable: true ,
            maximizable:true,
            resizable: true,
            alwaysOnTop:false,
            show:false,
            webPreferences:{
                nodeIntegration:true,
                webSecurity:!(process.env.NODE_ENV === 'development')
            }
        };
        options=Object.assign(defaultOptions, options);
        let win = new BrowserWindow(options);
        options.backgroundColor&&(win.backgroundColor=options.backgroundColor);
        win.name=options.url;
        win.loadURL(WindowControl.CheckRouter(options.url));
        win.callback=(data)=>{
            win.webContents.send('win-data',data);
            (typeof options.callback==='function')?options.callback():"";
        };
        win.on('closed', (event)=> {
            win=null;
            (typeof options.onclose==='function')?options.onclose(event):"";
        });
        win.on('ready-to-show',(event)=>{
            win.show();
            win.focus();
            (typeof options.ready==='function')?options.ready(event):"";
        });
        win.webContents.on('did-finish-load',()=>{
            win.setTitle(options.title || 'CloudDisk');
            win.callback(options.data||'无数据');
        });
        return win;
    },
    CheckRouter:(router)=>{
        return process.env.NODE_ENV === 'development'
            ? `http://localhost:9080/#/`+router
            : `file://${__dirname}/index.html#/`+router;
    },
    Active:(win,data)=>{
        if(win) {
            win.show();
            win.focus();
            data&&win.callback(data);
        }
    }
};
/*网盘函数*/
function FileObject(item,state){
    return {
        id:Math.round(item.getStartTime()),
        url:item.getURLChain(),
        time:item.getStartTime(),
        name:item.fileName,
        path:item.path,
        chunk:item.getReceivedBytes(),
        size:item.getTotalBytes(),
        trans_type: 'download',
        state:state||item.getState(),
        disk_main:item.getURL(),
        canResume:item.canResume(),
        shows:true,
    }
}
let DiskSystem= {
    LoginWindow:(flag)=>{
        if(LoginWindow){
            return WindowControl.Active(LoginWindow,flag);
        }
        LoginWindow=WindowControl.New({
            url:'/',
            data:flag,
            title:'CloudDisk-欢迎',
            width: 850,
            height: 550,
            alwaysOnTop:true,
            maximizable:false,
            resizable:false,
            onclose:()=>{
                LoginWindow=null;
            },
        });
    },
    MainWindow:(data)=>{
        if(MainWindow){
            return WindowControl.Active(MainWindow,data);
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
        MainWindow=WindowControl.New({
            url:'main',
            data:data,
            title:'CloudDisk',
            width: 950,
            minWidth:800,
            minHeight:560,
            height: 610,
            onclose:()=>{
                MainWindow=null;
                let wins=BrowserWindow.getAllWindows();
                for(let i=0;i<wins.length;i++){
                    if(wins[i].name!=='/') {
                        wins[i] ? wins[i].close() : '';
                    }
                }
                appTray.destroy();
                if(!LoginWindow) {
                    app.quit();
                }
                session.defaultSession.removeAllListeners('will-download');
            },
            callback:()=>{
                LoginWindow?LoginWindow.close():"";
                LocalFile.read('setting',(data)=>{
                    TransDownFolder=data.TransDownFolder||process.env.HOME;
                })
            }
        });
    },
    AboutWindow:()=>{
        if(AboutWindow){
            return WindowControl.Active(AboutWindow);
        }
        AboutWindow=WindowControl.New({
            url:'disk-about/'+version,
            title:'关于CloudDisk',
            width: 600,
            height: 330,
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
            return WindowControl.Active(AccountWindow,data);
        }
        AccountWindow=WindowControl.New({
            url:'disk-account',
            data:data,
            title:'个人信息',
            width: 670,
            height: 420,
            maximizable:false,
            resizable:false,
            onclose:()=>{
                AccountWindow=null;
            }
        });
    },
    SettingWindow:()=>{
        if(SettingWindow){
            return WindowControl.Active(SettingWindow);
        }
        SettingWindow=WindowControl.New({
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
            return WindowControl.Active(FeedBackWindow);
        }
        FeedBackWindow=WindowControl.New({
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
            return WindowControl.Active(PopupWindow,msg);
        }
        PopupWindow=WindowControl.New({
            url:"disk-msg",
            data:msg,
            width: 300,
            height: 150,
            useContentSize: true,
            resizable:false,
            maximizable:false,
            transparent:true,
            alwaysOnTop:true,
            x:screen.getPrimaryDisplay().workAreaSize.width-305,
            y:screen.getPrimaryDisplay().workAreaSize.height-155,
            onclose:()=>{
                PopupWindow=null;
            }
        });
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
        autoUpdater.on('update-not-available', function() {
            event.sender.send('check-for-update',message.updateNotAva);//返回一条信息
        });
        autoUpdater.on('error', function(){
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
    /*系统操作事件*/
    ipcMain.on('system',(event,type,data)=>{
        switch (type) {
            case 'login':
                DiskSystem.MainWindow(data);
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
                autoUpdater.setFeedURL(data);
                DiskSystem.CheckUpdate(event);
                autoUpdater.checkForUpdates();
                break;
            case 'update':/*安装更新*/
                autoUpdater.quitAndInstall();
                break;
            case 'user-update':
                MainWindow.webContents.send('user-update',data);
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
    /*下载事件控制*/
    ipcMain.on('download',(event,type,data)=>{
        let downloadItem=DownloadList[data];
        if(downloadItem===undefined){
            return
        }
        switch (type) {
            case 'pause':
                downloadItem.pause();
                break;
            case 'cancel':
                downloadItem.cancel();
                break;
            case 'resume':
                if(downloadItem.canResume()){
                    downloadItem.resume();
                }
                break;
        }
    });
    session.defaultSession.removeAllListeners('will-download');
    session.defaultSession.on('will-download', (event, item, webContents) => {
        let name=decodeURI(item.getURLChain().toString().split('?disk_name=')[1])||item.getFilename();
        item.fileName=name;
        item.path=TransDownFolder+'/'+name;
        item.setSavePath(TransDownFolder+'/'+name); // 设置保存路径,使Electron不提示保存对话框。
        item.on('updated', () => {
            DownloadList[Math.round(item.getStartTime())]=item;
            let file=FileObject(item,item.isPaused()?'interrupted':false);
            webContents&&webContents.send('download',file);
        });
        item.once('done', (event, state) => {
            let file=FileObject(item,item.isPaused()?'interrupted':false);
            webContents&&webContents.send('download',file);
            if (state === 'completed') {
                delete DownloadList[Math.round(item.getStartTime())];
            } else {
                console.log(`Download failed: ${state}`)
            }
        })
    })
}
/*文件窗口函数*/
let FileViewer={
    Music:(data)=>{
        if(MusicPlayer){
            return WindowControl.Active(MusicPlayer,data);
        }
        MusicPlayer=WindowControl.New({
            url:'music-player',
            data:data,
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
                MusicPlayer.setThumbarButtons(MusicButtons);
            }
        });
    },
    Video:(data)=>{
        if(VideoPlayer){
            return WindowControl.Active(VideoPlayer,data);
        }
        VideoPlayer=WindowControl.New({
            url:'video-player',
            data:data,
            title:'视频播放器',
            width: 750,
            height: 500,
            minHeight:350,
            minWidth:500,
            onclose:()=>{
                VideoPlayer=null;
            },
            callback:()=>{
                VideoPlayer.setThumbarButtons(VideoButtons);
            }
        });
    },
    Image:(data)=>{
        if(PictureViewer){
            return WindowControl.Active(PictureViewer,data);
        }
        PictureViewer=WindowControl.New({
            url:'picture-shower',
            data:data,
            title:'图片查看',
            width: 750,
            height: 500,
            minHeight:350,
            minWidth:500,
            backgroundColor:'#4f4f4f',
            onclose:()=>{
                PictureViewer=null;
            }
        });
    },
    Pdf:(data)=>{
        if(PdfWindow){
            return WindowControl.Active(PdfWindow,data);
        }
        PdfWindow=WindowControl.New({
            url:'pdf-viewer',
            data:data,
            title:'PDF阅读器',
            width: 750,
            height: 500,
            minHeight:350,
            minWidth:500,
            backgroundColor:'#4f4f4f',
            onclose:()=>{
                PdfWindow=null;
            }
        });
    },
    Text:(data)=>{
        if(FileWindow){
            return WindowControl.Active(FileWindow,data);
        }
        FileWindow=WindowControl.New({
            url:'file-shower',
            data:data,
            title:'文件查看',
            width: 750,
            height: 500,
            minHeight:350,
            minWidth:500,
            onclose:()=>{
                FileWindow=null;
            }
        });
    },
    Attributes:(data)=>{
        if(DiskInfo){
            return WindowControl.Active(DiskInfo,data);
        }
        DiskInfo=WindowControl.New({
            url:'info',
            data:data,
            width: 600,
            height: 390,
            title:'文件属性',
            maximizable:false,
            minimizable:false,
            resizable:false,
            onclose:()=>{
                DiskInfo=null;
            }
        });
    }
};
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', () => {
        if(LoginWindow){
            LoginWindow.show();
            LoginWindow.restore();
            LoginWindow.focus();
            return
        }
        if (MainWindow) {
            MainWindow.show();
            MainWindow.restore();
            MainWindow.focus();
        }
    });
    app.on('ready', function (){
        BindIpc();
        app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
        LocalFile.read('login',(data,err)=>{
            if(err){
                DiskSystem.LoginWindow({
                    username:"",password:""
                });
            }else{
                if(!data.username){
                    return DiskSystem.LoginWindow(data);
                }
                User.Login(data,()=>{
                    DiskSystem.MainWindow(data);
                },()=>{
                    DiskSystem.LoginWindow(data);
                })
            }
        },true);
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
