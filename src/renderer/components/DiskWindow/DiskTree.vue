<template>
    <ul class="CloudDiskTreesContainer" v-for="(item,index) in DiskTreeData">
        <div class="CloudDFoContainer">
            <li>
                <span class="sf-icon-folder-open"></span>
                <div>{{item.name}}</div>
            </li>
            <DiskTree v-bind:DiskTreeData="item.child"></DiskTree>
        </div>
    </ul>
</template>

<script>
    export default {
        name: "DiskTree",
        props:{
            DiskTreeData:{
                type:Array
            }
        }
    }
</script>

<style scoped>

</style>