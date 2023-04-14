import {
  GET_ALL_TICKET,
  ADD_A_TICKET,
  UPDATE_TICKET,
  DELETE_TICKET
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getAllTicket = (filter = {}) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get("/ticket/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        dispatch({ type: GET_ALL_TICKET, payload: res.data.data });
        resolve(res.data);
      })
      .catch(error => {
        console.log(error.response);
        reject(error);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const createTicket = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post("/ticket/save", data)
      .then(res => {
        dispatch({ type: ADD_A_TICKET, payload: res.data.data });
        NotificationManager.success("Create success");
        resolve(res.data);
      })
      .catch(error => {
        reject(error.response);
        NotificationManager.error("Can't create item");
      });
  });
};

export const updateTicket = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/ticket/update/${data.id}`, data)
      .then(res => {
        dispatch({ type: UPDATE_TICKET, payload: res.data.data });
        NotificationManager.success("Update success");
        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        // NotificationManager.error(error.response.data.message);
        NotificationManager.error("Can't update");
         console.log(error);
      });
  });
};

export const batchDelete = ids => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .delete("/ticket/delete", {data:ids})
      .then(res => {
        dispatch({ type: DELETE_TICKET, payload: res.data.data });
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
