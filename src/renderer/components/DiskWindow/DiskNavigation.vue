<template>
    <div class="CloudDiskHeadLeft">
        <div class="CloudDiskNav">
            <button class="sf-icon-chevron-left" @click="NavControl('back')" :disabled="data.NavData.length===0"></button>
            <button class="sf-icon-home" @click="NavControl('home')" style="font-size: 16px;" :disabled="data.Type==='trans'"></button>
            <button :class="'sf-icon-redo'+(!loading?' sf-spin':'')" @click="NavControl('reload')" :disabled="data.Type==='trans'"></button>
            <span class="CloudDiskNavLine"></span>
            <button @click="NavControl('home')" style="padding-right: 0;">{{data.ClassifyName}}/</button>
            <div class="CloudDiskNavBar">
                <div v-for="(item,index) in data.NavData" class="CloudDiskNavBlock" @click="NavControl(item)">
                    {{item.disk_name}}
                    <span>/</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DiskNavigation",
        props:{
            data:{
                type:Object
            },
            loading:{
                type:Boolean
            }
        },
        methods:{
            NavControl(commend){//回调函数
                this.$emit("callback",commend)
            }
        }
    }
</script>

<style scoped>

</style>