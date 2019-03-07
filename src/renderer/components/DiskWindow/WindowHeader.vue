<template>
    <div class="WindowHeader" :style="{'margin-top':(data.resize&&ButtonState==='sf-icon-window-maximize')?'2px':'0px','color':data.color?data.color:'#333','background':data.background?data.background:''}">
        <p>{{data.title}}</p>
        <button class="sf-icon-times" @click="close" :style="{'color':data.color?data.color:'#333'}"></button>
        <button :class="ButtonState" v-show="data.resize===undefined?true:data.resize" @click="restore" :style="{'color':data.color?data.color:'#333'}"></button>
        <button class="sf-icon-window-minimize" v-show="data.mini===undefined?true:data.mini" @click="mini" :style="{'color':data.color?data.color:'#333'}"></button>
    </div>
</template>

<script>
    export default {
        name: "WindowHeader",
        props:{
            data:{
                type:Object
            }
        },
        watch:{
            data:{
                handler() {
                    this.win.setTitle(this.data.title)
                },
                deep:true
            }
        },
        data(){
            return{
                ButtonState:'sf-icon-window-maximize',
                win:false
            }
        },
        created(){
            this.win=this.$electron.remote.getCurrentWindow();
            this.bind();
            this.data.resize=this.data.resize===undefined?true:this.data.resize;
            window.addEventListener( "dragenter", function (e) {
                e.preventDefault();
            }, false);
            window.addEventListener( "dragover", function (e) {
                e.preventDefault();
            }, false );
            window.addEventListener( "dragleave", function (e) {
                e.preventDefault();
            }, false );
            window.addEventListener( "drop", function (e) {
                e.preventDefault();
            }, false );
        },
        methods:{
            bind(){
                this.win.on('maximize',()=>{
                    this.ButtonState='sf-icon-window-restore';
                });
                this.win.on('unmaximize',()=>{
                    this.ButtonState='sf-icon-window-maximize';
                });
            },
            mini(){
                this.win.minimize();
            },
            close () {
                this.win.close();
            },
            restore () {
                if (this.win.isMaximized()) {
                    this.win.restore();
                } else {
                    this.win.maximize();
                }
            },
        }
    }
</script>

<style scoped>

</style>