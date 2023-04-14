import {
  GET_LIST_MANAGE_HOTEL,
  ADD_MANAGE_HOTEL,
  UPDATE_MANAGE_HOTEL,
  DELETE_MANAGE_HOTEL,
  VERIFY_MANAGE_HOTEL, GET_LIST_ROOM_HOTEL, GET_DETAIL_MANAGE_HOTEL
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";
  
  export const _getAllManageHotel = (filter = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .post("/hotel/admin/list", {
          params: { ...filter },
          paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then((res) => {
          dispatch({ type: GET_LIST_MANAGE_HOTEL, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const _getDetailManageHotel = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .get(`/client/hotel/detail/${id}`, {
          paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then((res) => {
          dispatch({ type: GET_DETAIL_MANAGE_HOTEL, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const _getAllRoomOfHotel = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .get(`client/room/list/${id}`, {

          paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then((res) => {
          dispatch({ type: GET_LIST_ROOM_HOTEL, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const _addManageHotel = (formData = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api.post(formData.get('edit') === 'true' ? `/trademark/update/${formData.get('id')}` : "/trademark/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then((res) => {
          dispatch({ type: formData.get('edit') === 'true' ? UPDATE_MANAGE_HOTEL : ADD_MANAGE_HOTEL, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };

  export const onVerifyTour = (id, status) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .post(`/hotel/admin/verify/${id}`, {
            status
          ,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        })
        .then((res) => {
          dispatch({ type: VERIFY_MANAGE_HOTEL, payload: {...res.data.data, tour: true} });
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  export const _deleteManageHotel = (params = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api.post("/trademark/delete", params)
        .then((res) => {
          dispatch({ type: DELETE_MANAGE_HOTEL, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
