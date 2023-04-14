import {
    GET_ALL_OFFICE,
    ADD_A_OFFICE,
    UPDATE_OFFICE,
    DELETE_OFFICE,
    GET_ALL_OFFICE_WITHOUT_PAGINATE,
  } from "./types";
  import api from "../api";
  import qs from "qs";
  import { NotificationManager } from "react-notifications";
  
  export const getAllOffice = (filter, paginate = true) => dispatch => {
    console.log("filter", filter);
  
    return new Promise((resolve, reject) => {
      api
        .get("/office/list", {
          params: { ...filter },
          paramsSerializer: params => {
            return qs.stringify(params, { encodeValuesOnly: true });
          }
        })
        .then(res => {
          resolve(res.data);
          if (paginate) {
            dispatch({ type: GET_ALL_OFFICE, payload: res.data.data });
          } else {
            dispatch({ type: GET_ALL_OFFICE_WITHOUT_PAGINATE, payload: res.data.data });
          }
        })
        .catch(error => {
          reject(error);
          console.log(error.response);
          // NotificationManager.error(error.response.data.message);
        });
    });
  };
  
  export const createOffice = destination => dispatch => {
    console.log("------", destination);
    return new Promise((resolve, reject) => {
      api
        .post("/office/save", destination)
        .then(res => {
          dispatch({ type: ADD_A_OFFICE, payload: res.data.data });
          NotificationManager.success("Create success");
          resolve(res.data);
        })
        .catch(error => {
          reject(error.response.data);
          NotificationManager.error("Can't create item");
        });
    });
  };
  
  export const updateOffice = data => dispatch => {
    return new Promise((resolve, reject) => {
      api
        .post(`/office/update/${data.id}`, data)
        .then(res => {
          dispatch({ type: UPDATE_OFFICE, payload: res.data.data });
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
  
  export const batchDelete = ids => dispatch => {
    // console.log('ids',this);
  
    return new Promise((resolve, reject) => {
      api
        .delete("/office/delete", {data:ids})
        .then(res => {
          dispatch({ type: DELETE_OFFICE, payload: res.data.data });
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
  
  