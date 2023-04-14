import {
    GET_ALL_ORDER_FLIGHT,
    UPDATE_ORDER_FLIGHT,
    DETAIL_ORDER_FLIGHT,
    ISSUE_TICKET_ORDER_FLIGHT,
    HANDLE_CANCEL_ORDER_FLIGHT
} from './types';
import api from '../api';
import qs from "qs";
import { NotificationManager } from "react-notifications";
var FileSaver = require('file-saver');


export const getAllOrder = (filter = {}) => (dispatch) => {
console.log(filter);
    return new Promise((resolve, reject) => {
        api
            .get("/orders/flight", {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                },
            })
            .then((res) => {
                console.log("res flight", res)
                dispatch({ type: GET_ALL_ORDER_FLIGHT, payload: res.data.data });
                resolve(res.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error);

            });
    });
};

export const issueTicketFlightOrder = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.post("/orders/flight/issue-ticket", data).then((res) => {
            console.log("res", res)
            dispatch({ type: ISSUE_TICKET_ORDER_FLIGHT, payload: res.data });
            if (res.data.Code == '0') {
                NotificationManager.success("Đã xuất vé thành công. Vui lòng kiểm tra thông tin vé đã được gửi tới email ticket@2stay.vn");
            } else {
                NotificationManager.error("Không thể xuất vé. Lý do: " + res.data.Message);
            }
            
            resolve(res.data);
        }).catch((error) => {
            console.log(error.response);
            reject(error);
        });
    });
}

export const updateOrder = (id) => (dispatch) => {

    return new Promise((resolve, reject) => {
        api
            .post(`orders/update/${id}/confirm`)
            .then((res) => {

                dispatch({ type: UPDATE_ORDER_FLIGHT, payload: res.data.data });
                NotificationManager.success("Xác nhận thành công");
                resolve(res.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error);

            });
    });
};
export const _getDetailOrder = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api
            .get(`/flights/order/${id}`)
            .then((res) => {
                console.log(res.data)
                dispatch({ type: DETAIL_ORDER_FLIGHT, payload: res.data.data });
                resolve(res.data.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error);
            });
    });
};

export const _exportOrder = (filter = {}) => {
    return new Promise((resolve, reject) => {
        api
            .get("/orders/exportExcelFlight", {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                },
                responseType: 'blob'
            })
            .then((response) => {
                resolve(response);
                console.log(response)
                let time_stamp = new Date().getTime();
                // Log somewhat to show that the browser actually exposes the custom HTTP header
                const fileNameHeader = "Content-Disposition";
                const suggestedFileName = response.headers[fileNameHeader];
                const effectiveFileName = (suggestedFileName === undefined
                    ? `danh_sach_don_hang_flight_${time_stamp}.xlsx`
                    : suggestedFileName);
                console.log("Received header [" + fileNameHeader + "]: " + suggestedFileName + ", effective fileName: " + effectiveFileName);
                // Let the user save the file.
                FileSaver.saveAs(response.data, effectiveFileName);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error);

            });
    });
};

export const handleCancel = (order_number, refundAmount) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api
            .post("/orders/handleCancelBooking", {
                orderNumber: order_number,
                amount: refundAmount
            })
            .then((res) => {
                resolve(res.data);
                dispatch({ type: HANDLE_CANCEL_ORDER_FLIGHT, payload: res.data.data });
                NotificationManager.success("Hoàn tiền cho đơn hàng thành công");
            })
            .catch((error) => {
                reject(error);
                NotificationManager.error("Đã có lỗi xảy ra. Vui lòng thử lại");
            });
    });
};