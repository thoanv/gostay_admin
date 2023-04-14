import {
  GET_LIST_BRAND,
  ADD_BRAND,
  UPDATE_BRAND,
  DELETE_BRAND
  } from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";
  
  export const _getAllManageBrand = (filter = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .get("/client/trademark/list", {
          params: { ...filter },
          paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then((res) => {
          dispatch({ type: GET_LIST_BRAND, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const _addManageBrand = (formData = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api.post(formData.get('edit') === 'true' ? `/trademark/update/${formData.get('id')}` : "/trademark/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then((res) => {
          dispatch({ type: formData.get('edit') === 'true' ? UPDATE_BRAND : ADD_BRAND, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const _deleteManageBrand = (params = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api.post("/trademark/delete", params)
        .then((res) => {
          dispatch({ type: DELETE_BRAND, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
