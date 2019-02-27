import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

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
        path: '/disk-account',
        name: 'DiskAccount',
        component: require('@/components/DiskAccount').default
    },
    {
      path: '/disk-about/:version',
      name: 'DiskAbout',
      component: require('@/components/DiskAbout').default
    },
    {
        path: '/picture-shower',
        name: 'DiskPictureShower',
        component: require('@/components/DiskPictureShower').default
    },
    {
      path: '/file-shower',
      name: 'DiskFileContent',
      component: require('@/components/DiskFileContent').default
    },
    {
      path: '/disk-feedback/:version',
      name: 'DiskFeedBack',
      component: require('@/components/DiskFeedBack').default
    },
    {
      path: '/disk-setting',
      name: 'DiskSetting',
      component: require('@/components/DiskSetting').default
    },
    {
        path: '/disk-msg',
        name: 'DiskSetting',
        component: require('@/components/MessageWindow').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
