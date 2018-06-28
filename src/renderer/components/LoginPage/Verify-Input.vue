<template>
    <div :class="focusState">
        <span class="sf-icon-keyboard"></span>
        <input :id="id" type="text" v-model="input.value" autocomplete='off' spellcheck="false" @focus="focusState='CloudIndex-Input Input-Focus'" @blur="blur">
        <label :for="id">{{data.text}}</label>
        <img title="点击刷新"  draggable="false" :src="src" @click="refush">
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
                id:'Input'+this.randomString(10),
                input:this.data,
                src:this.data.url,
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
            refush:function(){
                this.src=this.src+'?'+Math.random();
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