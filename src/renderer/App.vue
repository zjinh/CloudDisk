<template>
  <div id="Cloud-Disk">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'Cloud-Disk',
      created(){
          this.$Message.config({
              duration: 2.5
          });
      }
  }
</script>

<style>
  @import url("../../static/css/icon.css");
  @import url("../../static/css/disk.css");
</style>
