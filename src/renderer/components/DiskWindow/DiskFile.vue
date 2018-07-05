<template>
    <div>
        <div v-for="(item,index) in data" :class="ShowState" ripple>
            <span>
                <img :src="item.icon">
            </span>
            <p>{{item.disk_name}}</p>
            <div class="CloudDiskTime">{{item.create_time}}</div>
            <div class="CloudDiskTime">{{item.disk_size}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DiskFile",
        props:{
            data:{
                type:Array,
            },
            ShowState:{
                type:String
            }
        },
        created(){

            this.data.forEach((item)=>{
                item.disk_size=this.FileSize(item.disk_size);
                item.icon = this.IconGet(item.disk_realname,item.disk_type)
            });
        },
        methods:{
            FileSize:function (bytes) {
                bytes=parseFloat(bytes);
                if (bytes === 0) return '0B';
                let k = 1024,
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
            },
            IconGet:function (name,disktype) {
                let prefix='../../../../static/img/disk/';
                let type = this.StringBefore(name, ".");
                if(disktype==='folder'){
                    return prefix+'FolderType.png'
                }
                if (this.StringExist(type, '7z,zip,rar,tar.gz')) {
                    return prefix+'RarType.png';
                }
                else if (this.StringExist(type, 'apng,png,jpg,jpeg,bmp,gif,APNG,PNG,JPG,JPEG,BMP,GIF')) {
                    return prefix+'ImageType.png';
                }
                else if (this.StringExist(type, 'mp4,rmvb,mkv,MP4,RMVB,MKV')) {
                    return prefix+'VideoType.png';
                }
                else if (this.StringExist(type, 'm4a,mp3,ogg,flac,f4a,wav,ape,M4A,MP3,OGG,FLAC,F4A,WAV,APE')) {
                    return prefix+'MusicType.png';
                }
                else if (this.StringExist(type, 'doc,docx,DOC,DOCX')) {
                    return prefix+'DocType.png';
                }
                else if (this.StringExist(type, 'ppt,pptx,PPT,PPTX')) {
                    return prefix+'PptType.png';
                }
                else if (this.StringExist(type, 'xls,xlsx,XLS,XLSX')) {
                    return prefix+'ExcelType.png';
                }
                else if (this.StringExist(type, 'pdf,PDF')) {
                    return prefix+'PdfType.png';
                }
                else if (this.StringExist(type, 'ini,txt,md,INI,TXT,MD')) {
                    return prefix+'TxtType.png';
                }
                else if (this.StringExist(type, 'xml,aspx,php,phtml,.htaccesscss,js,c,XML,ASPX,PHP,PHTML,.HTACCESSCSS,JS,C')) {
                    return prefix+'CodeType.png';
                }
                else if (this.StringExist(type, 'htm,html,HTM,HTML')) {
                    return prefix+'WebType.png';
                }
                else if (this.StringExist(type, 'log,LOG')) {
                    return prefix+'OtherType.png';
                }
                else if (this.StringExist(type, 'exe,msi,EXE,MSI')) {
                    return prefix+'ExeType.png';
                }
                else if (this.StringExist(type, 'torrent,TORRENT')) {
                    return prefix+'BtType.png';
                }
                else if (this.StringExist(type, 'vcf,VCF')) {
                    return prefix+'VcfType.png';
                }
                else {
                    return prefix+'OtherType.png';
                }
            },
            StringExist:function (str, substr) {
                if(typeof str !== "string"){ return; }
                if(substr==='|*|'){return true}
                for(let i=0;i<substr.split(',').length;i++){
                    if(str.indexOf(substr.split(',')[i]) >= 0 === true ){ return true; }
                }
                return false;
            },
            StringBefore:function (str,substr) {
                return str.substring(str.lastIndexOf(substr) + 1, str.length);
            },
        }
    }
</script>

<style scoped>

</style>