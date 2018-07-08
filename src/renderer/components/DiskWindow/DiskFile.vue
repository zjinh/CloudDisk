<template>
    <div v-if="data.length">
        <div v-for="(item,index) in data" :class="DiskData.DiskShowState+' '+(item.active?'CloudDiskChecked':'')" ripple @mousedown="select(item,index)">
            <span>
                <img :src="item.icon" draggable="false">
            </span>
            <p>{{item.disk_name}}</p>
            <div class="CloudDiskTime">{{item.create_time||item.modify_time}}</div>
            <div class="CloudDiskTime">{{item.size}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DiskFile",
        props: {
            data: {
                type: Array,
            },
            DiskData: {
                type: Object
            }
        },
        methods: {
            select: function (item,index) {
                this.$emit("SelectFiles",event,item,index)
            }
        }
    }
</script>

<style scoped>

</style>