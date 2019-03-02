import axios from 'axios'
const path =require("path");
const fs= require('fs');
let AccountFile=null;
let address=process.env.HOMEDRIVE+process.env.HOMEPATH+'/CloudDisk\/';//用户文件地址
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
    for(let i=0;i<substr.split(',').length;i++){
        if(str.indexOf(substr.split(',')[i]) >= 0 === true ){ return true; }
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
function IconGet (item) {
    let prefix=path.join(__static, '/img/disk/');
    let type = item.type;
    if(!item.disk_main){
        return prefix+'FolderType.png'
    }
    if (StringExist(type, '7z,zip,rar,tar.gz')) {
        return prefix+'RarType.png';
    }
    else if (StringExist(type, 'apng,png,jpg,jpeg,bmp,gif')) {
        return prefix+'ImageType.png';
    }
    else if (StringExist(type, 'mp4,rmvb,mkv')) {
        return prefix+'VideoType.png';
    }
    else if (StringExist(type, 'm4a,mp3,ogg,flac,f4a,wav,ape,ncm')) {
        return prefix+'MusicType.png';
    }
    else if (StringExist(type, 'doc,docx')) {
        return prefix+'DocType.png';
    }
    else if (StringExist(type, 'ppt,pptx')) {
        return prefix+'PptType.png';
    }
    else if (StringExist(type, 'xls,xlsx')) {
        return prefix+'ExcelType.png';
    }
    else if (type==='pdf') {
        return prefix+'PdfType.png';
    }
    else if (StringExist(type, 'ini,txt,md')) {
        return prefix+'TxtType.png';
    }
    else if (StringExist(type, 'xml,aspx,php,phtml,.htaccesscss,js,c')) {
        return prefix+'CodeType.png';
    }
    else if (StringExist(type, 'htm,html')) {
        return prefix+'WebType.png';
    }
    else if (type==='log') {
        return prefix+'OtherType.png';
    }
    else if (StringExist(type, 'exe,msi')) {
        return prefix+'ExeType.png';
    }
    else if (type=== 'torrent') {
        return prefix+'BtType.png';
    }
    else if (type==='vcf') {
        return prefix+'VcfType.png';
    }
    else {
        return prefix+'OtherType.png';
    }
}
function DiskData(item){
    item.active=false;//设置未选择
    item.$size=FileSize(item.disk_size);//计算文件大小
    item.type=StringBefore(item.disk_realname, ".").toLowerCase();
    item.$icon =IconGet(item);//区别文件类型设置图表
    item.disk_size=parseInt(item.disk_size);
    item.disk_main?item.disk_main=localStorage.server+'/'+item.disk_main:"";
    item.shareAddress=localStorage.server + '/s/' + item.share;
    if(item.disk_main){
        if (item.type==='zip') {
            item.OpenType='zip';
        }
        else if (StringExist(item.type, 'apng,png,jpg,jpeg,bmp,gif')) {
            item.TypeArray='apng,png,jpg,jpeg,bmp,gif';
            item.OpenType='image';
        }
        else if (StringExist(item.type, 'mp4,rmvb,mkv')) {
            item.TypeArray='mp4,rmvb,mkv';
            item.OpenType='video';
        }
        else if (StringExist(item.type, 'm4a,mp3,ogg,flac,f4a,wav,ape,ncm')) {
            item.TypeArray='m4a,mp3,ogg,flac,f4a,wav,ape,ncm';
            item.OpenType='audio';
        }
        else if (item.type==='pdf') {
            item.OpenType='pdf';
        }
        else if (this.$Api.StringExist(item.item.type, 'ini,txt,md,xml,aspx,php,phtml,js,c,htm,html,log,cpp,java')) {
            item.TypeArray='ini,txt,md,xml,aspx,php,phtml,js,c,htm,html,log,cpp,java';
            item.OpenType='text';
        }
        else {
            item.OpenType=null;
        }
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
                LocalFile.Exist(rs[0].userid);
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
    Exist(user){
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
                });
            }
        });
        AccountFile=address+ user+".json";
        this.User=user;
    },
    Read(type,callback){
        if(!this.User){
            return this.$Message.error('缺少用户数据')
        }
        return new Promise((resolve, reject)=>{
            fs.readFile(AccountFile,{flag:'r+',encoding:'utf8'},(err,data)=>{
                data=JSON.parse(data);
                callback&&callback(data);
                resolve(data[type]);
            })
        })
    },
    Write(data){
        fs.writeFile(AccountFile,JSON.stringify(data), (err)=>{});
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
    User,Disk,Check,StringExist,StringBefore,FileSize,IconGet,VerifyCod,LocalFile
}