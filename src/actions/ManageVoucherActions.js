import {
  GET_LIST_MANAGE_VOUCHER,
  VERIFY_MANAGE_VOUCHER
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const _getAllManageVoucher = (filter = {}) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
        .post("/voucher/admin/list", {
          params: { ...filter },
          paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then((res) => {
          dispatch({ type: GET_LIST_MANAGE_VOUCHER, payload: res.data.data });
            console.log(res.data,3333);
          resolve(res.data);
        })
        .catch((error) => {
          console.log(error,3333);
          reject(error);
          NotificationManager.error(error.response);
        });
  });
};



export const onVerifyVoucher = (id, status) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
        .post(`/voucher/verify/${id}`, {
          status
          ,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        })
        .then((res) => {
          dispatch({ type: VERIFY_MANAGE_VOUCHER, payload: {...res.data.data, tour: true} });
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
  });
};
