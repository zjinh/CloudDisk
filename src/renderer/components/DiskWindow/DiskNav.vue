<template>
    <div class="CloudDiskNavBar">
        <div v-for="(item,index) in data.NavData" class="CloudDiskNavBlock" @click="SwitchNav(item)">{{item.disk_name}}</div>
    </div>
</template>

<script>
    export default {
        name: "DiskNav",
        props:{
            data:{
                type:Object
            }
        },
        methods:{
            SwitchNav:function(item){
                this.$emit("SwitchNav",item)
            },
        }
    }
</script>

<style scoped>

</style>