import {
    GET_ALL_PAGES,
    ADD_A_PAGES,
    UPDATE_PAGES,
    DELETE_PAGES,
} from 'Actions/types';
import api from '../api';
import { NotificationManager } from 'react-notifications';
import qs from 'qs';

export const getAllPages = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get('/content/list', {
            params: { ...filter },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        }).then(res => {
            dispatch({ type: GET_ALL_PAGES, payload: res.data.data });
           
            
            resolve(res.data);
        }).catch(error => {
            reject(error);
            NotificationManager.error(error.response.data.message);
        })
    })
}

export const addPages = (data) => dispatch => {
    console.log(data);
    
    return new Promise((resolve, reject) => {
        api.post('/content/save', data).then(res => {
            console.log('response',res);
            dispatch({ type: ADD_A_PAGES, payload: res.data.data });
            
            
            NotificationManager.success(res.data.message);
            resolve(res.data);
        }).catch(error => {
            // reject(error.response);
            console.log('erorr',error.response);
            
            NotificationManager.error(error.response.data.message)
        })
    })
}

export const updatePages = (page) => dispatch => {
   
    return new Promise((resolve, reject) => {
        api.post(`/content/update/${page.id}`, page).then(response => {
            
            dispatch({ type: UPDATE_PAGES, payload: response.data.data });
            NotificationManager.success(response.data.message);
            resolve(response.data);
        }).catch(error => {
            NotificationManager.error(error.response.data.message);
            reject(error.response.data);
            console.log(error.response.data.message);
            
        })
    })
}
export const deletePages = (ids) => dispatch => {
    return new Promise((resolve, reject) => {
        api.delete('/content/delete', {data:ids}).then(res => {
            dispatch({ type: DELETE_PAGES, payload: res.data.data });
            NotificationManager.success('Delete success');
            resolve(res.data);
        }).catch(error => {
            NotificationManager.error('Delete false');
            reject(error);
        })
    })
}
