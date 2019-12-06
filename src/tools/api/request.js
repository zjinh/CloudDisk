import axios from 'axios/index';
axios.defaults.withCredentials = true;
function severAddress() {
	return 'https://api.zjinh.cn';
}
function updateServer() {
	return 'https://update.zjinh.cn/c-disk';
}
function Ajax(options) {
	let params = new URLSearchParams();
	let method = options.method ? options.method : 'POST';
	if (method === 'POST' && !options.upload) {
		for (let item in options.data) {
			params.append(item, options.data[item]);
		}
	} else {
		params = options.data;
	}
	axios({
		method: method,
		data: params,
		emulateJSON: true,
		withCredentials: true,
		url: severAddress() + options.url,
		headers: options.upload ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}
	}).then(
		response => {
			options.success && typeof options.success === 'function' ? options.success(response.data) : '';
		},
		function(error) {
			options.error && typeof options.error === 'function' ? options.error(error) : '';
		}
	);
}
export { Ajax, severAddress, updateServer };
