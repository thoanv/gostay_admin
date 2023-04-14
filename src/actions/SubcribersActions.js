import {
    GET_ALL_SUBSCRIBERS,
    GET_ALL_SUBSCRIBERS_WITHOUT_PAGINATE
  } from "./types";
  import api from "../api";
  import qs from "qs";
  import { NotificationManager } from "react-notifications";
  
  export const getAllSubcribers = (filter, paginate = true) => dispatch => {
    console.log("filter", filter);
  
    return new Promise((resolve, reject) => {
      api
        .get("/subscriber/list", {
          params: { ...filter },
          paramsSerializer: params => {
            return qs.stringify(params, { encodeValuesOnly: true });
          }
        })
        .then(res => {
          resolve(res.data);
          if(paginate) {
            dispatch({ type: GET_ALL_SUBSCRIBERS, payload: res.data.data });
          } else {
            dispatch({ type: GET_ALL_SUBSCRIBERS_WITHOUT_PAGINATE, payload: res.data.data });
          }
        })
        .catch(error => {
          reject(error);
          console.log(error);
        });
    });
  };
  