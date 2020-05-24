import { Ajax, severAddress, updateServer } from './request';
export default {
	Check(url, callback, error) {
		Ajax({
			url: url,
			data: [],
			success: callback,
			error: error
		});
	},
	VerifyCode() {
		return severAddress() + '/service/verifyCode' + '?' + Math.random();
	},
	severAddress,
	updateServer
};
