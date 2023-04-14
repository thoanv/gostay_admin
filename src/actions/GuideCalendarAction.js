import {
  GET_ALL_GUIDE_CALENDAR,
  ADD_A_GUIDE_CALENDAR,
  UPDATE_GUIDE_CALENDAR,
  DELETE_GUIDE_CALENDAR,
  GET_CALENDAR_BY_ID
} from "Actions/types";
import api from "../api";
import { NotificationManager } from "react-notifications";
import qs from "qs";
import { COPY_RECORD } from "./types";

export const getAllGuideCalendar = (filter = {}) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get("/guide/calendar/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        dispatch({ type: GET_ALL_GUIDE_CALENDAR, payload: res.data.data });
        resolve(res.data);
      })
      .catch(error => {
        console.log(error.response);
        
        reject(error);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const addGuideCalendar = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post("/guide/calendar/save", data)
      .then(res => {
        dispatch({ type: ADD_A_GUIDE_CALENDAR, payload: res.data.data });
        NotificationManager.success(res.data.message);
        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const updateGuideCalendar = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/guide/calendar/update/${data.id}`, data)
      .then(response => {
        dispatch({ type: UPDATE_GUIDE_CALENDAR, payload: response.data.data });
        NotificationManager.success('Updated!');
        resolve(response.data);
      })
      .catch(error => {
        NotificationManager.error('Update false!');
        reject(error.response.data);
        console.log(error.response.data.message);
      });
  });
};
export const batchDelete = ids => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .delete("/guide/calendar/delete", {data:ids})
      .then(res => {
        dispatch({ type: DELETE_GUIDE_CALENDAR, payload: res.data.data });
        console.log(res.data);
        
        NotificationManager.success("Deleted!");
        resolve(res.data);
      })
      .catch(error => {
        NotificationManager.error("Delete false!");
        reject(error);
      });
  });
};

export const copyGuideCalendar = id => dispatch => {
  console.log('id', id);

  return new Promise((resolve, reject) => {
    api
      .post("/guide/calendar/copy", id)
      .then(res => {
        console.log('res', res);
        dispatch({ type: COPY_RECORD, payload: res.data.data });
        NotificationManager.success("Copied!");
        resolve(res.data);
      })
      .catch(error => {
        NotificationManager.error("Failed!");
        reject(error);
      });
  });
};

export const getCalendarByGuide = (filter = {},id) => dispatch => {
 
  return new Promise((resolve, reject) => {
    api
      .get(`/guide/calendar/listbyguide/${id}`,{
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
      
        dispatch({ type: GET_CALENDAR_BY_ID, payload: res.data.data });
        // NotificationManager.success("Copied!");
        resolve(res.data);
      })
      .catch(error => {
        NotificationManager.error("Failed!");
        console.log(error.response);
        reject(error);
      });
  });
};