<template>
    <ul class="CloudSettingMenu">
        <li v-for="(item,index) in data" :class="item.active" @click="change(item,index)">
            <span :class="item.icon"></span>
            <p>{{item.name}}</p>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "SettingMenu",
        props:{
            data:{
                type:Object
            }
        },
        methods:{
            change(item,index){
                this.$emit('change',item,index)
            }
        }
    }
</script>

<style scoped>

</style>