import { NotificationManager } from 'react-notifications';
import {
    GET_ALL_WIDGETS,
    ADD_A_WIDGET,
    UPDATE_WIDGET,
    DELETE_WIDGET,
    GET_A_WIDGET
} from 'Actions/types';
import qs from 'qs';
import api from '../api';
import axios from 'axios';
import { NEW_PRODUCT_COMBO, NEW_PRODUCT_VOUCHER, NEW_PRODUCT_TOUR, NEW_PRODUCT_HOTEL, NEW_TRADE_MARK, NEW_BLOG } from './types';

export const getAllWidgets = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get('/widgets/list', {
            params: { ...filter },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        }).then(res => {
            dispatch({ type: GET_ALL_WIDGETS, payload: res.data.data, message: res.data.message });
            resolve(res.data.data);
        }).catch(error => {
            reject(error);
            console.log(error)
            // NotificationManager.error(error);
        })
    })
}

export const getAllCombo = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post('/client/combo/search', {
            params: { ...filter },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        }).then(res => {
            const list = Object.keys(res.data.data).reverse().map(key => res.data.data[key])
            dispatch({ type: NEW_PRODUCT_COMBO, payload: {list} });
            resolve(res.data.data);
        }).catch(error => {
            reject(error);
            console.log(error)
            // NotificationManager.error(error);
        })
    })
}

export const getAllTour = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post('/client/tour/search', {
            params: { ...filter },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        }).then(res => {
            // console.log(res.data)
            const list = Object.keys(res.data.data).reverse().map(key => res.data.data[key])
            dispatch({ type: NEW_PRODUCT_TOUR, payload: {list} });
            resolve(res.data.data);
        }).catch(error => {
            reject(error);
            console.log(error)
            // NotificationManager.error(error);
        })
    })
}

export const getAllVoucher = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post('/voucher/admin/list', {
            params: { ...filter },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        }).then(res => {
            // console.log(res.data)
            dispatch({ type: NEW_PRODUCT_VOUCHER, payload: {list: []} });
            resolve(res.data.data);
        }).catch(error => {
            reject(error);
            console.log(error)
            // NotificationManager.error(error);
        })
    })
}

export const getAllHotel = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post('/client/hotel/list', {
            params: { ...filter },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        }).then(res => {
            dispatch({ type: NEW_PRODUCT_HOTEL, payload: res.data.data });
            resolve(res.data.data);
        }).catch(error => {
            reject(error);
            console.log(error)
            // NotificationManager.error(error);
        })
    })
}

export const getAllTradeMark = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get('/client/trademark/list', {
            params: { ...filter },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        }).then(res => {
            // console.log(res.data)
            dispatch({ type: NEW_TRADE_MARK, payload: res.data.data });
            resolve(res.data.data);
        }).catch(error => {
            reject(error);
            console.log(error)
            // NotificationManager.error(error);
        })
    })
}

export const getAllBlog = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        return axios.get('https://blog.2stay.vn/api/categories/list').then(res => {
            dispatch({type: NEW_BLOG, payload: res.data.data});
            // NotificationManager.success(res.data.message);
            resolve(res.data);
        }).catch(err => {
            reject(err);
            console.log(err);
        })
    })
}

export const getWidgetDetail = (id) => dispatch => {
    return new Promise((resolve, reject) => {
        return api.get(`/widgets/load/${id}`).then(res => {
            dispatch({ type: GET_A_WIDGET, payload: res.data.data });
            resolve(true)
        }).catch(error => {
            reject(error);
            NotificationManager.error(error.response.data.message);
        })
    })
}

export const addWidget = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        return api.post('/widgets/save', data).then(res => {
            dispatch({ type: ADD_A_WIDGET, payload: res.data.data });
            NotificationManager.success(res.data.message);
            resolve(true)
        }).catch(error => {
            reject(error);
            console.log(error.response)
            NotificationManager.error(error.response.data.message);
        })
    })
}

export const updateWidget = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        return api.post(`/widgets/update/${data.id}`, data).then(res => {
            dispatch({ type: UPDATE_WIDGET, payload: res.data.data });
            NotificationManager.success(res.data.message);
            resolve(true)
        }).catch(error => {
            reject(error);
            NotificationManager.error(error.response.data.message);
        })
    })
}

export const deleteWidget = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        return api.delete('/widgets/delete', { data: data }).then(res => {
            dispatch({ type: DELETE_WIDGET, payload: data.id });
            NotificationManager.success(res.data.message);
            resolve(true)
        }).catch(error => {
            reject(error);
            console.log(error)
        })
    })
}