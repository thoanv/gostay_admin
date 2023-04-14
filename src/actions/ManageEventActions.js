import {
  GET_LIST_MANAGE_EVENT,
  ADD_MANAGE_EVENT,
  UPDATE_MANAGE_EVENT,
  DELETE_MANAGE_EVENT,
  VERIFY_MANAGE_EVENT
  } from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";
  
  export const _getAllManageEvent = (filter = {}) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .post("/event/admin/list", {
          params: { ...filter },
          paramsSerializer: params => {
              return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then((res) => {
          dispatch({ type: GET_LIST_MANAGE_EVENT, payload: res.data.data });
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error,3333);
          reject(error);
          NotificationManager.error(error.response);
        });
    });
  };



  export const onVerifyEvent = (id, status) => (dispatch) => {
    return new Promise((resolve, reject) => {
      api
        .post(`/event/verify/${id}`, {
            status
          ,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        })
        .then((res) => {
          dispatch({ type: VERIFY_MANAGE_EVENT, payload: {...res.data.data, tour: true} });
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
