<template>
    <el-dialog
            title="请选择目标文件夹"
            :visible.sync="dialogVisible"
            width="350px"
            :before-close="handleClose">
        <div>
            <DiskTree v-bind:DiskTreeData="DiskTreeData"></DiskTree>
        </div>
        <span slot="footer" class="dialog-footer">
            <button class="el-button el-button--default el-button--small" @click="dialogVisible = false">取 消</button>
            <button class="el-button el-button--default el-button--small el-button--primary" @click="dialogVisible = false">确 定</button>
        </span>
    </el-dialog>
</template>

<script>
    import DiskTree from 'DiskTree'
    export default {
        name: "DiskTreeDialog",
        components:{DiskTree},
        data() {
            return {
                dialogVisible: true,
                DiskTreeData:[
                    {"name":"全部文件","id":"null","parent_id":"null","child":[
                            {"name":"新建件夹","id":"null","parent_id":"null","child":[]},
                            {"name":"fuwn","id":"null","parent_id":"null","child":[
                                    {"name":"子文夹","id":"null","parent_id":"null","child":[]},
                                    {"name":"新建文夹","id":"null","parent_id":"null","child":[
                                            {"name":"1","id":"null","parent_id":"null","child":[]},
                                        ]}
                                ]},
                        ]}
                ]
            };
        },
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            }
        }
    }
</script>

<style scoped>
</style>