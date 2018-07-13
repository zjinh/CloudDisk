import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LoginPage',
      component: require('@/components/LoginPage').default
    },
      {
          path: '/main',
          name: 'DiskWindow',
          component: require('@/components/DiskWindow').default
      },
      {
          path: '/info',
          name: 'DiskWindow',
          component: require('@/components/DiskInfo').default
      },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
