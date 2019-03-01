<template>
    <div class="CloudDiskHeadRight">
        <input class="CDsearchInput" type="text" placeholder="搜索" v-model="SearchKey" @keyup.enter.native="SwitchSearch" :style="ShowSearch?{width:'170px',border:'1px solid #eee'}:''">
        <button class="sf-icon-search" @click="SwitchSearch" v-show="show" :disabled="disabled"></button>
        <button :class="'sf-icon-sort-amount-'+AmountSort" @click="ChangeSort('alpha','disk_name')" v-show="show"></button>
        <button :class="DiskStateIcon" @click="ChangeState" v-show="show"></button>
    </div>
</template>

<script>
    export default {
        name: "DiskBarFeature",
        props:{
            show:{
                type:Boolean
            },
            disabled:{
                type:Boolean
            },
            hide:{
                type:Boolean
            }
        },
        data(){
            return{
                DiskShowState:"CloudDiskMFile",//网盘文件显示状态
                DiskStateIcon:'sf-icon-th-large',//文件显示状态类型,
                ShowSearch:false,//搜索框打开关闭
                SearchKey:"",//搜索关键词,
                AmountSort:'up',
            }
        },
        watch:{
            hide:{
                handler(){
                    if(this.hide){
                        this.ShowSearch=!this.hide;
                    }
                },
                deep:true
            }
        },
        methods:{
            SwitchSearch(){//搜索有问题
                if(this.ShowSearch===false){
                    this.ShowSearch=true;
                }else if(this.SearchKey.length&&this.ShowSearch){
                    this.$emit('callback','search',this.SearchKey,true);
                }else{
                    this.ShowSearch=false;
                }
            },
            ChangeSort(type,key){
                this.AmountSort==='up'?this.AmountSort='down':this.AmountSort='up';
                this.$emit('callback','sort',type,key);
            },
            ChangeState(){
                this.DiskShowState==='CloudDiskMFile'?this.DiskShowState='CloudDiskMList':this.DiskShowState='CloudDiskMFile';
                this.DiskStateIcon==='sf-icon-th-large'?this.DiskStateIcon='sf-icon-list-ul':this.DiskStateIcon='sf-icon-th-large';
                this.$emit('callback','state',this.DiskShowState);
            },
        }
    }
</script>

<style scoped>

</style>