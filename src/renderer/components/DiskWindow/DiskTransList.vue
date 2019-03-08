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
    /*传输列表*/
    .CloudDisTrans{
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .CloudDisTransList{
        width: 100%;
        height: 55px;
        margin-top: 2px;
        position: relative;
        border-bottom: 1px solid #eee;
    }
    .CloudDisTransList img{
        float: left;
        margin: 10px;
        width: 30px;
    }
    .CloudDisTransRight .trans-container{
        float: left;
        width: calc(100% - 100px);
        height: 100%;
    }
    .CloudDisTransRight .trans-name,.CloudDisTransRight .trans-size{
        font-size: 12px;
        line-height: 22px;
    }
    .CloudDisTransRight .ivu-progress{
        float: right;
        width: 310px;
    }
    .CloudDisTransRight {
        float: left;
        width: calc(100% - 50px);
        height: 100%;
        padding: 4px;
    }
    .CloudDisTransRight button{
        float: right;
        margin: 10px;
        width: 26px;
        height: 26px;
        background: white;
        border-radius: 100%;
        color: rgba(64, 158, 255, 0.87);
        border: 1px solid rgba(64, 158, 255, 0.66);
    }
    .CloudDisTransRight button:hover{
        color: #2d8cf0;
        border: 1px solid  #2d8cf0;
    }
    .CloudDisTransRight button.sf-icon-times{
        color: #E83C3C!important;
        border:1px solid #E83C3C!important;
    }
    .CloudDisTransRight button.sf-icon-trash{
        color: #19be6b!important;
        border:1px solid #19be6b!important;
    }
    .CloudDisTransList:hover{
        background: rgba(0,0,0,.1);
    }
</style>