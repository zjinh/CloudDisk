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

</style>