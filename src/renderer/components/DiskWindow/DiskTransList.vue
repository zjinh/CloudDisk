<template>
    <div>
        <li class="CloudDisTransList" v-for="(item,index) in data" v-show="item.show">
            <img :src="item.$icon" draggable="false">
            <div class="CloudDisTransRight">
                <div class="trans-container">
                    <p class="trans-name">{{(item.trans_type==='upload'&&item.state!=='finish'?'正在上传':'上传完成')||(item.trans_type==='download'&&item.state!=='finish'?'正在下载':'下载完成')}} {{item.name}}</p>
                    <span class="trans-size">{{item.chunk}}/{{item.size}}</span>
                    <Progress :percent="item.percent"></Progress>
                </div>
                <button class="sf-icon-times" v-show="item.state!=='finish'" @click="ControlTrans(item,index)"></button>
                <button :class='item.buttonVal' @click="ControlTrans(item,index)"></button>
            </div>
        </li>
    </div>
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
            }
        }
    }
</script>

<style scoped>

</style>