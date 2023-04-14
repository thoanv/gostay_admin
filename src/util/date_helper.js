import moment from "moment";
import { language } from "../../language/translate";

const DateHelper = {
    formatDuration: (from, to) => {
        let now = new moment(from);
        let too = new Date(to);
        let months = moment.duration(now.diff(too)).asMonths();
        let days = moment.duration(now.diff(too)).asDays();
        let hours = moment.duration(now.diff(too)).asHours();
        let minutes = moment.duration(now.diff(too)).asMinutes();
        let seconds = moment.duration(now.diff(too)).asSeconds();
        if (months > 2) {
            return Math.round(months) + language('global.xmonths_ago');
        } else {
            if (days > 2)
                return Math.round(days) + language('global.xdays_ago');
            else {
                if (hours > 2)
                    return Math.round(hours) + language('global.xhours_ago');
                else {
                    if (minutes > 1) {
                        return Math.round(minutes) + language('global.xminutes_ago');
                    } else {
                        return (Math.round(seconds) < 1 ? 1 : Math.round(seconds)) + language('global.xseconds_ago');
                    }
                }
            }
        }
    }, 
    formatDurationHours: (from, to) => {
        let now = new moment(new Date(from));
        let too = new Date(to);
        let hours = moment.duration(now.diff(too)).asHours();
        return hours
    },
    getCountDate: (from, to) => {
        let now = new moment(from);
        let too = new Date(to);
        let days = moment.duration(now.diff(too)).asDays();
        return days
    },
    formatDateDMY: (date) => {
        return moment(date).format("DD/MM/YYYY")
    },
    formatDateDM: (date) => {
        return moment(date).format("DD/MM")
    },
    formatDateHMDMY: (date) => {
        return moment(date).format('HH:mm DD/MM/YYYY')
    },
    timeHourAgo: (date) => {
        return moment(date).startOf('hour').fromNow();
    },
    timeHourAgo: (date) => {
        moment.lang('vi')
        return moment(date).startOf('minute').fromNow();
    },

}


export default DateHelper;