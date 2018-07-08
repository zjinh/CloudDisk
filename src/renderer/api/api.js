import axios from 'axios'
function Ajax(options) {
    let params = new URLSearchParams();
    let method= options.method?options.method:'POST';
    if(method==='POST'){
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
        //"headers": {"Content-Type": "application/x-www-form-urlencodeed"},
        //withCredentials:true,
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
    }
};
let Disk={
    LoadTreeFile:function () {
        
    },
    LoadMainFile:function (data,callback,error) {
        Ajax({
            url:localStorage.server+"/service/disk/GetMainFile",
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