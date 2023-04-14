import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getWithdraw = (filter = {}) => {

  return new Promise((resolve, reject) => {
    api
      .get("/withdraw/list", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      }
      )
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });
};
export const getWithdrawDetail = (id) => {

  return new Promise((resolve, reject) => {
    api
      .get(`/withdraw/load/${id}`)
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });
};
export const withdrawApprove = (id, data) => {

  return new Promise((resolve, reject) => {
    api
      .post(`/withdraw/approve/${id}`, data)
      .then((res) => {

        resolve(res.data.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });
};

export const withdrawDecline = (id, data) => {

  return new Promise((resolve, reject) => {
    api
      .post(`/withdraw/decline/${id}`, data)
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });
};

