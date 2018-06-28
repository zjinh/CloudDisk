/*用户登录界面input*/
<template>
    <div :class="data.disabled?'CloudIndex-Input Input-Focus':focusState">
        <span :class="data.icon"></span>
        <input :id="id" type="text" v-model="input.value" autocomplete='off' spellcheck="false" @focus="focusState='CloudIndex-Input Input-Focus'" @blur="blur" :disabled="data.disabled?data.disabled:false">
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
                id:'Input'+this.randomString(10),
                input:this.data,
                focusState:'CloudIndex-Input'
            }
        },
        methods:{
            blur:function () {
                if(this.input.value){
                    this.focusState='CloudIndex-Input Input-Focus'
                }else{
                    this.focusState='CloudIndex-Input'
                }
            },
            randomString:function(len) {
                len = len || 32;
                let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
                let maxPos = $chars.length;
                let pwd = '';
                for (let i = 0; i < len; i++) {
                    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
                }
                return pwd;
            }
        }
    }
</script>

<style scoped>

</style>