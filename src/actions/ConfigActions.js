import {
    GET_CONFIG,
    SET_CONFIG,
    RESET_CONFIG,
    GET_BLOG_CATEGORIES
} from './types';
import api from '../api';
import { NotificationManager } from 'react-notifications';
import axios from 'axios';

export const getConfig = () => dispatch => {
    return new Promise((resolve, reject) => {
        return api.get('/common/getSetting').then(res => {
            dispatch({type: GET_CONFIG, payload: res.data.data});
            // NotificationManager.success(res.data.message);
            resolve(res.data.data);
        }).catch(err => {
            reject(err);
            console.log(err);
        })
    })
}

export const setConfig = (data) => dispatch => {
    return api.post('/common/setconfig', {config: data}).then(res => {
        dispatch({type: SET_CONFIG, payload: res.data.data});
        NotificationManager.success(res.data.message)
    }).catch(err => {
        // NotificationManager.err()
        console.log(err);
    })
}

export const resetConfig = () => dispatch => {
    dispatch({type: RESET_CONFIG});
}

export const getBlogCategories = () => dispatch => {
    return new Promise((resolve, reject) => {
        return axios.get('https://2stay.vn/blog/wp-json/wp/v2/categories').then(res => {
            dispatch({type: GET_BLOG_CATEGORIES, payload: res.data});
            // NotificationManager.success(res.data.message);
            resolve(res.data);
        }).catch(err => {
            reject(err);
            console.log(err);
        })
    })
}