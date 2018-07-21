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
      name: 'DiskInfo',
      component: require('@/components/DiskInfo').default
    },
    {
      path: '/music-player',
      name: 'DiskMusicPlayer',
      component: require('@/components/DiskMusicPlayer').default
    },
    {
        path: '/video-player',
        name: 'DiskVideoPlayer',
        component: require('@/components/DiskVideoPlayer').default
    },
    {
        path: '/pdf-viewer',
        name: 'DiskPdfView',
        component: require('@/components/DiskPdfView').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
