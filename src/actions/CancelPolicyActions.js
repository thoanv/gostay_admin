import {
  GET_ALL_CANCEL_POLICY,
  ADD_A_CANCEL_POLICY,
  UPDATE_CANCEL_POLICY,
  DELETE_CANCEL_POLICY,
  GET_A_CANCEL_POLICY,
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getAllCancel_policy = (filter = {}) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get("/cancel_policy/list", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        dispatch({ type: GET_ALL_CANCEL_POLICY, payload: res.data.data });
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
      .get(`/cancel_policy/load/${id}`, id)
      .then((res) => {
        dispatch({ type: GET_A_CANCEL_POLICY, payload: res.data.data });
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
      .post("/cancel_policy/save", data)
      .then((res) => {
        dispatch({ type: ADD_A_CANCEL_POLICY, payload: res.data.data });
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
      .post(`/cancel_policy/update/${data.id}`, data)
      .then((res) => {
        dispatch({ type: UPDATE_CANCEL_POLICY, payload: res.data.data });
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
      .delete("/cancel_policy/delete", {data:ids})
      .then((res) => {
        dispatch({ type: DELETE_CANCEL_POLICY, payload: res.data.data });
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
