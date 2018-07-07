<template>
    <div v-if="data.length">
        <div v-for="(item,index) in data" :class="ShowState" ripple>
            <span>
                <img :src="item.icon" draggable="false">
            </span>
            <p>{{item.disk_name}}</p>
            <div class="CloudDiskTime">{{item.create_time}}</div>
            <div class="CloudDiskTime">{{item.disk_size}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DiskFile",
        props:{
            data:{
                type:Array,
            },
            ShowState:{
                type:String
            }
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>