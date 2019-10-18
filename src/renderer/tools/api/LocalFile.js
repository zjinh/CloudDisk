const fs= require('fs');
import encrypt from "../encrypt";
export default {
    address:process.env.HOMEDRIVE+process.env.HOMEPATH+'/CloudDisk\/',
    User:null,
    debug:process.env.NODE_ENV === 'development',
    AccountFile:{},//用户本地文件对象
    char26(){
        let ch_small = 'a';
        let str = '';
        let ch_big = 'A';
        for(let i=0;i<26;i++){
            str += String.fromCharCode(ch_small.charCodeAt(0)+i)+ String.fromCharCode(ch_big.charCodeAt(0)+i);
        }
        return str;
    },
    log(message){
        this.debug&&console.info(message);
    },
    init(user,callback){
        fs.access(this.address,fs.constants.F_OK | fs.constants.W_OK,(err)=>{
            if(err){
                fs.mkdir(this.address,(err)=>{
                    this.log('已创建系统文件夹，准备创建主配置文件');
                    this.userVerify(user,()=>{
                        this.create(user,callback);
                    });
                })
            }else{
                this.log('系统文件夹已存在，准备创建主配置文件');
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
            key:this.address
        };
        this.User=user;
        for(let i in map){
            map[i]=map[i]+i+'.json';
        }
        this.AccountFile=map;
        callback&&callback()
    },
    create(user,callback){
        this.log('开始创建主配置文件');
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
        let data={};
        if(typeof callback==="function"){
            fs.readFile(this.AccountFile[type],{flag:'r+',encoding:'utf8'},(err,data)=>{
                return this.readCallback(encryption,data,callback)
            });
            this.log('异步读取'+this.AccountFile[type]);
        }else{
            try {
                data=fs.readFileSync(this.AccountFile[type],{flag:'r+',encoding:'utf8'});
                this.log('同步读取'+this.AccountFile[type]);
            }catch (e) {}
            return this.readCallback(encryption,data)
        }
    },
    readCallback(encryption,data,callback){
        data=encryption?this.encryption(data,false):data;
        try{
            data=JSON.parse(data)
        }catch (e) {
            data={}
        }
        callback&&callback(data);
        return data;
    },
    write(type,data,encryption){
        this.map(this.User);
        this.log('写入'+this.AccountFile[type]);
        data=JSON.stringify(data);
        if(encryption){
            data=this.encryption(data,true);
        }
        if(type==='key'){
            let char26=this.char26();
            data=encrypt.encode(data,data+char26,data+char26);
        }
        fs.writeFile(this.AccountFile[type],data, (err)=>{});
    },
    encryption(data,command){
        let key=this.read('key');
        let pKey=key+this.char26();
        if(command==='lock'||command===true) {
            data=encrypt.encode(data,pKey,key);
        }else{
            data=encrypt.decode(data,pKey,key);
        }
        return data
    }
}
