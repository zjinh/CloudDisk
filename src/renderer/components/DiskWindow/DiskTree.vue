<template>
    <div>
        <ul class="CloudDiskTreesContainer" v-for="(item,index) in DiskTreeData?DiskTreeData:UserDiskTreeData">
            <div :class="item.disk_name==='全部文件'?'CloudDFoContainer':'CloudDFoContainer childFolder'">
                <li class="CloudDiskTree" @dblclick="ToggleDiskTree(item,index)" @mousedown="SelectTree(item,index)" :parent="item.parent_id" :id="item.disk_id">
                    <Icon v-if="!item.show&&item.load!=='loading'" type="ios-folder"></Icon>
                    <Icon v-if="item.load==='loading'" type="load-c sf-spin"></Icon>
                    <Icon v-if="item.show&&item.load!=='loading'" type="folder" style="font-size: 23px;"></Icon>
                    <div>{{item.disk_name}}</div>
                </li>
                <DiskTree v-bind:DiskTreeData="item.child" v-show="item.show"></DiskTree>
            </div>
        </ul>
    </div>
</template>

<script>
    import Api from '../../api/api';
    export default {
        name: "DiskTree",
        props:{
            DiskTreeData:{
                type:Array
            }
        },
        data(){
          return{
              UserDiskTreeData:[
                  {"disk_name":"全部文件","disk_id":"null","parent_id":"","show":false,"load":false,"child":[]}
              ],
          }
        },
        methods:{
            init(){
                this.UserDiskTreeData=[
                    {"disk_name":"全部文件","disk_id":"null","parent_id":"","show":false,"load":false,"child":[]}
                ]
            },
            checkIn:function(item,rs){
                if (rs[0]&&(rs[0].parent_id===item.disk_id)) {
                    rs.forEach((items)=>{
                        items.load=false;
                        items.show=false;
                        items.child=[];
                        item.child.push(items);
                    });
                }
            },
            LoadTreeData:function(list){
                Api.Disk.LoadTreeFile(list.disk_id,(rs)=>{
                    this.checkIn(list,rs);//检查并插入数据
                    list.load='success';
                    list.show = true;
                })
            },
            ToggleDiskTree:function (item,index) {
                if(item.load==='success') {
                    if (item.show) {
                        item.show = false;
                    } else {
                        item.show = true;
                    }
                }else{
                    item.load='loading';
                    this.LoadTreeData(item);
                }
            },
            SelectTree:function (item,index) {
                let CloudDiskTree=document.getElementsByClassName('CloudDiskTree');
                for (let i = 0; i < CloudDiskTree.length; i++) {
                    CloudDiskTree[i].className = 'CloudDiskTree';
                }
                let path=event.path;
                for(let j=0;j<path.length;j++){
                    if(path[j].nodeName==='LI'){
                        path[j].className='CloudDiskTree CloudDiskTreeActive'
                    }
                }
                this.$emit("SelectDiskTree",item,index)
            }
        }
    }
</script>

<style scoped>

</style>