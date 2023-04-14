import {
  GET_ALL_AMENITY,
  ADD_A_AMENITY,
  UPDATE_AMENITY,
  DELETE_AMENITY,
  GET_A_AMENITY,
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getAllItems = (filter = {}) => (dispatch) => {
  console.log("filter", filter);
  return new Promise((resolve, reject) => {
    api
      .get("/amentity/list", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        console.log("action", res.data.data);
        dispatch({ type: GET_ALL_AMENITY, payload: res.data.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const getItem = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/amentity/load/${id}`, id)
      .then((res) => {
        dispatch({ type: GET_A_AMENITY, payload: res.data.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const createItem = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post("/amentity/save", data)
      .then((res) => {
        dispatch({ type: ADD_A_AMENITY, payload: res.data.data });
        NotificationManager.success("Create success");
        resolve(res.data);
      })
      .catch((error) => {
        reject(error.response);
        NotificationManager.error("Can't create item");
      });
  });
};

export const updateItem = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/amentity/update/${data.id}`, data)
      .then((res) => {
        dispatch({ type: UPDATE_AMENITY, payload: res.data.data });
        NotificationManager.success("Update success");
        resolve(res.data);
      })
      .catch((error) => {
        reject(error.response.data);
        // NotificationManager.error(error.response.data.message);
        NotificationManager.error("Can't update");
        console.log(error);
      });
  });
};

export const deleteItem = (ids) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .delete("/amentity/delete", {data:ids})
      .then((res) => {
        dispatch({ type: DELETE_AMENITY, payload: res.data.data });
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
