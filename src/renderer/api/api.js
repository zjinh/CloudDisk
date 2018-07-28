import axios from 'axios'
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
        headers:options.upload?{"Content-Type": "application/x-www-form-urlencodeed"}:{},
    }).then((response) => {
        options.success&&typeof options.success==='function'?options.success(response.data):'';
    },function (error) {
        options.error&&typeof options.error==='function'?options.error(error):'';
    });
}
let User={
    Login:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/user/login",
            data:data,
            success:callback,
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
            success:callback,
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
            success:callback,
            error:error
        })
    },
    UnZip:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/UnZipFile",
            data:data,
            success:callback,
            error:error
        })
    },
    Search:function (data,callback,error) {
        data.loadtype='search';
        Ajax({
            url:localStorage.server+"/service/disk/GetMainFile",
            data:data,
            success:callback,
            error:error
        })
    },
    NewFolder:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/NewFolder",
            data:data,
            success:callback,
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
};
let Check=function (url,callback,error) {
    Ajax({
        url:url,
        data:[],
        success:callback,
        error:error
    })
};
export default {
    Ajax,User,Disk,Check
}