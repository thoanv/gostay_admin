import qs from 'qs';
import api from '../api';
import { NotificationManager } from 'react-notifications';
import {
    GET_ALL_WISHLIST,
    GET_DETAIL_WISHLIST,
    GET_WISHLIST_LOG
} from './types';

export const getAllWishlist = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .get(`/wishlist/list`, {
                params: { ...filter },
                paramsSerializer: params => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                }
            })
            .then(res => {
                console.log(res, 'getWishlist');
                resolve(res.data);
                dispatch({ type: GET_ALL_WISHLIST, payload: res.data.data });
            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const getDetailWishlist = (id) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .get(`/wishlist/load/${id}`, {
            })
            .then(res => {
                console.log('detail wl', res)
                resolve(res.data);
                dispatch({ type: GET_DETAIL_WISHLIST, payload: res.data.data });
            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};
export const getAllWishlistLog = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .get(`/wishlist/logs`, {
                params: { ...filter },
                paramsSerializer: params => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                }
            })
            .then(res => {
                resolve(res.data);
               
                dispatch({ type: GET_WISHLIST_LOG, payload: res.data.data });
            })
            .catch(error => {
                reject(error);
            });
    });
};