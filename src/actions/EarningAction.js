import {
  GET_EARNING_OVERVIEW,
} from './types';
import api from "../api";
import qs from "qs";

export const getEarningOverview = () => (dispatch) => {

  return new Promise((resolve, reject) => {
    api
      .get("/withdraw/overview")
      .then((res) => {
        dispatch({ type: GET_EARNING_OVERVIEW, payload: res.data.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);
      });
  });
};

export const getEarningData = (filter = {}) => {
  return new Promise((resolve, reject) => {
    api
      .get("/withdraw/listOrder", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });
}