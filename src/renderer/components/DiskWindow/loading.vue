<template>
    <div>
        <div class='CloudDiskLoading' v-if="loading">
            <div class='sf-icon-hdd'>
                <div class='CloudDiskLoading-beat'>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>正在加载
        </div>
        <div class='CloudDiskEmptyTips' v-if="IsNoDiskData" v-show="!length>0">
            <span class='sf-icon-hdd'></span>
            这里什么都没有
        </div>
    </div>
</template>

<script>
    export default {
        name: "loading",
        props:{
            loading:{
                type:Boolean
            },
            IsNoDiskData:{
                type:Boolean
            },
            length:{
                type:Number
            }
        }
    }
</script>

<style scoped>
    /*加载动画*/
    .CloudDiskLoading{
        text-align: center;
        color: #5b5bea;
        font-size: 16px;
        padding-top: calc(25% - 35px);
        position: relative!important;
        z-index: -1;
    }
    .CloudDiskLoading .sf-icon-hdd{
        width: 100%;
        font-size: 45px;
        position: relative;
    }
    .CloudDiskLoading p{
        color: #828282;
        font-size: 16px;
    }
    @-webkit-keyframes CloudDiskLoading {
        50% {
            opacity: 0.2;
            -webkit-transform: scale(0.75);
            transform: scale(0.75); }

        100% {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1); } }
    @keyframes CloudDiskLoading {
        50% {
            opacity: 0.5;
            -webkit-transform: scale(0.75);
            transform: scale(0.75); }
        100% {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1); } }
    .CloudDiskLoading-beat{
        position: absolute;
        top: 24px;
        text-align: center;
        left: calc(50% - 8px);
        background: #fff;
        height: 10px;
        width: 26px;
    }
    .CloudDiskLoading-beat > div {
        float: right;
        background-color: #5b5bea;
        width: 4px;
        height: 4px;
        margin-top: 3px;
        margin-right: 2px;
        border-radius: 100%;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        display: inline-block;
        -webkit-animation: CloudDiskLoading 0.7s 0s infinite linear;
        animation: CloudDiskLoading 0.7s 0s infinite linear;
    }
    .CloudDiskLoading-beat > div:nth-child(2n-1) {
        -webkit-animation-delay: 0.35s !important;
        animation-delay: 0.35s !important; }
    /*无数据提示*/
    .CloudDiskEmptyTips{
        width: 100%;
        color: #828282;
        text-align: center;
        font-size: 16px;
        padding-top: calc(25% - 35px);
        position: relative!important;
        z-index: -1;
    }
    .CloudDiskEmptyTips span{
        width: 100%;
        font-size: 45px;
    }
</style>