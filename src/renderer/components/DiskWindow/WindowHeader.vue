<template>
    <div class="WindowHeader" :style="{'margin-top':(data.resize&&ButtonState==='sf-icon-window-maximize')?'2px':'0px','color':data.color?data.color:'#333','background':data.background?data.background:''}">
        <p>{{data.title}}</p>
        <button class="sf-icon-times" @click="close" :style="{'color':data.color?data.color:'#333'}"></button>
        <button :class="ButtonState" v-show="data.resize===undefined?true:data.resize" @click="restore" :style="{'color':data.color?data.color:'#333'}"></button>
        <button class="sf-icon-window-minimize" v-show="data.mini===undefined?true:data.mini" @click="mini" :style="{'color':data.color?data.color:'#333'}"></button>
    </div>
</template>

<script>
    import electron from 'electron';
    let win=electron.remote.getCurrentWindow();
    export default {
        name: "WindowHeader",
        props:{
            data:{
                type:Object
            }
        },
        data(){
            return{
                ButtonState:'sf-icon-window-maximize'
            }
        },
        created(){
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
                win.on('maximize',()=>{
                    this.ButtonState='sf-icon-window-restore';
                });
                win.on('unmaximize',()=>{
                    this.ButtonState='sf-icon-window-maximize';
                });
            },
            mini(){
                win.minimize();
            },
            close () {
                win.close();
            },
            restore () {
                if (win.isMaximized()) {
                    win.restore();
                } else {
                    win.maximize();
                }
            },
        }
    }
</script>

<style scoped>

</style>