<template>
    <div :class="'MessageMain '+animation">
        <div class="shadow"></div>
        <div class="MessageMain">
            <WindowHeader v-bind:data="confData"></WindowHeader>
            <div class="MessageContainer">
                <Icon type="ios-alert-outline" />
                <p>{{MegData}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import WindowHeader from "./DiskWindow/WindowHeader";
    let MessageMain=require('electron').remote.getCurrentWindow();
    export default {
        name: "MessageWindow",
        components:{
            WindowHeader
        },
        data(){
            return{
                confData:{
                    mini:false,
                    resize:false,
                    drag:true,
                    background:'#38f',
                    color:'#fff',
                    title:'CloudDisk-通知'
                },
                MegData:'',
                animation:'',
                TimeOut:null,
                TimeOut2:null
            }
        },
        created(){
            this.bind()
        },
        methods:{
            bind(){
                this.$ipc.on('win-data',(e,msg)=>{
                    this.$nextTick(()=>{
                        this.MegData=msg;
                        this.animation='animated slideInUp';
                        clearTimeout(this.TimeOut);
                        this.TimeOut=setTimeout(()=>{
                            this.animation='animated slideOutDown';
                            clearTimeout(this.TimeOut);
                            clearTimeout(this.TimeOut2);
                            this.TimeOut2=setTimeout(()=>{
                                MessageMain.hide();
                                clearTimeout(this.TimeOut2);
                            },500)
                        },5000)
                    })
                })
            }
        }
    }
</script>

<style scoped>
</style>