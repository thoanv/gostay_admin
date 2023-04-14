import {
  LIST_TICKET_ITINERARIES,
  ADD_TICKET_ITINERARIES,
  UPDATE_TICKET_ITINERARIES,
  BATCH_DELETE,
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getTicketItineraries = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/ticket/itinerary/list/${id}`)
      .then((res) => {
        resolve(res.data);
        dispatch({ type: LIST_TICKET_ITINERARIES, payload: res.data.data });
      })
      .catch((error) => {
        reject(error);
        NotificationManager.error("Failed to load list Itinerary");
      });
  });
};
export const createATicketItineraries = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post("/ticket/itinerary/save", data)
      .then((res) => {
        dispatch({ type: ADD_TICKET_ITINERARIES, payload: res.data.data });
        NotificationManager.success("Success");
        resolve(res.data);
      })
      .catch((error) => {
        NotificationManager.error("Failed");
        reject(error);
      });
  });
};

export const updateTicketItineraries = (data) => (dispatch) => {
  
  return new Promise((resolve, reject) => {
    api
      .post(`/ticket/itinerary/update/${data.id}`, data)
      .then((response) => {
        dispatch({
          type: UPDATE_TICKET_ITINERARIES,
          payload: response.data.data,
        });
        NotificationManager.success("Success");
        resolve(response.data);
      })
      .catch((error) => {
        NotificationManager.error("Failed");
        reject(error);
      });
  });
};

export const batchDelete = (ids) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .delete("/ticket/itinerary/delete", {data:ids})
      .then((res) => {
        dispatch({ type: BATCH_DELETE, payload: res.data.data });
        resolve(res.data);
        NotificationManager.success("Success");
      })
      .catch((error) => {
        NotificationManager.error("Failed");
        reject(error);
      });
  });
};
