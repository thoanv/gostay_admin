import { ADD_A_COUNTRY, DELETE_COUNTRY, GET_ALL_COUNTRY, UPDATE_COUNTRY } from 'Actions/types';
import qs from 'qs';
import { NotificationManager } from 'react-notifications';
import api from '../api';

export const getAllCountry = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get('/country/list', {
            params: { ...filter },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        }).then(res => {
            dispatch({ type: GET_ALL_COUNTRY, payload: res.data.data });
            resolve(res.data);
        }).catch(error => {
            reject(error);
            NotificationManager.error(error.response.data.message);
        })
    })
}

export const addCountry = (country) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post('/country/save', country).then(res => {
            dispatch({ type: ADD_A_COUNTRY, payload: res.data.data });
            resolve(res.data);
        }).catch(error => {
            reject(error.response.data);
            NotificationManager.error(error.response.data.message)
        })
    })
}

export const updateCountry = (country) => dispatch => {
    
    return new Promise((resolve, reject) => {
        api.post(`/country/update/${country.id}`, country).then(response => {
            dispatch({ type: UPDATE_COUNTRY, payload: response.data.data });
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
        api.delete('/country/delete', {data:ids}).then(res => {
            dispatch({ type: DELETE_COUNTRY, payload: res.data.data });
            NotificationManager.success('Delete success');
            resolve(res.data);
        }).catch(error => {
            NotificationManager.error('Delete false');
            reject(error);
        })
    })
}

