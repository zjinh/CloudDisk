import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './tools/index';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');
