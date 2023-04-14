import {
  GET_ALL_ORDER_COMBO,
  GET_DETAIL_ORDER_COMBO,
  UPDATE_ORDER_COMBO
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getAllOrderCombo = (filter) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get("/orders/combo", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        resolve(res.data);
        dispatch({ type: GET_ALL_ORDER_COMBO, payload: res.data.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getDetailOrderCombo = ( id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/client/combo/detail/${id}`, {
        params: {},
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        resolve(res.data);
        dispatch({ type: GET_DETAIL_ORDER_COMBO, payload: res.data.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateOrderCombo = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/orders/update/${data.id}`, data)
      .then((response) => {
        dispatch({ type: UPDATE_ORDER_COMBO, payload: response.data.data });
        NotificationManager.success(response.data.message);
        resolve(response.data);
      })
      .catch((error) => {
        NotificationManager.error(error.response.data.message);
        reject(error.response.data);
      });
  });
};
