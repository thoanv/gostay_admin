import { NotificationManager } from 'react-notifications';
import {
   LOGIN_USER,
   LOGIN_USER_SUCCESS,
   LOGIN_USER_ERROR,
   LOGOUT_USER,
   TOKEN_EXPIRED,
   CHECK_TOKEN_SUCCESS,
   GET_MY_PERMISSION
} from 'Actions/types';
import api from '../api';
import { setCookie, removeCookie, getCookie } from '../helpers/session';
import { CHECK_TOKEN_ERROR } from './types';

export const login = (data) => dispatch => {
   return new Promise((resolve, reject) => {


      dispatch({ type: LOGIN_USER });
      return api.post('/auth/login', data)
         .then(res => {
            removeCookie('2stay_token');
            setCookie('2stay_token', res.data.data.token, 7);
            // localStorage.setItem('token', res.data.data.token);
            dispatch({ type: LOGIN_USER_SUCCESS, payload: res.data.data, message: res.data.message });
            NotificationManager.success(res.data.message);
            resolve(true)
         })
         .catch(error => {
            // reject(error);
            NotificationManager.error('Email or password is incorrect ');
            dispatch({ type: LOGIN_USER_ERROR, payload: error.response.data, message: error.response.data.message });
         })
   })
}
export const checkToken = (data) => dispatch => {
   return new Promise((resolve, reject) => {
      return api.get('/customer/loadByToken').then(response => {
         dispatch({ type: CHECK_TOKEN_SUCCESS, payload: response.data.data, message: response.data.message })
         resolve(response.data.data)
      }).catch(
         error => {
            reject(error.response);
            dispatch({ type: CHECK_TOKEN_ERROR, payload: error.response.data, message: error.response.data.message })
            NotificationManager.error('token expired');
            console.log(error.response);
         }
      )
   })
}

export const _getMyPermission = () => dispatch => {

   return new Promise((resolve, reject) => {
      api
         .get(`/myPermissions`)
         .then(res => {
            resolve(res.data);
            dispatch({ type: GET_MY_PERMISSION, payload: res.data.data });
         })
         .catch(error => {
            reject(error.response);
            // NotificationManager.error('Có lỗi xảy ra, vui lòng thử lại');
            console.log(error.response);
         });
   });
};
