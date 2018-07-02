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
function Login(data,callback,error) {
    Ajax({
        url:localStorage.server+"/service/user/login",
        data:data,
        success:callback,
        error:error
    })
}
function Register(data,callback,error) {
    Ajax({
        url:localStorage.server+"/service/user/register",
        data:data,
        success:callback,
        error:error
    })
}
function Forget(data,callback,error) {
    Ajax({
        url:localStorage.server+"/service/user/forget",
        data:data,
        success:callback,
        error:error
    })
}
function Verify(data,callback,error) {
    Ajax({
        url:localStorage.server+"/service/user/verifyCheck",
        data:data,
        success:callback,
        error:error
    })
}
export default {
    Ajax,Login,Register,Forget,Verify
}