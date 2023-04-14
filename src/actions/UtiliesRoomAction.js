import {
  GET_LIST_ROOM_UTILITIES,
  ADD_ROOM_UTILITIES,
  UPDATE_ROOM_UTILITIES,
  DELETE_ROOM_UTILITIES
  } from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";
  
  export const _getAllUtilRoom = (filter = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .get("/client/room/utilities/list", {
          params: { ...filter },
          paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then((res) => {
          dispatch({ type: GET_LIST_ROOM_UTILITIES, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const _addUtilRoom = (formData = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api.post(formData.get('edit') === 'true' ? `/room/utilities/update/${formData.get('id')}` : "/room/utilities/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then((res) => {
          dispatch({ type: formData.get('edit') === 'true' ? UPDATE_ROOM_UTILITIES : ADD_ROOM_UTILITIES, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const _deleteUtilRoom = (params = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api.post("/room/utilities/delete", params)
        .then((res) => {
          dispatch({ type: DELETE_ROOM_UTILITIES, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
