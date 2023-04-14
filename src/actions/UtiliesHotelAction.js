import {
  GET_LIST_HOTEL_UTILITIES,
  ADD_HOTEL_UTILITIES,
  UPDATE_HOTEL_UTILITIES,
  DELETE_HOTEL_UTILITIES
  } from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";
  
  export const _getAllUtilHotel = (filter = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .get("/client/hotel/utilities/list", {
          params: { ...filter },
          paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then((res) => {
          dispatch({ type: GET_LIST_HOTEL_UTILITIES, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const _addUtilHotel = (formData = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api.post(formData.get('edit') === 'true' ? `/hotel/utilities/update/${formData.get('id')}` : "/hotel/utilities/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then((res) => {
          dispatch({ type: formData.get('edit') === 'true' ? UPDATE_HOTEL_UTILITIES : ADD_HOTEL_UTILITIES, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const _deleteUtilHotel = (params = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api.post("/hotel/utilities/delete", params)
        .then((res) => {
          dispatch({ type: DELETE_HOTEL_UTILITIES, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
