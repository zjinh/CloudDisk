import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
//引入iview组件
import {Checkbox,Tooltip,Dropdown,DropdownMenu,DropdownItem,Input,InputNumber,RadioGroup,Radio,Time,Select,Option,DatePicker,Message,Notice,Icon,Spin,Progress,Button} from 'iview';
Vue.component('Checkbox', Checkbox);
Vue.component('Tooltip', Tooltip);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('DropdownItem', DropdownItem);
Vue.component('Input', Input);
Vue.component('InputNumber', InputNumber);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Radio', Radio);
Vue.component('Time', Time);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('DatePicker', DatePicker);
Vue.component('Message',Message);
Vue.prototype.$Message=Message;
Vue.component('Notice',Notice);
Vue.prototype.$Notice=Notice;

Vue.component('Icon',Icon);
Vue.component('Spin',Spin);
Vue.component('Progress',Progress);
Vue.component('Button',Button);
Vue.prototype.$IVIEW = {};
import 'iview/dist/styles/iview.css';
//引入element的部分组件
import { MessageBox,Dialog} from 'element-ui';
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.use(Dialog);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
axios.defaults.withCredentials=true;
Vue.http = Vue.prototype.$http = axios;

Vue.config.productionTip = false;


new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');