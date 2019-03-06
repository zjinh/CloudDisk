<template>
    <ul class="CloudDisTrans">
        <li class="CloudDisTransList" v-for="(item,index) in data" v-show="item.shows">
            <img :src="$Api.IconGet(item)" draggable="false">
            <div class="CloudDisTransRight">
                <div class="trans-container">
                    <p class="trans-name">
                        {{item.trans_type==='upload' ? (item.state ==='completed' ? '上传完成':'正在上传') :  (item.state ==='completed' ? '下载完成':'正在下载')}}
                        {{item.name}}
                    </p>
                    <span class="trans-size">{{$Api.FileSize(item.chunk)}}/{{$Api.FileSize(item.size)}}</span>
                    <Progress :percent="PercentCount(item)"></Progress>
                </div>
                <button class="sf-icon-times" v-show="item.state!=='completed'" @click="ControlTrans(item,index)"></button>
                <button v-show="ControlButton(item.state).length" :class="ControlButton(item.state)" @click="ControlTrans(item,index)"></button>
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "DiskTransList",
        props:{
            data:{
                Array
            }
        },
        methods:{
            ControlTrans(item,index){
                this.$emit('ControlTrans',item,index)
            },
            PercentCount(item){
                return parseFloat(((item.chunk/item.size)*100).toFixed(1));
            },
            ControlButton(state){
                let btn='';
                if(state==='interrupted'){
                    btn='sf-icon-play';
                }else if(state==='progressing'){
                    btn='sf-icon-pause';
                }else if(state==='completed'){
                    btn='sf-icon-trash';
                }
                return btn;
            }
        }
    }
</script>

<style scoped>

</style>