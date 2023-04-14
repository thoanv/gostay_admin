import {
    GET_ALL_ACTIVITY,
    ADD_A_ACTIVITY,
    UPDATE_ACTIVITY,
    DELETE_ACTIVITY,
} from 'Actions/types';
import api from '../api';
import { NotificationManager } from 'react-notifications';
import qs from 'qs';

export const getAllActivity = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get('/loyalty/activity/list', {
            params: { ...filter },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        }).then(res => {
            dispatch({ type: GET_ALL_ACTIVITY, payload: res.data.data });
            resolve(res.data);
        }).catch(error => {
            reject(error);
            NotificationManager.error(error.response.data.message);
        })
    })
}

export const addActivity = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post('/loyalty/activity/save', data).then(res => {
            dispatch({ type: ADD_A_ACTIVITY, payload: res.data.data });
            NotificationManager.success(res.data.message);
            resolve(res.data);
        }).catch(error => {
            reject(error.response.data);
            NotificationManager.error(error.response.data.message)
        })
    })
}

export const updateActivity = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post(`/loyalty/activity/update/${data.id}`, data).then(response => {
            dispatch({ type: UPDATE_ACTIVITY, payload: response.data.data });
            NotificationManager.success(response.data.message);
            resolve(response.data);
        }).catch(error => {
            NotificationManager.error(error.response.data.message);
            reject(error.response.data);
            
        })
    })
}
export const batchDelete = (ids) => dispatch => {
    return new Promise((resolve, reject) => {
        api.delete('/loyalty/activity/delete',{data: ids} ).then(res => {
            dispatch({ type: DELETE_ACTIVITY, payload: res.data.data });
            NotificationManager.success('Delete success');
            resolve(res.data);
        }).catch(error => {
            NotificationManager.error('Delete false');
            reject(error);
        })
    })
}
