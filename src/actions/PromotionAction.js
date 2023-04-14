import {
    GET_ALL_PROMOTION,
    CREATE_NEW_PROMOTION,
    UPDATE_PROMOTION,
    GET_PROMOTION_DETAIL,
    DELETE_PROMOTION,
    CREATE_NEW_PROMOTION_PRODUCT,
    GET_ALL_PROMOTION_PRODUCT,
    DELETE_PROMOTION_PRODUCT
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";
var FileSaver = require('file-saver');

export const _getAll = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .get(`/promotion/list`, {
                params: { ...filter },
                paramsSerializer: params => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                }
            })
            .then(res => {
                resolve(res.data);
                dispatch({ type: GET_ALL_PROMOTION, payload: res.data.data });
            })
            .catch(error => {
                console.log(error.response)
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};


export const _getDetail = (id) => dispatch => {
    console.log("id", id)
    return new Promise((resolve, reject) => {
        api
            .get(`/promotion/load/${id}`)
            .then(res => {
                resolve(res.data);
                dispatch({ type: GET_PROMOTION_DETAIL, payload: res.data.data });
            })
            .catch(error => {
                console.log(error.response)
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};



export const _getAllPromotionProduct = (id) => dispatch => {
    console.log("id", id)
    return new Promise((resolve, reject) => {
        api
            .get(`/promotion_product/list/${id}`)
            .then(res => {
                resolve(res.data);
                dispatch({ type: GET_ALL_PROMOTION_PRODUCT, payload: res.data.data });
            })
            .catch(error => {
                console.log(error.response)
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};


export const _create = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .post("/promotion/save", data)
            .then(res => {
                resolve(res.data);
                dispatch({ type: CREATE_NEW_PROMOTION, payload: res.data.data });
                NotificationManager.success(res.data.message);
            })
            .catch(error => {
                reject(error.response);
                NotificationManager.error(error.response.data.message);
            });
    });
};


export const _update = data => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .post(`/promotion/update/${data.id}`, data)
            .then(res => {
                resolve(res.data);
                console.log(res.data)
                dispatch({ type: UPDATE_PROMOTION, payload: res.data.data });
                NotificationManager.success(res.data.message);
            })
            .catch(error => {
                console.log(error)
                reject(error.response);
                NotificationManager.error(error.response.data.message);
            });
    });
};

export const _delete = ids => dispatch => {
    console.log(ids)
    return new Promise((resolve, reject) => {
        api
            .delete("/promotion/delete", { data: ids })
            .then(res => {
                dispatch({ type: DELETE_PROMOTION, payload: ids });
                NotificationManager.success("Deleted success");
                resolve(res.data);
            })
            .catch(error => {
                console.log(error);

                reject(error.response);
                NotificationManager.error(error.response.data.message);
            });
    });
};

export const _getAllTour = (filter = {}) => {

    return new Promise((resolve, reject) => {
        api
            .get("/tour/list", {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                },
            })
            .then((res) => {
                resolve(res.data.data);

            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const _getAllRoom = (filter = {}) => {
    return new Promise((resolve, reject) => {
        api
            .get("/room/list", {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                },
            })
            .then((res) => {
                resolve(res.data.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error);
            });
    });
};


export const _getAllTicket = (filter = {}) => {
    return new Promise((resolve, reject) => {
        api
            .get("/ticket/list", {
                params: { ...filter },
                paramsSerializer: params => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                }
            })
            .then(res => {
                resolve(res.data.data);
            })
            .catch(error => {
                console.log(error.response);
                reject(error);
            });
    });
};

export const _getAllRoute = (filter = {}) => {

    return new Promise((resolve, reject) => {
        api
            .get("/route/list", {
                params: { ...filter },
                paramsSerializer: params => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                }
            })
            .then((res) => {
                resolve(res.data.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error);
            });
    });
};

export const _createPromotionProduct = (data, title) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .post("/promotion_product/save", data)
            .then(res => {
                resolve(res.data);
                dispatch({ type: CREATE_NEW_PROMOTION_PRODUCT, payload: { ...res.data.data, title: title } });
                NotificationManager.success(res.data.message);
            })
            .catch(error => {
                reject(error.response);
                NotificationManager.error(error.response.data.message);
            });
    });
};

export const _deletePromotionProduct = id => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .delete(`/promotion_product/delete/${id}`)
            .then(res => {
                dispatch({ type: DELETE_PROMOTION_PRODUCT, payload: id });
                NotificationManager.success("Deleted success");
                resolve(res.data);
            })
            .catch(error => {
                console.log(error);

                reject(error.response);
                NotificationManager.error(error.response.data.message);
            });
    });
};

export const _exportPromotion = (filter = {}) => {
    return new Promise((resolve, reject) => {
        api
            .get(`/promotion/export`, {
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
                    ? `danh_sach_khuyen_mai_${time_stamp}.xlsx`
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