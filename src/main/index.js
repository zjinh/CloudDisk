import { app, BrowserWindow,ipcMain,Menu,Tray,autoUpdater } from 'electron'
const path = require('path');

//import { autoUpdater } from 'electron-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

//const autoUpdater = require('electron-updater').autoUpdater;
let LoginWindow,DiskWindow,SettingWindow;
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
    : `file://${__dirname}/main.html`;
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
    autoUpdater.on('download-progress', function(progressObj) {
        //这个事件无法使用
        mainWindow.webContents.send('download-progress',progressObj)
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
        useContentSize: true,
        maximizable:false,
        resizable:false,
        webPreferences:{
            webSecurity:false
        }
    });
    LoginWindow.loadURL(LoginURL);
    LoginWindow.on('closed', function() {
        LoginWindow = null;
    });
}
function CreateDiskWindow() {
    Menu.setApplicationMenu(null);
    let trayIcon = path.join(__dirname, '../../static/icons');
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
        backgroundColor:'#2682fc',
        frame:false,
        webPreferences:{
            webSecurity:false
        }
    });
    DiskWindow.loadURL(DiskURL);
    DiskWindow.webContents.openDevTools();
    DiskWindow.on('closed', function() {
        DiskWindow = null;
    });
    DiskWindow.on('maximize',function () {
        DiskWindow.webContents.send('size', 1);
    });
    DiskWindow.on('unmaximize',function () {
        DiskWindow.webContents.send('size', -1);
    });
}
function BindIpc() {
    /*登录窗口*/
    ipcMain.on('login-success', function () {
        LoginWindow.setSize(800,300);
        let a=setTimeout(function () {
            clearTimeout(a);
            CreateDiskWindow();
            LoginWindow.close();
        },2000)
    });
    ipcMain.on('login-mini', function () {
        LoginWindow.minimize();
    });
    ipcMain.on('login-close', function () {
        app.quit()
    });
    /*网盘窗口*/
    ipcMain.on('disk-mini', function () {
        DiskWindow.minimize();
    });
    ipcMain.on('disk-error', function () {
        CreateLoginWindow();
        DiskWindow.close();
    });
    ipcMain.on('disk-change',function () {
        if (DiskWindow.isMaximized()) {
            DiskWindow.restore();
        } else {
            DiskWindow.maximize();
        }
    });
    ipcMain.on('disk-close', function () {
        DiskWindow.hide()
    });
    /*更新*/
    /*检查更新*/
    ipcMain.on('check-for-update', function(event, arg) {
        CheckUpdate(event);
        autoUpdater.checkForUpdates();
    });
    ipcMain.on('update', function(event, arg) {
        autoUpdater.quitAndInstall();
    });
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
