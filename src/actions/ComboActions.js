import {
  GET_ALL_COMBO,
  GET_COMBO_DETAIL,
  UPDATE_COMBO,
  GET_ALL_COMBO_WITHOUT_PAGINATE,
} from "./types";
import api from "../api";
import qs from "qs";

// paginate = true tức là xử lý phân trang trong reducer, ngược lại nếu false thì nối tiếp dữ liệu trả về trong reducer
export const getAllCombo = (filter = {}, paginate = true) => (dispatch) => {

  return new Promise((resolve, reject) => {
    api
      .get('/combo/list', {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        resolve(res.data);
        const list = Object.keys(res.data.data).map(key => res.data.data[key])
        if (paginate) {
          dispatch({ type: GET_ALL_COMBO, payload: {list}});
        } else {
          dispatch({
            type: GET_ALL_COMBO_WITHOUT_PAGINATE,
            payload: {list},
          });
        }
      })
      .catch((error) => {
        reject(error);
        // NotificationManager.error(error.response.data.message);
      });
  });
};

export const onVerifyCombo = (id, status) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/combo/verify/${id}`, {
          status
        ,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        dispatch({ type: UPDATE_COMBO, payload: {...res.data.data, combo: true} });
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getComboDetail = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/client/combo/detail/${id}`)
      .then((res) => {
        dispatch({ type: GET_COMBO_DETAIL, payload: res.data.data });
        resolve(res.data.data);
      })
      .catch((error) => {
        reject(error.response);
        // NotificationManager.error(error.response.data)
      });
  });
};
