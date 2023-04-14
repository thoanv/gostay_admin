import {
  GET_ALL_COUPON,
  ADD_A_COUPON,
  UPDATE_COUPON,
  DELETE_COUPON,
  GET_ALL_COUPON_WITHOUT_PAGINATE,
  GIVE_COUPON
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";
var FileSaver = require('file-saver');

export const getAllCoupon = (filter, paginate = true) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get("/coupon/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { encodeValuesOnly: true });
        }
      })
      .then(res => {
        if (paginate) {
          dispatch({ type: GET_ALL_COUPON, payload: res.data.data });
        } else {
          dispatch({ type: GET_ALL_COUPON_WITHOUT_PAGINATE, payload: res.data.data });
        }
        resolve(res.data.data);
      })
      .catch(error => {
        reject(error);
        console.log(error);
        // NotificationManager.error(error.response.data.message);
      });
  });
};

export const createCoupon = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post("/coupon/save", data)
      .then(res => {
        dispatch({ type: ADD_A_COUPON, payload: res.data.data });
        NotificationManager.success("Create success");
        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        console.log(error.response.data);

        NotificationManager.error("Can't create item");
      });
  });
};

export const updateCoupon = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/coupon/update/${data.id}`, data)
      .then(res => {
        console.log(data);
        dispatch({ type: UPDATE_COUPON, payload: res.data.data });
        NotificationManager.success("Update success");
        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        // NotificationManager.error(error.response.data.message);
        NotificationManager.error("Can't update");
        // console.log(error);
      });
  });
};

export const batchDelete = ids => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .delete("/coupon/delete", { data: ids })
      .then(res => {
        dispatch({ type: DELETE_COUPON, payload: res.data.data });
        NotificationManager.success("Deleted success");
        resolve(res.data);
      })
      .catch(error => {
        console.log(error);

        NotificationManager.error("Can't delete");
        reject(error);
      });
  });
};

export const giveCoupon = data => dispatch => {
  console.log('datasubmit', data);

  return new Promise((resolve, reject) => {
    api
      .post("/loyalty/activity/add_coupon", data)
      .then(res => {
        resolve(res.data);
        dispatch({ type: GIVE_COUPON, payload: res.data.data });
        NotificationManager.success(res.data.message);
      })
      .catch(error => {
        reject(error.response);
        console.log('error', error);

        // NotificationManager.error(error.response.data.msg);
      });
  });
};

export const _exportCoupon = (filter = {}) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/coupon/export`, {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
        responseType: 'blob'
      })
      .then((response) => {
        resolve(response);
        console.log(response)
        let time_stamp = new Date().getTime();
        // Log somewhat to show that the browser actually exposes the custom HTTP header
        const fileNameHeader = "Content-Disposition";
        const suggestedFileName = response.headers[fileNameHeader];
        const effectiveFileName = (suggestedFileName === undefined
          ? `danh_sach_coupon_${time_stamp}.xlsx`
          : suggestedFileName);
        console.log("Received header [" + fileNameHeader + "]: " + suggestedFileName + ", effective fileName: " + effectiveFileName);
        // Let the user save the file.
        FileSaver.saveAs(response.data, effectiveFileName);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });
};