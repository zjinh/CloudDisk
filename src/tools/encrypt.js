import CryptoJS from 'crypto-js';
export default {
	encode(str, aStrKey, ivstr) {
		const KeyHex = CryptoJS.enc.Utf8.parse(aStrKey);
		const encrypted = CryptoJS.TripleDES.encrypt(str, KeyHex, {
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
			iv: CryptoJS.enc.Utf8.parse(ivstr)
		});
		let hexstr = encrypted.ciphertext.toString().toUpperCase();
		return hexstr;
	},
	decode(str, aStrKey, ivstr) {
		const KeyHex = CryptoJS.enc.Utf8.parse(aStrKey);
		//因为我们加密的时候用到的16进制字符串，需要进行转换
		//第一步把16进制字符串转为WordArray格式npm
		const WordArray = CryptoJS.enc.Hex.parse(str || '');
		//第二步把WordArray再转为base64的字符串
		const base64str = CryptoJS.enc.Base64.stringify(WordArray);
		//第三步再进行解密
		const decrypted = CryptoJS.TripleDES.decrypt(base64str, KeyHex, {
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
			iv: CryptoJS.enc.Utf8.parse(ivstr)
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	}
};
