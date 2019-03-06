<template>
    <ul class="MouseMenu" ref="MouseMenu" v-show="MouseMenuShow">
        <li v-for="(item,index) in MenuData" @click="MenuClick(item.commend,item.data)" v-if="toBoolean(item.vif,'vif')">
            <button :disabled="toBoolean(item.disabled,'disabled')">{{item.name}}<span>{{item.key}}</span></button>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "MouseMenu",
        props:{
            type:{
                type:String
            },
            node:{
                type:Element
            },
            DiskData:{
                type:Object
            }
        },
        data(){
            return{
                DiskMainMenu:[
                    {name:"上传文件",key:"Ctrl+U",commend:"upload",disabled:"ClassifyName!=='网盘'"},
                    {name:"新建文件夹",key:"Ctrl+N",commend:"",disabled:"ClassifyName!=='网盘'"},
                    {name:"清空剪切板",key:"",commend:"clear",vif:"ClassifyName==='网盘'",disabled:"Clipboard.length===0"},
                    {name:"粘贴",key:"Ctrl+V",commend:"paste",vif:"ClassifyName==='网盘'",disabled:"Clipboard.length===0"},
                    {name:"刷新",key:"F5",commend:"reload"},
                ],
                DiskFileMenu:[
                    {name:"打开",key:"Ctrl+O",commend:"open",data:"",disabled:'SelectFiles.length>1',},
                    {name:"下载",key:"Ctrl+O",commend:"download",data:""},
                    {name:"移动到",key:"",commend:"MoveTo",data:""},
                    {name:"复制",key:"Ctrl+C",commend:"Copy",data:""},
                    {name:"剪切",key:"Ctrl+X",commend:"Cut",data:""},
                    {name:"重命名",key:"Ctrl+M/F2",commend:"rename",data:"",disabled:'SelectFiles.length>1'},
                    {name:"删除",key:"Delete",commend:"trash",data:""},
                    {name:"分享",key:"",commend:"share",data:"",disabled:'SelectFiles.length>1'},
                    {name:"属性",key:"Alt+Enter",commend:"info",data:"",disabled:'SelectFiles.length>1'},
                ],
                TrashFileMenu:[
                    {name:"还原",key:"Ctrl+R",commend:"restore",data:""},
                    {name:"删除",key:"Ctrl+Del",commend:"delete",data:""},
                    {name:"属性",key:"Alt+Enter",commend:"info",data:"",disabled:'SelectFiles.length>1'},
                ],
                DiskShareMenu:[
                    {name:"打开",key:"Ctrl+O",commend:"open",data:"",disabled:'SelectFiles.length>1'},
                    {name:"重命名",key:"Ctrl+M/F2",commend:"rename",data:"",disabled:'SelectFiles.length>1'},
                    {name:"删除",key:"Delete",commend:"trash",data:""},
                    {name:"查看分享",key:"",commend:"share",data:"",disabled:'SelectFiles.length>1'},
                    {name:"取消分享",key:"",commend:"cancel-share",data:"",disabled:'SelectFiles.length>1'},
                    {name:"属性",key:"Alt+Enter",commend:"info",data:"",disabled:'SelectFiles.length>1'},
                ],
                MenuData:[],
                MouseMenuShow:false,
            }
        },
        watch:{
            type: {
                handler(newValue, oldValue) {
                    this.MouseMenuShow=false;
                },
                deep: true
            },
        },
        beforeMount(){
            document.onclick=document.onmousewheel=()=>{
                this.MouseMenuShow=false;
            };
        },
        methods:{
            toBoolean(data,type){
                if(data===undefined&&type==='vif'){
                    return true;
                }else if(data===undefined&&type==='disabled'){
                    return false;
                }
                return eval('this.DiskData.'+data)
            },
            UpdateMenuData(flag){
                this.MouseMenuShow=false;
                if(flag) {
                    if (this.type !== 'trash') {
                        this.MenuData = this.DiskFileMenu;
                    } else {
                        this.MenuData = this.TrashFileMenu;
                    }
                    if (this.type === 'share') {
                        this.MenuData = this.DiskShareMenu;
                    }
                }else {
                    this.MenuData = this.DiskMainMenu;
                }
            },
            MenuClick(commend,data){
                this.$emit('callback',commend,data);
                this.MouseMenuShow=false;
            },
            MenuShow(flag) {
                if(event.button!==2){
                    this.MouseMenuShow=false;
                    return
                }
                this.UpdateMenuData(flag);
                event.preventDefault();
                event.stopPropagation();
                let menu = this.$refs.MouseMenu;
                let createNode = this.node;
                menu.style.left = event.pageX + -parseFloat(createNode.getBoundingClientRect().left) + createNode.offsetLeft + 'px';
                menu.style.top = event.pageY + -parseFloat(createNode.getBoundingClientRect().top) + createNode.offsetTop + 'px';
                if ((menu.getBoundingClientRect().left + menu.offsetWidth) > createNode.getBoundingClientRect().width) {
                    menu.style.left = createNode.getBoundingClientRect().width - menu.getBoundingClientRect().width + 'px';
                }
                if ((menu.getBoundingClientRect().top + menu.offsetHeight) - createNode.getBoundingClientRect().top > createNode.offsetHeight) {
                    menu.style.top = menu.style.top.split('px')[0] - menu.offsetHeight + 'px';
                }
                createNode.onmouseup = () => {
                    if (event.button === 2) {
                        createNode.onmousedown = null;
                        createNode.onmouseup = null;
                    }
                };
                this.MouseMenuShow=true;
            },
        }
    }
</script>

<style scoped>

</style>