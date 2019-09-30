const fs= require('fs');
import { Base64 } from 'js-base64';
export default {
    address:process.env.HOMEDRIVE+process.env.HOMEPATH+'/CloudDisk\/',
    User:null,
    debug:process.env.NODE_ENV === 'development',
    AccountFile:{},//用户本地文件对象
    init(user,callback){
        fs.access(this.address,fs.constants.F_OK | fs.constants.W_OK,(err)=>{
            if(err){
                fs.mkdir(this.address,(err)=>{
                    this.debug&&console.log('已创建系统文件夹，准备创建主配置文件');
                    this.userVerify(user,()=>{
                        this.create(user,callback);
                    });
                })
            }else{
                this.debug&&console.log('系统文件夹已存在，准备创建主配置文件');
                this.userVerify(user,()=>{
                    this.create(user,callback);
                });
            }
        });
    },
    userVerify(user,callback){
        fs.access(this.address+user,fs.constants.F_OK | fs.constants.W_OK,(err)=>{
            err?fs.mkdir(this.address+user,(err)=>{
                callback&&callback()
            }):callback&&callback()
        })
    },
    map(user,callback){
        let map={
            login:this.address,
            user:this.address+user+'/',
            transfer:this.address+user+'/',
            setting:this.address+user+'/',
        };
        this.User=user;
        for(let i in map){
            map[i]=map[i]+i+'.json';
        }
        this.AccountFile=map;
        callback&&callback()
    },
    create(user,callback){
        this.debug&&console.log('开始创建主配置文件');
        this.map(user,()=>{
            for(let i in this.AccountFile){
                fs.appendFileSync(this.AccountFile[i],'');
                console.log('创建'+this.AccountFile[i]);
            }
        });
        callback&&callback();
    },
    read(type,callback,encryption){
        this.map(this.User);
        this.debug&&console.log('读取'+this.AccountFile[type]);
        fs.readFile(this.AccountFile[type],{flag:'r+',encoding:'utf8'},(err,data)=>{
            if(encryption){
                data=this.encryption(data,false);
            }
            try{
                data=JSON.parse(data)
            }catch (e) {
                data={}
            }
            callback&&callback(data,err);
        })
    },
    write(type,data,encryption){
        this.map(this.User);
        this.debug&&console.log('写入'+this.AccountFile[type]);
        data=JSON.stringify(data);
        if(encryption){
            data=this.encryption(data,true);
        }
        fs.writeFile(this.AccountFile[type],data, (err)=>{});
    },
    encryption(data,command){
        if(command==='lock'||command===true) {
            data = Base64.encode(data)
        }else{
            data = Base64.decode(data)
        }
        return data
    }
}
