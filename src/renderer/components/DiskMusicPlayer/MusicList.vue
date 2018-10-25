<template>
    <ul class="AudioListContainer">
        <li v-for="(item ,index) in PlayList" :class="item.play" @click="ClickPlay(item,index)">{{index<9?'0':''}}{{index+1}} {{item.disk_name}}</li>
    </ul>
</template>

<script>
    export default {
        name: "MusicList",
        props:{
            PlayList:{
                type:Array
            }
        },
        methods:{
            ClickPlay(item,index){
                this.PlayList.forEach((list)=>{
                    list.play=false;
                });
                item.play='SlimfAudioPlayThis';
                this.$emit('play',item,index);
            }
        }
    }
</script>

<style scoped>

</style>