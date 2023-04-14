import {
  GET_ALL_ASSET,
  GET_ASSET_DETAIL,
  ADD_A_ASSET,
  UPDATE_ASSET,
  DELETE_ASSET
} from "Actions/types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getAllAsset = (filter = {}) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get("/asset/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        dispatch({ type: GET_ALL_ASSET, payload: res.data.data });
        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const addAsset = asset => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post("/asset/save", asset)
      .then(res => {
        dispatch({ type: ADD_A_ASSET, payload: res.data.data });
        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        NotificationManager.error(error.response.data.message);
      });
  });
};
export const deleteAsset = idAsset => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .delete("/asset/delete", {data:idAsset})
      .then(res => {
        dispatch({ type: DELETE_ASSET, payload: res.data.data });
        resolve(res.data);
        NotificationManager.success("Delete Success");
      })
      .catch(error => {
        reject(error.response.data);
        NotificationManager.error(error.response.data.message);
      });
  });
};
export const updateAsset = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/asset/update/${data.id}`, data)
      .then(response => {
        dispatch({ type: UPDATE_ASSET, payload: response.data.data });
        NotificationManager.success(response.data.message);

        resolve(response.data);
      })
      .catch(error => {
        NotificationManager.error(error.response.data.message);
        reject(error.response.data);
      });
  });
};
