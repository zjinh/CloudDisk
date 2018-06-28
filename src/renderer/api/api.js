import axios from 'axios'
function Ajax(options) {
    let params = new URLSearchParams();
    if(options.method==='POST'||!options.method){
        for(let item in options.data){
            params.append(item, options.data[item]);
        }
    }
    axios({
        method: options.method?options.method:'POST',
        data: params,
        emulateJSON:true,
        url: options.url

    }).then((response) => {
        options.success&&typeof options.success==='function'?options.success(response.data):'';
    },function (error) {
        options.success&&typeof options.success==='function'?options.success(error):'';
    });
}
function Login(data,callback) {
    Ajax({
        url:"http://cloud.com:100/service/user/login",
        data:data,
        success:callback
    })
}
export default {
    Ajax,Login
}