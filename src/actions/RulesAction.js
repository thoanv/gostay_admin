import {
    GET_ALL_RULES,
    ADD_A_RULES,
    UPDATE_RULES,
    DELETE_RULES,
} from 'Actions/types';
import api from '../api';
import { NotificationManager } from 'react-notifications';
import qs from 'qs';

export const getAllRules = (filter = {}) => dispatch => {
    
    return new Promise((resolve, reject) => {
        api.get('/loyalty/rule/list', {
            params: { ...filter },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        }).then(res => {
            dispatch({ type: GET_ALL_RULES, payload: res.data.data });
            resolve(res.data);
            console.log(res.data);
            
        }).catch(error => {
            console.log(error.response);
            
            reject(error);
            NotificationManager.error(error.response.data.message);
        })
    })
}

export const addRules = (rules) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post('/loyalty/rule/save', rules).then(res => {
            dispatch({ type: ADD_A_RULES, payload: res.data.data });
            NotificationManager.success(res.data.message);
            resolve(res.data);
        }).catch(error => {
            reject(error.response.data);
            NotificationManager.error(error.response.data.message)
        })
    })
}

export const updateRules = (rule) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post(`/loyalty/rule/update/${rule.id}`, rule).then(response => {
            dispatch({ type: UPDATE_RULES, payload: response.data.data });
            NotificationManager.success(response.data.message);
            resolve(response.data);
        }).catch(error => {
            NotificationManager.error(error.response.data.message);
            reject(error.response.data);
            console.log(error.response.data.message);
            
        })
    })
}
export const deleteRules = (ids) => dispatch => {
    return new Promise((resolve, reject) => {
        api.delete('/loyalty/rule/delete', {data:ids}).then(res => {
            dispatch({ type: DELETE_RULES, payload: res.data.data });
            NotificationManager.success('Delete success');
            resolve(res.data);
        }).catch(error => {
            NotificationManager.error('Delete false');
            reject(error);
        })
    })
}
