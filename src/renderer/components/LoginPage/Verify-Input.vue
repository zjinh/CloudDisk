<template>
    <div :class="focusState">
        <span class="sf-icon-keyboard"></span>
        <input :id="id" type="text" v-model="data.value" autocomplete='off' spellcheck="false" @focus="focusState='CloudIndex-Input Input-Focus'" @blur="blur">
        <label :for="id">{{data.text}}</label>
        <Tooltip content="点击刷新" placement="bottom-end">
            <img draggable="false" :src="data.url" @click="refresh">
        </Tooltip>
    </div>
</template>

<script>
    export default {
        name: "Verify-Input",
        props: {
            data: {
                type: Object
            }
        },
        data(){
            return{
                id:'Input'+Math.random(),
                focusState:'CloudIndex-Input'
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
                this.data.url=this.data.url+'?'+Math.random();
            }
        }
    }
</script>

<style scoped>

</style>