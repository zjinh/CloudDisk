import axios from 'axios'
import {Message} from "iview";
axios.defaults.withCredentials=true;
axios.interceptors.response.use(function (response) {
// 对响应数据做点什么
    return response;
}, function (err) {
    if (err && err.response) {
        switch (err.response.status) {
            case 400: err.message = '请求错误(400)' ; break;
            case 401: err.message = '未授权，请重新登录(401)'; break;
            case 403: err.message = '拒绝访问(403)'; break;
            case 404: err.message = '请求出错(404)'; break;
            case 408: err.message = '请求超时(408)'; break;
            case 500: err.message = '服务器错误(500)'; break;
            case 501: err.message = '服务未实现(501)'; break;
            case 502: err.message = '网络错误(502)'; break;
            case 503: err.message = '服务不可用(503)'; break;
            case 504: err.message = '网络超时(504)'; break;
            case 505: err.message = 'HTTP版本不受支持(505)'; break;
            default: err.message = `连接出错(${err.response.status})!`;
        }
    }else{
        err.message = '连接服务器失败，请检查网络连接或联系管理员'
    }
    Message.error(err.message);
    return Promise.reject(err);
});
const path =require("path");
const fs= require('fs');
let address=process.env.HOMEDRIVE+process.env.HOMEPATH+'/CloudDisk\/';//用户文件地址
let prefix=path.join(__static, '/img/disk/');
function Ajax(options) {
    let params = new URLSearchParams();
    let method= options.method?options.method:'POST';
    if(method==='POST'&&!options.upload){
        for(let item in options.data){
            params.append(item, options.data[item]);
        }
    }else{
        params=options.data;
    }
    axios({
        method: method,
        data: params,
        emulateJSON:true,
        withCredentials:true,
        url: options.url,
        headers:options.upload?{"Content-Type": "application/x-www-form-urlencoded"}:{},
    }).then((response) => {
        options.success&&typeof options.success==='function'?options.success(response.data):'';
    },function (error) {
        options.error&&typeof options.error==='function'?options.error(error):'';
    });
}
function StringExist (str, substr) {
    if(typeof str !== "string"){ return; }
    if(substr==='|*|'){return true}
    if(substr.split(',').length>1) {
        for (let i = 0; i < substr.split(',').length; i++) {
            if (str.indexOf(substr.split(',')[i]) >= 0 === true) {
                return true;
            }
        }
    }else {
        return (str===substr);
    }
    return false;
}
function StringBefore (str,substr) {
    return str.substring(str.lastIndexOf(substr) + 1, str.length);
}
function FileSize (bytes) {
    bytes=parseFloat(bytes);
    if (bytes === 0) return '0B';
    let k = 1024,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
}
//ini未写入
let FileType={
    android:{
        TypeArray:'apk',
        FileIcon:prefix+'ApkType.png'
    },
    pdf:{
        TypeArray:'pdf',
        FileIcon:prefix+'PdfType.png'
    },
    torrent:{
        TypeArray:'torrent',
        FileIcon:prefix+'BtType.png'
    },
    vcf:{
        TypeArray:'vcf',
        FileIcon:prefix+'VcfType.png'
    },
    txt:{
        TypeArray:'txt',
        FileIcon:prefix+'TxtType.png'
    },
    html:{
        TypeArray:'htm,html',
        FileIcon:prefix+'html.png'
    },
    exe:{
        TypeArray:'exe,msi',
        FileIcon:prefix+'exe.png'
    },
    word:{
        TypeArray:'doc,docx',
        FileIcon:prefix+'DocType.png'
    },
    PowerPoint:{
        TypeArray:'ppt,pptx',
        FileIcon:prefix+'PptType.png'
    },
    excel:{
        TypeArray:'xls,xlsx',
        FileIcon:prefix+'ExcelType.png'
    },
    video:{
        TypeArray:'mp4,rmvb,mkv',
        FileIcon:prefix+'VideoType.png'
    },
    image:{
        TypeArray:'apng,png,jpg,jpeg,bmp,gif',
        FileIcon:prefix+'ImageType.png'
    },
    music:{
        TypeArray:'m4a,mp3,ogg,flac,f4a,wav,ape,ncm',
        FileIcon:prefix+'MusicType.png'
    },
    compress:{
        TypeArray:'7z,zip,rar,tar.gz',
        FileIcon:prefix+'RarType.png'
    }
};
function DiskData(item){
    item.active=false;//设置未选择
    item.$size=FileSize(item.disk_size);//计算文件大小
    item.disk_size=parseInt(item.disk_size);
    item.disk_main?item.disk_main=localStorage.server+'/'+item.disk_main:"";
    item.shareAddress=item.share?localStorage.server + '/s/' + item.share:"";
    item.$icon = prefix+'OtherType.png';//初始化为其他图标
    item.OpenType=null;//初始化为无法打开的文件
    let type = StringBefore(item.disk_realname||item.disk_main, ".").toLowerCase();
    item.type=type;
    if(item.disk_main) {
        for (let i in FileType) {
           if (StringExist(type, FileType[i].TypeArray)) {
               item.$icon = FileType[i].FileIcon
           }
        }
        if (item.type==='zip') {
            item.OpenType='zip';
        }
        else if (item.type==='pdf') {
            item.OpenType='pdf';
        }
        else if (StringExist(item.type, 'apng,png,jpg,jpeg,bmp,gif')) {
            item.TypeArray='apng,png,jpg,jpeg,bmp,gif';
            item.OpenType='image';
        }
        else if (StringExist(item.type, 'mp4,rmvb,mkv')) {
            item.TypeArray='mp4,rmvb,mkv';
            item.OpenType='video';
        }
        else if (StringExist(item.type, 'm4a,mp3,ogg,flac,f4a,wav,ape')) {
            item.TypeArray='m4a,mp3,ogg,flac,f4a,wav,ape';
            item.OpenType='audio';
        }
        else if (StringExist(item.type, 'ini,txt,xml,aspx,php,phtml,js,c,htm,html,log,c,cpp,java')) {
            item.OpenType='text';
        }
    }else{
        item.$icon=prefix+'FolderType.png';
    }
}
function age(birth){
    birth = Date.parse(birth?birth:"".replace('/-/g', "/"));
    return parseInt((new Date() - new Date(birth)) / (1000 * 60 * 60 * 24 * 365));
}
let User={
    Login:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/user/login",
            data:data,
            success:(rs)=>{
                rs[0].head=localStorage.server+'/'+rs[0].head+'?'+Date.now();
                callback(rs);
            },
            error:error
        })
    },
    Register:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/user/register",
            data:data,
            success:callback,
            error:error
        })
    },
    Forget:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/user/forget",
            data:data,
            success:callback,
            error:error
        })
    },
    Verify:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/user/verifyCheck",
            data:data,
            success:callback,
            error:error
        })
    },
    UserInfo:function (callback,error) {
        Ajax({
            url:localStorage.server+"/service/user/UserInfo",
            data:[],
            success:(rs)=>{
                rs[0].birth=age(rs[0].birthday);
                rs[0].userhead=localStorage.server+'/'+rs[0].userhead+'?'+Date.now();
                callback(rs);
            },
            error:error
        })
    },
    ReSend:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/user/resend",
            data:data,
            success:callback,
            error:error
        })
    },
    Update:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/user/UpdateUserInfo",
            data:data,
            upload:true,
            success:callback,
            error:error
        })
    },
    FeedBack:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/user/SendCouple",
            data:data,
            success:callback,
            error:error
        })
    },
    ChangePass:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/user/ChangePass",
            data:data,
            success:callback,
            error:error
        })
    },
    ChangeSafeEmail:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/user/ChangeSafeEmail",
            data:data,
            success:callback,
            error:error
        })
    },
};
let Disk={
    LoadTreeFile:function (id,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/GetTreeFile",
            data:{
                disk_id:id
            },
            success:callback,
            error:error
        })
    },
    LoadMainFile:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/GetMainFile",
            data:data,
            success:(rs)=>{
                rs.forEach((item)=>{
                    DiskData(item);
                });
                callback(rs)
            },
            error:error
        })
    },
    UnZip:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/UnZipFile",
            data:data,
            success:(rs)=>{
                rs[0]&&rs[0].data?DiskData(rs[0].data):'';
                callback(rs)
            },
            error:error
        })
    },
    Search:function (data,callback,error) {
        data.loadtype='search';
        Ajax({
            url:localStorage.server+"/service/disk/GetMainFile",
            data:data,
            success:(rs)=>{
                rs.forEach((item)=>{
                    DiskData(item);
                });
                callback(rs)
            },
            error:error
        })
    },
    NewFolder:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/NewFolder",
            data:data,
            success:(rs)=>{
                rs.forEach((item)=>{
                    DiskData(item);
                });
                callback(rs)
            },
            error:error
        })
    },
    Copy:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/CopyFile",
            data:data,
            success:callback,
            error:error
        })
    },
    Cut:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/MoveFile",
            data:data,
            success:callback,
            error:error
        })
    },
    Rename:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/RenameFile",
            data:data,
            success:callback,
            error:error
        })
    },
    Trash:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/TrashFile",
            data:data,
            success:callback,
            error:error
        })
    },
    Delete:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/DeleteFile",
            data:data,
            success:callback,
            error:error
        })
    },
    Restore:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/RestoreFile",
            data:data,
            success:callback,
            error:error
        })
    },
    Address:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/AddresFile/"+data,
            method:'get',
            success:callback,
            error:error
        })
    },
    Share:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/ShareFile",
            data:data,
            success:callback,
            error:error
        })
    },
    CancelShare:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/CancelShareFile",
            data:data,
            success:callback,
            error:error
        })
    },
    OpenFile:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/OpenFile",
            data:data,
            success:callback,
            error:error
        })
    },
    GetLyr:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/api/disk/lrc",
            data:data,
            success:callback,
            error:error
        })
    },
    Download:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/Download",
            data:data,
            success:callback,
            error:error
        })
    },
    Upload:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/upload",
            data:data,
            upload:true,
            success:(rs)=>{
                rs.data?DiskData(rs.data):"";
                callback(rs)
            },
            error:error
        })
    },
};
let LocalFile={
    User:null,
    AccountFile:{},//用户本地文件对象
    Exist(user){
        fs.exists(address,(exists)=>{
            if(!exists){
                fs.mkdir(address,(err)=>{});
            }
        });
        fs.exists(address+user,(exists)=>{
            if(!exists){
                fs.mkdir(address+user,(err)=>{
                   this.Create(address+user+'/')
                });
            }else{
                this.Create(address+user+'/')
            }
        });
        localStorage.User=user;
    },
    Create(location){
        location=location?location:address+localStorage.User+'/';
        this.AccountFile={};
        let File=['user','transfer','setting'];
        let content={};
        File.forEach((item)=>{
            this.AccountFile[item]=location+item+".json";
            fs.exists(location+item+".json",(exists)=>{
                if(!exists){
                    fs.writeFile(location+item+".json",JSON.stringify(content),(err)=>{
                    });
                }
            });
        });
    },
    Read(type,callback){
        this.Create(this.User);
        return new Promise((resolve, reject)=>{
            fs.readFile(this.AccountFile[type],{flag:'r+',encoding:'utf8'},(err,data)=>{
                data=JSON.parse(data);
                callback&&callback(data);
                resolve(data);
            })
        })
    },
    Write(type,data){
        this.Create(this.User);
        fs.writeFile(this.AccountFile[type],JSON.stringify(data), (err)=>{});
    }
};
let Check=function (url,callback,error) {
    Ajax({
        url:url,
        data:[],
        success:callback,
        error:error
    })
};
let VerifyCod=function(){
    return localStorage.server+"/service/verifyCode"+'?'+Math.random();
};
export default {
    User,Disk,Check,StringExist,StringBefore,FileSize,VerifyCod,LocalFile
}