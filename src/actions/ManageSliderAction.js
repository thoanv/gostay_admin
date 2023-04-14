import {
  GET_LIST_SLIDER,
  ADD_SLIDER,
  UPDATE_SLIDER,
  DELETE_SLIDER
  } from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";
  
  export const _getAllSlider = (filter = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .get("/client/slider/list", {
          params: { ...filter },
          paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then((res) => {
          dispatch({ type: GET_LIST_SLIDER, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const _addSlider = (formData = {}) => (dispatch) => {
    const isEdit = formData.get('edit') === 'true';
    return new Promise((resolve, reject) => {
      api.post(isEdit ? `/slider/update/${formData.get('id')}` : "/slider/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then((res) => {
          dispatch({ type: isEdit ? UPDATE_SLIDER : ADD_SLIDER, 
            payload: isEdit ? {...res.data.data, id: formData.get('id')} : {...res.data.data}  });
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const _deleteSlider = (params = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api.post("/slider/delete", params)
        .then((res) => {
          dispatch({ type: DELETE_SLIDER, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
