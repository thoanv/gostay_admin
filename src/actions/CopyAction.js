import { COPY_RECORD } from "./types";
import api from "../api";
import { NotificationManager } from "react-notifications";

export const copyRecord = id => dispatch => {
    console.log(id);
  return new Promise((resolve, reject) => {
    return api
      .post("/copy", id)
      .then(res => {
        console.log('data',res.data);
        dispatch({ type: COPY_RECORD, payload: res.data.data });
        NotificationManager.success("Copied!");
        resolve(true);
      })
      .catch(err => {
        NotificationManager.error("Failed!");
        console.log(err);
        reject(err);
      });
  });
};
