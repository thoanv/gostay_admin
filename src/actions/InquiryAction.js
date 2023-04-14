import {
    GET_ALL_INQUIRY,
    ADD_A_INQUIRY,
    UPDATE_INQUIRY,
    DELETE_INQUIRY,
  } from "./types";
  import api from "../api";
  import qs from "qs";
  import { NotificationManager } from "react-notifications";
  
  export const getAllInquiry = (filter, paginate = true) => dispatch => {
    console.log("filter", filter);
  
    return new Promise((resolve, reject) => {
      api
        .get("/inquiry/list", {
          params: { ...filter },
          paramsSerializer: params => {
            return qs.stringify(params, { encodeValuesOnly: true });
          }
        })
        .then(res => {
          dispatch({ type: GET_ALL_INQUIRY, payload: res.data.data });
          resolve(res.data);
        })
        .catch(error => {
          reject(error);
          // NotificationManager.error(error.response.data.message);
        });
    });
  };
  
  export const createInquiry = data => dispatch => {
    console.log(data);
    return new Promise((resolve, reject) => {
      api
        .post("/inquiry/save", data)
        .then(res => {
          
          dispatch({ type: ADD_A_INQUIRY, payload: res.data.data });
          NotificationManager.success("Create success");
          resolve(res.data);
        })
        .catch(error => {
          reject(error.response.data);
          NotificationManager.error("Can't create item");
        });
    });
  };
  
  export const updateInquiry = data => dispatch => {
    return new Promise((resolve, reject) => {
      api
        .post(`/inquiry/update/${data.id}`, data)
        .then(res => {
          dispatch({ type: UPDATE_INQUIRY, payload: res.data.data });
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
    return new Promise((resolve, reject) => {
      api
        .delete("/inquiry/delete", {data:ids})
        .then(res => {
          dispatch({ type: DELETE_INQUIRY, payload: res.data.data });
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
  
  