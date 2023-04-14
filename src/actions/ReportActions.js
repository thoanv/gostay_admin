import {
  REPORT_CUSTOMER_BY_TOUR,
  REPORT_FILTER_TOUR_DEPART,
  EXPORT_EXCEL_CUSTOMER,
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getCustomerByTour = (filter) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/report/customer_by_tour", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        console.log(res.data);
        dispatch({
          type: REPORT_CUSTOMER_BY_TOUR,
          payload: res.data.data,
        });
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getTourDepartDate = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/report/filter/tour_depart/${id}`)
      .then((res) => {
        console.log(res.data);
        resolve(res.data);
        dispatch({ type: REPORT_FILTER_TOUR_DEPART, payload: res.data.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const exportExcelCustomer = (data) => (dispatch) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    api
      .post("/report/customer_by_tour/export/excel", data)
      .then((res) => {
        console.log(res.data);
        resolve(res.data);
        dispatch({ type: EXPORT_EXCEL_CUSTOMER, payload: res.data.data });
        NotificationManager.success("Export success!");
      })
      .catch((error) => {
        reject(error);
        NotificationManager.error("Export faild!");
      });
  });
};
