import {
    GET_HOMEPAGE_WIDGETS,
    UPDATE_HOMEPAGE_WIDGETS
} from 'Actions/types';
import api from '../api';
import { NotificationManager } from 'react-notifications';

export const getHomepageWidgets = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get('/homepage-widgets/list', data).then(res => {
            dispatch({ type: GET_HOMEPAGE_WIDGETS, payload: res.data.data });
            resolve(res.data.data);
        }).catch(error => {
            reject(error);
            console.log(error)
            NotificationManager.error(error.response.data.message);
        })
    })
}

export const updateHomepageWidgets = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post('/homepage-widgets/save', data).then(res => {
            dispatch({ type: UPDATE_HOMEPAGE_WIDGETS, payload: res.data.data });
            resolve(res.data);
            NotificationManager.success("Cập nhật trang chủ thành công");
        }).catch(error => {
            reject(error);
            console.log(error)
            NotificationManager.error(error.response.data.message);
        })
    })
}