/**
 * Helpers Functions
 */
import moment from 'moment';

/**
 * Function to convert hex to rgba
 */
export function hexToRgbA(hex, alpha) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    throw new Error('Bad Hex');
}

/**
 * Text Truncate
 */
export function textTruncate(str, length, ending) {
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = '...';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
}

/**
 * Get Date
 */
export function getTheDate(timestamp, format) {
    let time = timestamp * 1000;
    let formatDate = format ? format : 'MM-DD-YYYY';
    return moment(time).format(formatDate);
}

/**
 * Convert Date To Timestamp
*/
export function convertDateToTimeStamp(date, format) {
    let formatDate = format ? format : 'YYYY-MM-DD';
    return moment(date, formatDate).unix();
}

/**
 * Function to return current app layout
 */
export function getAppLayout(url) {
    let location = url.pathname;
    let path = location.split('/');
    return path[1];
}

// debounce function
export const debounce = (fn, time) => {
    let timeout;

    return function () {
        const functionCall = () => fn.apply(this, arguments);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}

// get file extensions
export const getFileExtension = (filename) => {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
}

// convert file content to base64
export const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    })
}

//time zone
export const convertTimezone = (date, format) => {
    // var m = moment.utc(date); // parse input as UTC
    return m.clone().local().format(format);
}

export const getTime = (date, format) => {
    // var m = moment.utc(date); // parse input as UTC
    return moment(date).lang("vi").format(format);
}

// airline
export const generateAirline = (airlineCode) => {
    switch (airlineCode) {
        case "VN": return { name: 'Vietnam Airlines', logo: require('../assets/img/airlines/vietnam_airline.png') };
        case "VJ": return { name: 'Vietjet Air', logo: require('../assets/img/airlines/vietjet.png') };
        case "QH": return { name: 'Bamboo Airways', logo: require('../assets/img/airlines/bamboo.png') };
    }
}


export const priceInVn = (number) => {
    return (new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number));
}

// payment info
/**
 * pay type
 */
export const processPayType = (payTypeCode) => {
    switch (payTypeCode) {
        case 'DC': return 'Thẻ ATM';
        case 'IC': return 'Thẻ credit (Visa / Master / JCB ...)';
        case 'EW': return 'Ví điện tử (ZaloPay / Momo)';
        case 'VA': return 'Tài khoản chuyên dụng';
        default: return 'Chưa xác định';
    }
}

/**
 * pay status
 */
export const processPayStatus = (status) => {
    switch (status) {
        case -3: return 'Giao dịch gốc thất bại';
        case -2: return 'Giao dịch gốc đang chờ xử lý';
        case -1: return 'Không tìm thấy giao dịch';
        case 0: return 'Giao dịch gốc Thành công';
        case 2: return 'Giao dịch gốc Thành công (đã được refund)';
        case 5: return 'Giao dịch Virtual account đăng ký thành công (enduser chưa nạp tiền)';
        default: return 'Chưa xác định';
    }
}

/**
 * bank
 */
export const processBank = (bankCode) => {
    switch (bankCode) {
        case 'VCCM': return 'Ngân hàng Bản Việt';
        case 'NASM': return 'Ngân hàng Bắc Á';
        case 'KLBM': return 'Ngân hàng Kiên Long';
        case 'PVCM': return 'PVcombank';
        case 'TPBM': return 'TienphongBank';
        case 'PGBM': return 'PG bank';
        case 'TCBM': return 'TechcomBank';
        case 'STBM': return 'Sacombank';
        case 'OJBM': return 'OceanBank';
        case 'NCBM': return 'Ngân hàng Quốc Dân';
        case 'HDBM': return 'HD Bank';
        case 'VABM': return 'Việt Á Bank';
        case 'VTBM': return 'Vietinbank';
        case 'VPBM': return 'VP Bank';
        case 'ABBM': return 'AB Bank';
        case 'SEAM': return 'SeaBank';
        case 'SCBM': return 'Ngân hàng TMCP Sài Gòn (SCB)';
        case 'ACBM': return 'ACB';
        case 'VARM': return 'Agribank';
        case 'BVBM': return 'Ngân hàng Bảo Việt';
        case 'BIDM': return 'BIDV';
        case 'DABM': return 'Dong A Bank';
        case 'EIBM': return 'EximBank';
        case 'GPBM': return 'GP Bank';
        case 'LPBM': return 'Ngân hàng Bưu Điện';
        case 'MBKM': return 'MB';
        case 'MSBM': return 'MSB';
        case 'NABM': return 'Nam A Bank';
        case 'IVBM': return 'Ngân hàng TNHH Indovina';
        case 'OCBM': return 'Ngân hàng Phương Đông (OCB)';
        case 'SHBM': return 'SHB';
        case 'VIBM': return 'VIBank';
        case 'PBVN': return 'Ngân hàng TNHH MTV Public Việt Nam';
        case 'VCBM': return 'VietcomBank';
        case 'VRBM': return 'Ngân hàng Việt Nga';
        case 'WRBM': return 'Ngân hàng Woori Bank';
        case 'SVBM': return 'Ngân Hàng Shinhan Việt Nam';
        case 'SGBM': return 'Ngân hàng TMCP Sài gòn Công thương';
        case 'UOBM': return 'Ngân hàng TNHH MTV United Overseas Bank';
        default: return 'Chưa xác định';
    }
}

export const convertClassOfFlightBooking = (code) => {
    // vietnam airlines
    if (['J', 'C', 'D', 'I'].indexOf(code) >= 0) return 'Thương gia';
    else if (['U', 'Z', 'W'].indexOf(code) >= 0) return 'Phổ thông đặc biệt';
    else if (['Y', 'B', 'M', 'S'].indexOf(code) >= 0) return 'Phổ thông linh hoạt';
    else if (['H', 'K', 'L', 'Q', 'N', 'R'].indexOf(code) >= 0) return 'Phổ thông tiêu chuẩn';
    else if (['T', 'G', 'A', 'E', 'P'].indexOf(code) >= 0) return 'Phổ thông tiết kiệm';
    // bamboo
    else if (code == 'ECONOMYSAVERMAX') return 'Economy SaverMAX';
    else if (code == 'ECONOMYSAVER') return 'Economy Saver';
    else if (code == 'ECONOMYSMART') return 'Economy Smart';
    else if (code == 'ECONOMYFLEX') return 'Economy Flex';
    else if (code == 'PREMIUMSMART') return 'Premium Smart';
    else if (code == 'PREMIUMFLEX') return 'Premium Flex';
    else if (code == 'BUSINESSSMART') return 'Business Smart';
    else if (code == 'BUSINESSFLEX') return 'Business Flex';
    // vietjet
    else if (code == 'Eco') return 'Economy (Phổ thông)';
    // else if (code = 'Deluxe') return 'Deluxe';
    // else if (code == 'SkyBoss') return 'SkyBoss';
    else if (code = 'Deluxe') return 'Deluxe (Cao cấp)';
    else if (code == 'SkyBoss') return 'Business (Thương gia)';
}


export const convertTime = (minutes) => {
    var hour = Math.floor(minutes / 60);
    var remainMinutes = minutes - hour * 60;
    if (remainMinutes == 0) return `${hour}h`;
    return `${hour}h${remainMinutes}m`;
}
