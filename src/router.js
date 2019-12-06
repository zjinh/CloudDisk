import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'LoginPage',
			component: require('@/views/LoginPage').default
		},
		{
			path: '/main',
			name: 'DiskWindow',
			component: require('@/views/DiskWindow').default
		},
		{
			path: '/info',
			name: 'DiskInfo',
			component: require('@/views/DiskInfo').default
		},
		{
			path: '/music-player',
			name: 'DiskMusicPlayer',
			component: require('@/views/DiskMusicPlayer').default
		},
		{
			path: '/video-player',
			name: 'DiskVideoPlayer',
			component: require('@/views/DiskVideoPlayer').default
		},
		{
			path: '/pdf-viewer',
			name: 'DiskPdfView',
			component: require('@/views/DiskPdfView').default
		},
		{
			path: '/disk-account',
			name: 'DiskAccount',
			component: require('@/views/DiskAccount').default
		},
		{
			path: '/about',
			name: 'DiskAbout',
			component: require('@/views/AboutWindow').default
		},
		{
			path: '/picture-shower',
			name: 'DiskPictureShower',
			component: require('@/views/DiskPictureShower').default
		},
		{
			path: '/file-shower',
			name: 'DiskFileContent',
			component: require('@/views/DiskFileContent').default
		},
		{
			path: '/disk-feedback',
			name: 'DiskFeedBack',
			component: require('@/views/DiskFeedBack').default
		},
		{
			path: '/disk-setting',
			name: 'DiskSetting',
			component: require('@/views/DiskSetting').default
		},
		{
			path: '/disk-msg',
			name: 'DiskSetting',
			component: require('@/views/MessageWindow').default
		},
		{
			path: '*',
			redirect: '/'
		}
	]
});
