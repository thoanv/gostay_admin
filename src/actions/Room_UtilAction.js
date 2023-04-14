import {
    GET_ALL_ROOM_UTIL,
    ADD_A_ROOM_UTIL,
    UPDATE_ROOM_UTIL,
    DELETE_ROOM_UTIL,
    GET_DETAIL_ROOM_UTIL,
   
   
  } from "./types";
  import api from "../api";
  import qs from "qs";
  import { NotificationManager } from "react-notifications";
  
  export const _getAllRoomUtil = (filter = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .get("/room_util/list", {
          params: { ...filter },
          paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then((res) => {
          dispatch({ type: GET_ALL_ROOM_UTIL, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
  
  export const _getDetailRoomUtil = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .get(`/room_util/load/${id}`, id)
        .then((res) => {
          dispatch({ type: GET_DETAIL_ROOM_UTIL, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
  
  export const _createRoomUtil = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .post("/room_util/save", data)
        .then((res) => {
          dispatch({ type: ADD_A_ROOM_UTIL, payload: res.data.data });
          NotificationManager.success("Create success");
          resolve(res.data);
        })
        .catch((error) => {
          reject(error.response);
          NotificationManager.error("Can't create item");
        });
    });
  };
  
  export const _updateRoomUtil = (data) => (dispatch) => {
  
    return new Promise((resolve, reject) => {
      api
        .post(`/room_util/update/${data.id}`, data)
        .then((res) => {
          dispatch({ type: UPDATE_ROOM_UTIL, payload: res.data.data });
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
  
  export const _deleteRoomUtil = (ids) => (dispatch) => {

    return new Promise((resolve, reject) => {
      api
        .delete("/room_util/delete", {data: ids})
        .then((res) => {
          dispatch({ type: DELETE_ROOM_UTIL, payload: res.data.data });
         
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
