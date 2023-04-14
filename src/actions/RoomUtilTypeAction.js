import {
    GET_ALL_ROOM_UTIL_TYPE,
    ADD_A_ROOM_UTIL_TYPE,
    UPDATE_ROOM_UTIL_TYPE,
    DELETE_ROOM_UTIL_TYPE,
    GET_DETAIL_ROOM_UTIL_TYPE,
   
   
  } from "./types";
  import api from "../api";
  import qs from "qs";
  import { NotificationManager } from "react-notifications";
  
  export const _getAllRoomUtilType = (filter = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .get("/room_util_type/list", {
          params: { ...filter },
          paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then((res) => {
          dispatch({ type: GET_ALL_ROOM_UTIL_TYPE, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
  
  export const _getDetailRoomUtilType = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .get(`/room_util_type/load/${id}`, id)
        .then((res) => {
          dispatch({ type: GET_DETAIL_ROOM_UTIL_TYPE, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
  
  export const _createRoomUtilType = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .post("/room_util_type/save", data)
        .then((res) => {
          dispatch({ type: ADD_A_ROOM_UTIL_TYPE, payload: res.data.data });
          NotificationManager.success("Create success");
          resolve(res.data);
        })
        .catch((error) => {
          reject(error.response);
          NotificationManager.error("Can't create item");
        });
    });
  };
  
  export const _updateRoomUtilType = (data) => (dispatch) => {
  
    return new Promise((resolve, reject) => {
      api
        .post(`/room_util_type/update/${data.id}`, data)
        .then((res) => {
          dispatch({ type: UPDATE_ROOM_UTIL_TYPE, payload: res.data.data });
          NotificationManager.success("Update success");
          resolve(res.data);
        })
        .catch((error) => {
          reject(error.response.data);
          NotificationManager.error("Can't update");
          console.log(error);
        });
    });
  };
  
  export const _deleteRoomUtilType = (ids) => (dispatch) => {

    return new Promise((resolve, reject) => {
      api
        .delete("/room_util_type/delete", {data: ids})
        .then((res) => {
          dispatch({ type: DELETE_ROOM_UTIL_TYPE, payload: res.data.data });
         
          NotificationManager.success("Deleted success");
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error);
          NotificationManager.error("Can't delete");
          reject(error);
        });
    });
  };
