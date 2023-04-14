import {
  GET_ALL_AIRLINES,
  ADD_A_AIRLINE,
  UPDATE_AIRLINE,
  DELETE_AIRLINE,
  UPDATE_STATUS_AIRLINE,
  CHANGE_STATUS,
  BATCH_DELETE,
  GET_ALL_AIRLINES_WITHOUT_PAGINATE
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getAllAirlines = (filter, paginate = true) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get("/airline/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { encodeValuesOnly: true });
        }
      })
      .then(res => {
        resolve(res.data);
        if (paginate) {
          dispatch({ type: GET_ALL_AIRLINES, payload: res.data.data });
        } else {
          dispatch({
            type: GET_ALL_AIRLINES_WITHOUT_PAGINATE,
            payload: res.data.data
          });
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const createAirline = destination => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post("/airline/save", destination)
      .then(res => {
        dispatch({ type: ADD_A_AIRLINE, payload: res.data.data });
        NotificationManager.success("Create success");
        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        NotificationManager.error("Can't create item");
      });
  });
};

export const updateAirline = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/airline/update/${data.id}`, data)
      .then(res => {
        dispatch({ type: UPDATE_AIRLINE, payload: res.data.data });
        NotificationManager.success("Update success");
        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        // NotificationManager.error(error.response.data.message);
        NotificationManager.error("Can't update");
      });
  });
};

export const updateAirlineStatus = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post("/common/status", data)
      .then(res => {
        dispatch({ type: UPDATE_STATUS_AIRLINE, payload: res.data.data });
        // NotificationManager.success('Update status success');
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
        // NotificationManager.error('Can\'t status update');
      });
  });
};

export const batchDelete = ids => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .delete("/airline/delete", {data:ids})
      .then(res => {
        dispatch({ type: DELETE_AIRLINE, payload: res.data.data });
        NotificationManager.success("Deleted success");
        resolve(res.data);
      })
      .catch(error => {
        NotificationManager.error("Can't delete");
        reject(error);
      });
  });
};
