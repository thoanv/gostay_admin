import {
    GET_ALL_EMAIL,
    ADD_A_EMAIL,
    UPDATE_EMAIL,
    DELETE_EMAIL,
    UPDATE_STATUS_EMAIL,
    GET_ALL_EMAIL_WITHOUT_PAGINATE
  } from './types';
  import api from "../api";
  import qs from "qs";
  import { NotificationManager } from "react-notifications";
  
  export const getAllEmail = (filter, paginate = true) => dispatch => {
    console.log("filter", filter);
  
    return new Promise((resolve, reject) => {
      api
        .get("/messagetmpl/list", {
          params: { ...filter },
          paramsSerializer: params => {
            return qs.stringify(params, { encodeValuesOnly: true });
          }
        })
        .then(res => {
          resolve(res.data);
          dispatch({ type: GET_ALL_EMAIL, payload: res.data.data });
        })
        .catch(error => {
          reject(error);
          console.log(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
  
  export const createEmail = destination => dispatch => {
    return new Promise((resolve, reject) => {
      api
        .post("/messagetmpl/save", destination)
        .then(res => {
          console.log(res);
          // return;
          dispatch({ type: ADD_A_EMAIL, payload: res.data.data });
          NotificationManager.success("Create success");
          resolve(res.data);
        })
        .catch(error => {
          reject(error.response.data);
          NotificationManager.error("Can't create item");
        });
    });
  };
  
  export const updateEmail = data => dispatch => {
    return new Promise((resolve, reject) => {
      api
        .post(`/messagetmpl/update/${data.id}`, data)
        .then(res => {
          dispatch({ type: UPDATE_EMAIL, payload: res.data.data });
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
  
  export const updateEmailStatus = data => dispatch => {
    return new Promise((resolve, reject) => {
      api
        .post("/common/status", data)
        .then(res => {
          dispatch({ type: UPDATE_STATUS_EMAIL, payload: res.data.data });
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
        .delete("/messagetmpl/delete", {data:ids})
        .then(res => {
          dispatch({ type: DELETE_EMAIL, payload: res.data.data });
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
  