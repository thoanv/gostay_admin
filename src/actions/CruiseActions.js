import {
  GET_ALL_CRUISES,
  ADD_CRUISE,
  UPDATE_CRUISE,
  DELETE_CRUISE,
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getAllCruise = (filter) => (dispatch) => {
  console.log(filter);
  return new Promise((resolve, reject) => {
    api
      .get("/cruise/list", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        console.log("res", res.data);
        dispatch({ type: GET_ALL_CRUISES, payload: res.data.data });
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
        console.log(error);
        NotificationManager.error(error);
      });
  });
};
