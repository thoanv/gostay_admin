import {
    GET_ALL_CURRENCY,
    ADD_A_CURRENCY,
    UPDATE_CURRENCY,
    DELETE_CURRENCY,
    UPDATE_STATUS_CURRENTCY
  } from "./types";
  import api from "../api";
  import qs from "qs";
  import { NotificationManager } from "react-notifications";
  
  export const getAllCurrency = (filter, paginate = true) => dispatch => {
    console.log("filter", filter);
  
    return new Promise((resolve, reject) => {
      api
        .get("/currency/list", {
          params: { ...filter },
          paramsSerializer: params => {
            return qs.stringify(params, { encodeValuesOnly: true });
          }
        })
        .then(res => {
          resolve(res.data);
          dispatch({ type: GET_ALL_CURRENCY, payload: res.data.data });
          
         
  
        })
        .catch(error => {
          reject(error);
          console.log(error);
          // NotificationManager.error(error.response.data.message);
        });
    });
  };
  
  export const createCurrency= destination => dispatch => {
    console.log("------", destination);
    return new Promise((resolve, reject) => {
      api
        .post("/currency/save", destination)
        .then(res => {
          dispatch({ type: ADD_A_CURRENCY, payload: res.data.data });
          NotificationManager.success("Create success");
          resolve(res.data);
        })
        .catch(error => {
          reject(error.response.data);
          NotificationManager.error("Can't create item");
        });
    });
  };
  
  export const updateCurrency= data => dispatch => {
    return new Promise((resolve, reject) => {
      api
        .post(`/currency/update/${data.id}`, data)
        .then(res => {
          dispatch({ type: UPDATE_CURRENCY, payload: res.data.data });
          NotificationManager.success("Update success");
          resolve(res.data);
        })
        .catch(error => {
          reject(error.response.data);
          // NotificationManager.error(error.response.data.message);
          NotificationManager.error("Can't update");
          // console.log(error);
        });
    });
  };
  
  export const updateCurrencytatus = data => dispatch => {
    return new Promise((resolve, reject) => {
      api
        .post("/common/status", data)
        .then(res => {
          dispatch({ type: UPDATE_STATUS_CURRENTCY, payload: res.data.data });
          // NotificationManager.success('Update status success');
          resolve(res.data);
        })
        .catch(error => {
          reject(error);
          // NotificationManager.error('Can\'t status update');
        });
    });
  };
  
  
  export const batchDelete = ids => dispatch => {
    // console.log('ids',this);
  
    return new Promise((resolve, reject) => {
      api
        .delete("/currency/delete", {data:ids})
        .then(res => {
          dispatch({ type: DELETE_CURRENCY, payload: res.data.data });
          NotificationManager.success("Deleted success");
          resolve(res.data);
        })
        .catch(error => {
          console.log(error);
  
          NotificationManager.error("Can't delete");
          reject(error);
        });
    });
  };