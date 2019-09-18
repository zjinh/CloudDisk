/*用户登录界面input*/
<template>
    <div :class="(data.disabled||data.value)?'CloudIndex-Input Input-Focus':focusState">
        <span :class="data.icon"></span>
        <input :id="id" :type="data.type?data.type:'text'" v-model="data.value" autocomplete='off' spellcheck="false" @focus="focusState='CloudIndex-Input Input-Focus'" @blur="blur" :disabled="data.disabled?data.disabled:false">
        <label :for="id">{{data.text}}</label>
        <Tooltip v-if="data.state==='verify'" content="点击刷新" placement="bottom-end" :transfer="true">
            <img draggable="false" :src="url" @click="refresh" alt="">
        </Tooltip>
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
                focusState:'CloudIndex-Input',
                url:this.$Api.Public.VerifyCode(),
            }
        },
        methods:{
            blur () {
                if(this.data.value){
                    this.focusState='CloudIndex-Input Input-Focus'
                }else{
                    this.focusState='CloudIndex-Input'
                }
            },
            refresh(){
                this.url=this.$Api.Public.VerifyCode();
            }
        }
    }
</script>

<style scoped>

</style>
