import {
    GET_ALL_PROPERTY_TYPE,
    ADD_A_PROPERTY_TYPE,
    UPDATE_PROPERTY_TYPE,
    DELETE_PROPERTY_TYPE,
    GET_DETAIL_PROPERTY_TYPE,
  } from "./types";
  import api from "../api";
  import qs from "qs";
  import { NotificationManager } from "react-notifications";
  
  export const _getAllPropertyType = (filter = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .get("/propertyType/list", {
          params: { ...filter },
          paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then((res) => {
          dispatch({ type: GET_ALL_PROPERTY_TYPE, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
  
  export const _getDetail = (id) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .get(`/propertyType/load/${id}`, id)
        .then((res) => {
          dispatch({ type: GET_DETAIL_PROPERTY_TYPE, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
  
  export const _create = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .post("/propertyType/save", data)
        .then((res) => {
          dispatch({ type: ADD_A_PROPERTY_TYPE, payload: res.data.data });
          NotificationManager.success("Create success");
          resolve(res.data);
        })
        .catch((error) => {
          reject(error.response);
          NotificationManager.error("Can't create item");
        });
    });
  };
  
  export const _update = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .post(`/propertyType/update/${data.id}`, data)
        .then((res) => {
          dispatch({ type: UPDATE_PROPERTY_TYPE, payload: res.data.data });
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
  
  export const _delete = (ids) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .delete("/propertyType/delete", {data:ids})
        .then((res) => {
          dispatch({ type: DELETE_PROPERTY_TYPE, payload: res.data.data });
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
  