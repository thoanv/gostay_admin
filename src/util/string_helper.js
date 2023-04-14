export function xoa_dau(str) {
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
	str = str.replace(/đ/g, 'd');
	str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
	str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
	str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
	str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
	str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
	str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
	str = str.replace(/Đ/g, 'D');
	return str;
}
export const regexpNumberPhone = (string) => {
	const regexp = /^\d*(?=\d{4})/g;
	return string.match(/\d*/g).filter((item) => item.length === 9)[0].match(regexp) + '****';
};
export const findVideoIdFromLinkYoutube = (video_url) => {
	let videoId = '';
	if (video_url.indexOf('=') > 0) {
		videoId = video_url.substring(video_url.indexOf('v=') + 2, video_url.indexOf('v=') + 13);
	} else if (video_url.indexOf('be/') > 0) {
		videoId = video_url.substring(video_url.indexOf('be/') + 3, video_url.indexOf('be/') + 14);
	}
	console.log(videoId);

	return videoId;
};

const handle = (match, offset, string) => {
	count_star = 0;
	temp = match.split('');
	for (let i = match.length - 1; i >= 0; i--) {
		if (/\d/g.test(match[i])) {
			temp.splice(i, 1, '*');
			count_star = count_star + 1;
		}
		if (count_star >= 4) {
			break;
		}
	}
	return temp.join('');
};

export const regex_phone = (string) => {
	const regex = /\d{9,11}|[\d .-]{13,14}|\+84[\d .]{9,12}/g;
	return string.replace(regex, handle);
};
export const detect_phone = (string) => {
	const regex = /\d{9,11}|[\d .-]{13,14}|\+84[\d .]{9,12}/g;
	// return (string).replace(regex, handle)
	return regex.test(string);
};
export const regex_description_job = (string) => {
	const regex = /\s(?=\S)/g;
	console.log(string.split(regex));

	return string.split(regex).length >= 5 ? true : false;
};
export const add_dot_number = (number) => {
	var string = number.toString();
	var length = string.length;
	var count = 0;
	var new_string = '';
	for (let i = length - 1; i >= 0; i--) {
		if (count < 3) {
			new_string = string[i] + new_string;
			count = count + 1;
		} else {
			new_string = string[i] + '.' + new_string;
			count = 1;
		}
	}
	return new_string;
};
export const spend_dot_number = (string) => {
	// var string = number.toString()
	var length = string.length;
	var count = 0;
	var new_string = '';
	for (let i = length - 1; i >= 0; i--) {
		if (string[i] != '.') {
			new_string = string[i] + new_string;
		}
	}
	return new_string;
};
export const format9phone = (phone) => {
	if (phone.toString().length == 10 && phone.toString()[0] == 0) {
		return phone.toString().substr(1);
	} else {
		return phone;
	}
};

export const shorten = (str, length) => {
	if (str.length > length) {
		str = str.substring(0, length);
	}
	return str;
}
export const calculatePercent = (tu, mau) => {
	if (tu && mau) {
		return (tu * 100 / mau).toFixed(0);
	} else {
		return 0;
	}
};
