import { NotificationManager } from 'react-notifications';
import {
   LIST_PRODUCT,
   LIST_PRODUCT_SUCCESS,
   LIST_PRODUCT_ERROR
} from 'Actions/types';
import api from '../api';

export const listProduct = (params) => dispatch => {
   return new Promise((resolve, reject) => {
      dispatch({ type: LIST_PRODUCT});
      return api.get('/product/list', params)
         .then(res => {
         console.log(res);
         dispatch({ type: LIST_PRODUCT_SUCCESS, payload: res.data.data, message:res.data.message });
         NotificationManager.success(res.data.msg);
         resolve(true)
      })
         .catch(error => {
            // reject(error);
            NotificationManager.error(error.response.data.message);
            dispatch({ type: LIST_PRODUCT_ERROR, payload: error.response.data, message: error.response.data.message });
         })
   })
}
