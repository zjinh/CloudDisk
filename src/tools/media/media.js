function MediaControl(media, type, fx, slider, e) {
	e.stopPropagation();
	if (type !== 'play') {
		function analfx(e) {
			fx === 'y'
				? Volumn(Math.abs((e.pageY - slider.getBoundingClientRect().top) / slider.offsetHeight - 1), fx)
				: Volumn((e.pageX - slider.getBoundingClientRect().left) / slider.offsetWidth, fx);
		}

		function Volumn(arm, fx) {
			arm > 1 ? (arm = 1) : '';
			arm < 0 ? (arm = 0) : '';
			media.volume = arm;
			if (parseFloat(arm) * 100 < 101) {
				if (fx === 'x') {
					slider.childNodes[0].style.width = parseFloat(arm) * 100 + '%';
				} else {
					slider.childNodes[0].style.height = parseFloat(arm) * 100 + '%';
					slider.childNodes[0].style.top = parseFloat(1 - arm) * 100 + '%';
				}
			}
		}

		document.onmousemove = function(e) {
			analfx(e);
		};
		analfx(e);
	} else {
		document.onmousemove = function(e) {
			media.currentTime = (media.duration * (e.pageX - slider.getBoundingClientRect().left)) / slider.offsetWidth;
		};
		media.currentTime = (media.duration * (e.pageX - slider.getBoundingClientRect().left)) / slider.offsetWidth;
	}
	document.onmouseup = new Function('this.onmousemove=null');
}
function secondDeal(time) {
	let m = parseInt(time / 60) < 10 ? '0' + parseInt(time / 60) : parseInt(time / 60);
	let s = parseInt(time % 60) < 10 ? '0' + parseInt(time % 60) : parseInt(time % 60);
	return m + ':' + s;
}
export default {
	MediaControl,
	secondDeal
};
