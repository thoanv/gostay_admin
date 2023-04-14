import {
  GET_LIST_POPUP,
  ADD_POPUP,
  UPDATE_POPUP,
  DELETE_POPUP
  } from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";
  
  export const _getAllPopup = (filter = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .get("/client/popup/list", {
          params: {  },
          paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then((res) => {
            resolve(res.data);

            dispatch({ type: GET_LIST_POPUP, payload: res.data.data });
        })
        .catch((error) => {
          reject(error);
          console.log(error)
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const _addPopup = (formData = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      for (var value of formData.values()) {
        console.log(value); 
     }
      api.post(formData.get('edit') === 'true' ? `/popup/update/${formData.get('id')}` : "/popup/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then((res) => {
          dispatch({ type: formData.get('edit') === 'true' ? UPDATE_POPUP : ADD_POPUP, payload: {...res.data.data, id: formData.get('id')} });
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const _deletePopup = (params = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api.post("/popup/delete", params)
        .then((res) => {
          dispatch({ type: DELETE_POPUP, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
