import { Ajax, severAddress } from './request';
import LocalFile from './LocalFile';
export default {
	Login(data, callback, error) {
		Ajax({
			url: '/service/user/login',
			data: data,
			success: rs => {
				if (rs[0].state === 'success') {
					LocalFile.init(rs[0].userid, () => {
						rs[0].head = severAddress() + '/' + rs[0].head + '?' + Date.now();
						data.id = rs[0].userid;
						LocalFile.write('key', data.id);
						LocalFile.write('login', JSON.parse(JSON.stringify(data)), true);
						callback && callback(rs);
					});
				} else {
					error && error(rs);
				}
			},
			error: error
		});
	},
	Register(data, callback, error) {
		Ajax({
			url: '/service/user/register',
			data: data,
			success: callback,
			error: error
		});
	},
	Forget(data, callback, error) {
		Ajax({
			url: '/service/user/forget',
			data: data,
			success: callback,
			error: error
		});
	},
	Verify(data, callback, error) {
		Ajax({
			url: '/service/user/verifyCheck',
			data: data,
			success: callback,
			error: error
		});
	},
	UserInfo(callback, error) {
		Ajax({
			url: '/service/user/UserInfo',
			data: [],
			success: rs => {
				localStorage.LoginTime = rs[0].login_time;
				rs[0].birth = this.age(rs[0].birthday);
				rs[0].userhead = severAddress() + '/' + rs[0].userhead + '?' + Date.now();
				LocalFile.write('user', rs[0]);
				callback(rs);
			},
			error: error
		});
	},
	ReSend(data, callback, error) {
		Ajax({
			url: '/service/user/resend',
			data: data,
			success: callback,
			error: error
		});
	},
	Update(data, callback, error) {
		Ajax({
			url: '/service/user/UpdateUserInfo',
			data: data,
			upload: true,
			success: callback,
			error: error
		});
	},
	FeedBack(data, callback, error) {
		Ajax({
			url: '/service/user/SendCouple',
			data: data,
			success: callback,
			error: error
		});
	},
	ChangePass(data, callback, error) {
		Ajax({
			url: '/service/user/ChangePass',
			data: data,
			success: callback,
			error: error
		});
	},
	ChangeSafeEmail(data, callback, error) {
		Ajax({
			url: '/service/user/ChangeSafeEmail',
			data: data,
			success: callback,
			error: error
		});
	},
	age(birth) {
		birth = Date.parse(birth ? birth : ''.replace('/-/g', '/'));
		return parseInt((new Date() - new Date(birth)) / (1000 * 60 * 60 * 24 * 365));
	}
};
