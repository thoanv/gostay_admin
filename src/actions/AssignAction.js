import { ASSIGN } from "Actions/types";
import api from "../api";
import { NotificationManager } from "react-notifications";

export const assign = data => dispatch => {
    console.log(data);
    
  return new Promise((resolve, reject) => {
    api
      .post("/assign", data)
      .then(response => {
        dispatch({ type: ASSIGN, payload: response.data.data });
        NotificationManager.success('Success!');
        resolve(response.data);
      })
      .catch(error => {
        NotificationManager.error('Failed!');
        reject(error);
      });
  });
};
