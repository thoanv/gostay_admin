import qs from "qs";
import { NotificationManager } from "react-notifications";
import api from "../api";
import {
  ADD_A_DESTINATION,
  DELETE_DESTINATION,
  GET_ALL_DESTINATION,
  GET_ALL_DESTINATION_PARENT,
  UPDATE_DESTINATION,
  GET_ALL_DESTINATION_WITHOUT_PAGINATE,
  GET_ALL_DESTINATION_TYPES
} from "./types";

export const getAllDestination = (filter = {}, paginate = true, isDispatch = true) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get("/destination/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        resolve(res.data.data.list);
        if (isDispatch) {
          if (paginate) {
            dispatch({ type: GET_ALL_DESTINATION, payload: res.data.data });
          } else {
            dispatch({
              type: GET_ALL_DESTINATION_WITHOUT_PAGINATE,
              payload: res.data.data
            });
          }
        }
      })
      .catch(error => {
        reject(error);
        // NotificationManager.error(error.response.data.msg);
      });
  });
};

export const getAllSpot = (filter = {}, paginate = true, isDispatch = true) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get("client/tour/tourist_spot", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        resolve(res.data.data);

            dispatch({
              type: GET_ALL_DESTINATION,
              payload: res.data.data
            });

      })
      .catch(error => {
        reject(error);
        // NotificationManager.error(error.response.data.msg);
      });
  });
};

export const getAllDestinationParent = (filter = {}) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get("/destination/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        resolve(res.data);
        dispatch({ type: GET_ALL_DESTINATION_PARENT, payload: res.data.data });
      })
      .catch(error => {
        reject(error);
        NotificationManager.error(error);
      });
  });
};

export const createDestination = destination => dispatch => {

  return new Promise((resolve, reject) => {
    api
      .post("/destination/save", destination)
      .then(res => {
        dispatch({ type: ADD_A_DESTINATION, payload: res.data.data });

        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        NotificationManager.error(error.response.data.message);

      });
  });
};

export const updateDestination = destination => dispatch => {

  return new Promise((resolve, reject) => {
    api
      .post(`/destination/update/${destination.id}`, destination)
      .then(response => {
        dispatch({ type: UPDATE_DESTINATION, payload: response.data.data });
        NotificationManager.success(response.data.message);

        resolve(response.data);
      })
      .catch(error => {
        NotificationManager.error(error.response.data.message);
        reject(error.response.data);

      });
  });
};

export const batchDelete = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .delete("/destination/delete", { data: data })
      .then(res => {
        dispatch({ type: DELETE_DESTINATION, payload: res.data.data });
        resolve(res.data);
        NotificationManager.success("Delete Success");
      })
      .catch(error => {
        reject(error.response.data);
        NotificationManager.error(error.response.data.message);
      });
  });
};



export const searchDestination = (filter = {}) => {
  return new Promise((resolve, reject) => {
    api
      .get("/destination/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        resolve(res.data.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};


export const getDestinationTypes = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get("/destination/types")
      .then(res => {
        dispatch({ type: GET_ALL_DESTINATION_TYPES, payload: res.data.data });
        resolve(res.data.data);
      })
      .catch(error => {
        reject(error.response.data);
        NotificationManager.error(error.response.data.message);
      });
  });
};
