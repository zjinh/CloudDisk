<template>
    <ul class="CloudDiskClassify" >
        <li v-for="(item,index) in data" ripple :class="item.active" @click="change(index)"><span :class="item.icon"></span>{{item.name}}</li>
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
            change:function (index) {
                this.data.forEach(function (item) {
                    item.active = false
                });
                this.data[index].active = 'CloudDiskClassifyActive';
                this.$emit("updateClassify", this.data[index].name)
            }
        }
    }
</script>

<style scoped>

</style>