import {
  GET_ALL_CAR_TYPE,
  ADD_A_CAR_TYPE,
  UPDATE_CAR_TYPE,
  DELETE_CAR_TYPE,
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const _getAll = (filter = {}) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get("/car_type/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then((res) => {
        dispatch({ type: GET_ALL_CAR_TYPE, payload: res.data.data });
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
      .post("/car_type/save", data)
      .then((res) => {
        console.log("res", res)
        dispatch({ type: ADD_A_CAR_TYPE, payload: res.data.data });
        NotificationManager.success("Create success");
        resolve(res.data);
      })
      .catch((error) => {
        console.log("err", error.response)
        reject(error.response);
        NotificationManager.error("Can't create item");
      });
  });
};

export const _update = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/car_type/update/${data.id}`, data)
      .then((res) => {
        dispatch({ type: UPDATE_CAR_TYPE, payload: res.data.data });
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
      .delete("/car_type/delete", { data: ids })
      .then((res) => {
        dispatch({ type: DELETE_CAR_TYPE, payload: res.data.data });

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

