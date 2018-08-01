<template>
    <ul class="CloudDiskClassify">
        <li v-for="(item,index) in data" ripple :class="item.active" @click="change(index)"><span :class="item.icon"></span>{{item.name}} <div v-show="item.count>0">{{item.count}}</div></li>
    </ul>
</template>

<script>

    export default {
        name: "ClassifyMenu",
        props:{
            data:{
                type:Array
            }
        },
        methods:{
            change(index) {
                this.data.forEach(function (item) {
                    item.active = false
                });
                this.data[index].active = 'CloudDiskClassifyActive';
                this.$emit("updateClassify", this.data[index])
            }
        }
    }
</script>

<style scoped>

</style>