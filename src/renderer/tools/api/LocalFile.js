const fs= require('fs');
let address=process.env.HOMEDRIVE+process.env.HOMEPATH+'/CloudMusic\/';//用户文件地址
export default {
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
                try{
                    data=JSON.parse(data)
                }catch (e) {
                    data={};
                };
                callback&&callback(data);
                resolve(data);
            })
        })
    },
    Write(type,data){
        this.Create(this.User);
        fs.writeFile(this.AccountFile[type],JSON.stringify(data), (err)=>{});
    }
}
