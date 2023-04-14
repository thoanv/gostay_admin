import {
    GET_ALL_HOLIDAYS,
    GET_ALL_HOLIDAY_EXCHANGES
} from './types';
import api from "../api";
import qs from 'qs';

export const getAllHolidays = (filter) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get(`/holiday/list`, {
            params: filter,
            paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        }).then(res => {
            resolve(res.data)

            dispatch({ type: GET_ALL_HOLIDAYS, payload: res.data.data })
        }).catch(err => {
            reject(err)
            console.log(err);
        })
    })
}

export const getAllHolidayExchanges = (filter) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get(`/holiday/holiday-exchanges`, {
            params: filter,
            paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        }).then(res => {
            resolve(res.data)

            dispatch({ type: GET_ALL_HOLIDAY_EXCHANGES, payload: res.data.data })
        }).catch(err => {
            reject(err)
            console.log(err);
        })
    })
}

