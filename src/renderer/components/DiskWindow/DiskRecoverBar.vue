<template>
    <div class="CloudDiskMainFunc" v-show="show">
        <span class="sf-icon-info-circle TrashTips"> 回收站仍然占用网盘空间，文件保存10天后将被自动清除</span>
        <button :disabled="disabled" @click="CleanRecover">清空回收站</button>
    </div>
</template>

<script>
    export default {
        name: "DiskRecoverBar",
        props:{
            show:{
                type:Boolean
            },
            disabled:{
                type:Boolean
            },
        },
        methods:{
            CleanRecover(){
                this.Confrim({
                    title:'清空回收站',
                    tips:'该操作将清空回收站且不可恢复,是否继续',
                    callback:()=> {
                        this.$Message.info('正在清空回收站');
                        this.$Api.Disk.Delete({
                            id: ''
                        },(rs)=>{
                            rs=rs[0];
                            if(rs.state==='success'){
                                this.$Message.success('回收站已清空');
                                if(this.show) {
                                    this.$emit('callback');
                                }
                            }else{
                                this.$Message.error('回收站清空失败');
                            }
                        })
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>