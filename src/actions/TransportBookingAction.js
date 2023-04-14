import {
    GET_ALL_ORDER_TRANSPORT,
    UPDATE_ORDER_TRANSPORT,
    DETAIL_ORDER_TRANSPORT,
    HANDLE_CANCEL_ORDER_TRANSPORT,
} from './types';
import api from '../api';
import qs from "qs";
import { NotificationManager } from "react-notifications";
var FileSaver = require('file-saver');


export const getAllOrder = (filter = {}) => (dispatch) => {

    return new Promise((resolve, reject) => {
        api
            .get("/orders/transfer", {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                },
            })
            .then((res) => {
                dispatch({ type: GET_ALL_ORDER_TRANSPORT, payload: res.data.data });
                resolve(res.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error);

            });
    });
};

export const updateOrder = (id) => (dispatch) => {

    return new Promise((resolve, reject) => {
        api
            .post(`order_sup/update/${id}/confirm`)
            .then((res) => {

                dispatch({ type: UPDATE_ORDER_TRANSPORT, payload: res.data.data });
                NotificationManager.success("Xác nhận thành công");
                resolve(res.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error);

            });
    });
};
export const _getDetailOrder = (id) => {
    return new Promise((resolve, reject) => {
        api
            .get(`orders/getTransferOrderDetailAdmin/${id}`)
            .then((res) => {
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
            .get("/orders/exportExcelTransfer", {
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
                    ? `danh_sach_don_hang_transport_${time_stamp}.xlsx`
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
                dispatch({ type: HANDLE_CANCEL_ORDER_TRANSPORT, payload: res.data.data });
                NotificationManager.success("Hoàn tiền cho đơn hàng thành công");
            })
            .catch((error) => {
                reject(error);
                NotificationManager.error("Đã có lỗi xảy ra. Vui lòng thử lại");
            });
    });
};