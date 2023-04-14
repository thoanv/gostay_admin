import qs from "qs";
import { NotificationManager } from "react-notifications";
import api from "../api";
import {
    ADD_A_TRAVEL_LOCATION, DELETE_A_TRAVEL_LOCATION,
    GET_ALL_TRAVEL_LOCATION, UPDATE_A_TRAVEL_LOCATION
} from "./types";

export const getAllTravelLocation = (filter = {}, paginate = true, isDispatch = true) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get("/client/tour/tourist_spot", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        resolve(res.data.data);
        const list = Object.keys(res.data.data).reverse().map(key => res.data.data[key])
        dispatch({ type: GET_ALL_TRAVEL_LOCATION, payload: list });
      })
      .catch(error => {
        reject(error);
        // NotificationManager.error(error.response.data.msg);
      });
  });
};

export const createTravelLocation = travellocation => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post("/client/tour/add_tourist", travellocation)
      .then(res => {
        dispatch({ type: ADD_A_TRAVEL_LOCATION, payload: res.data.data });

        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        NotificationManager.error(error.response.data.message);

      });
  });
};

export const updateTravelLocation = (travellocation,id) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/client/tour/update_tourist/${id}`, travellocation)
      .then(res => {
        dispatch({ type: UPDATE_A_TRAVEL_LOCATION, payload: res.data.data });

        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        NotificationManager.error(error.response.data.message);

      });
  });
};

export const deleteTravelLocation = ids => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post('/client/tour/delete_tourist',ids )
      .then(res => {
        dispatch({ type: DELETE_A_TRAVEL_LOCATION, payload: res.data.data });

        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        NotificationManager.error(error.response.data.message);

      });
  });
};