/*用户登录界面input*/
<template>
    <div :class="data.disabled?'CloudIndex-Input Input-Focus':focusState">
        <span :class="data.icon"></span>
        <input :id="id" :type="data.type?data.type:'text'" v-model="data.value" autocomplete='off' spellcheck="false" @focus="focusState='CloudIndex-Input Input-Focus'" @blur="blur" :disabled="data.disabled?data.disabled:false">
        <label :for="id">{{data.text}}</label>
    </div>
</template>

<script>
    export default {
        name: "l-input",
        props: {
            data: {
                type: Object
            }
        },
        data(){
            return{
                id:'Input-'+Math.random(),
                focusState:'CloudIndex-Input'
            }
        },
        methods:{
            blur:function () {
                if(this.data.value){
                    this.focusState='CloudIndex-Input Input-Focus'
                }else{
                    this.focusState='CloudIndex-Input'
                }
            }
        }
    }
</script>

<style scoped>

</style>