import {
    GET_ORDER_PAYMENT_INFO,
    CANCEL_STAY_ORDER,
    CANCEL_ROUTE_ORDER,
    CANCEL_FLIGHT_ORDER,
    CONFIRM_PROOF_OF_PAYMENT, GET_ALL_ORDER_TOUR
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getOrderPaymentInfo = (orderId) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.get(`/orders/payment?order_id=${orderId}`).then((res) => {
            if (res.data.data.resultCd == '00_000') {
                resolve(res.data.data.data);
                dispatch({ type: GET_ORDER_PAYMENT_INFO, payload: res.data.data });
            } else {
                NotificationManager.error(res.data.data.resultMsg);
            }
        }).catch((error) => {
            reject(error);
            console.log(error.response)
        });
    });
};

export const cancelStayOrder = (orderId) => (dispatch) => {
    return new Promise((resolve, reject) => {
        console.log(orderId)
        api.post(`/orders/cancel/stay`, {order_id: orderId}).then((res) => {
            resolve(res.data.data);
            dispatch({ type: CANCEL_STAY_ORDER, payload: res.data.data });
            NotificationManager.success("Huỷ đơn hàng thành công");
        }).catch((error) => {
            reject(error);
            console.log(error.response)
            NotificationManager.error("Đã có lỗi xảy ra. Vui lòng thử lại");
        });
    });
};

export const cancelRouteOrder = (orderId) => (dispatch) => {
    return new Promise((resolve, reject) => {
        console.log(orderId)
        api.post(`/orders/cancel/route`, {order_id: orderId}).then((res) => {
            resolve(res.data.data);
            dispatch({ type: CANCEL_ROUTE_ORDER, payload: res.data.data });
            NotificationManager.success("Huỷ đơn hàng thành công");
        }).catch((error) => {
            reject(error);
            console.log(error.response)
            NotificationManager.error("Đã có lỗi xảy ra. Vui lòng thử lại");
        });
    });
};

export const cancelFlightOrder = (orderId) => (dispatch) => {
    return new Promise((resolve, reject) => {
        console.log(orderId)
        api.post(`/orders/cancel/flight`, {order_id: orderId}).then((res) => {
            resolve(res.data.data);
            dispatch({ type: CANCEL_FLIGHT_ORDER, payload: res.data.data });
            NotificationManager.success("Huỷ đơn hàng thành công");
        }).catch((error) => {
            reject(error);
            console.log(error.response)
            NotificationManager.error("Đã có lỗi xảy ra. Vui lòng thử lại");
        });
    });
};

export const confirmProofOfPayment = (orderId, data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.post(`/orders/${orderId}/confirm-proof`, data).then((res) => {
            resolve(res.data.data);
            dispatch({ type: CONFIRM_PROOF_OF_PAYMENT, payload: res.data.data });
            NotificationManager.success("Thành công");
        }).catch((error) => {
            reject(error);
            console.log(error.response)
            NotificationManager.error("Đã có lỗi xảy ra. Vui lòng thử lại");
        });
    });
};

export const confirmHotelProofOfPayment = (orderId, data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.post(`/orders/${orderId}/confirm-proof`, data).then((res) => {
            resolve(res.data.data);
            dispatch({ type: CONFIRM_PROOF_OF_PAYMENT, payload: res.data.data });
            NotificationManager.success("Thành công");
        }).catch((error) => {
            reject(error);
            console.log(error.response)
            NotificationManager.error("Đã có lỗi xảy ra. Vui lòng thử lại");
        });
    });
};

export const confirmEventProofOfPayment = (orderId, data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.post(`/orders/${orderId}/confirm-proof`, data).then((res) => {
            resolve(res.data.data);
            dispatch({ type: CONFIRM_PROOF_OF_PAYMENT, payload: res.data.data });
            NotificationManager.success("Thành công");
        }).catch((error) => {
            reject(error);
            console.log(error.response)
            NotificationManager.error("Đã có lỗi xảy ra. Vui lòng thử lại");
        });
    });
};

export const confirmVoucherProofOfPayment = (orderId, data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api.post(`/orders/${orderId}/confirm-proof`, data).then((res) => {
            resolve(res.data.data);
            dispatch({ type: CONFIRM_PROOF_OF_PAYMENT, payload: res.data.data });
            NotificationManager.success("Thành công");
        }).catch((error) => {
            reject(error);
            console.log(error.response)
            NotificationManager.error("Đã có lỗi xảy ra. Vui lòng thử lại");
        });
    });
};

export const getAllOrderHotel = (filter) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api
            .get("/orders/admin/hotel", {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                },
            })
            .then((res) => {
                resolve(res.data);
                dispatch({ type: GET_ALL_ORDER_TOUR, payload: res.data.data });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getAllOrderVoucher = (filter) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api
            .get("/orders/voucher", {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                },
            })
            .then((res) => {
                resolve(res.data);
                dispatch({ type: GET_ALL_ORDER_TOUR, payload: res.data.data });
            })
            .catch((error) => {
                reject(error);
            });
    });
};


export const getAllOrderEvent = (filter) => (dispatch) => {
    return new Promise((resolve, reject) => {
        api
            .get("/orders/event", {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                },
            })
            .then((res) => {
                resolve(res.data);
                dispatch({ type: GET_ALL_ORDER_TOUR, payload: res.data.data });
            })
            .catch((error) => {
                reject(error);
            });
    });
};