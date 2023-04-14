import {
  GET_ALL_TOUR,
  ADD_A_TOUR,
  GET_TOUR_DETAIL,
  UPDATE_TOUR,
  UPDATE_DEPARTURE_IN_TOUR,
  DELETE_TOUR,
  GET_TOUR_RATES,
  ADD_TOUR_RATES,
  REMOVE_TOUR_RATE,
  UPDATE_TOUR_AIRLINES,
  GET_DEPARTURES_OF_TOUR,
  GET_ALL_TOUR_WITHOUT_PAGINATE,
  GET_ALL_PRODUCT,
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

// paginate = true tức là xử lý phân trang trong reducer, ngược lại nếu false thì nối tiếp dữ liệu trả về trong reducer
export const getAllTour = (filter = {}, paginate = true) => (dispatch) => {

  return new Promise((resolve, reject) => {
    api
      .get("/tour/list", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        resolve(res.data);
        if (paginate) {
          dispatch({ type: GET_ALL_TOUR, payload: res.data.data });
        } else {
          dispatch({
            type: GET_ALL_TOUR_WITHOUT_PAGINATE,
            payload: res.data.data,
          });
        }
      })
      .catch((error) => {
        reject(error);
        // NotificationManager.error(error.response.data.message);
      });
  });
};

export const getAllSearchTour = (filter = {}, paginate = true) => (dispatch) => {
  console.log("filter", filter);

  return new Promise((resolve, reject) => {
    api
      .get("/tour/list", {
        params: { },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        resolve(res.data);
        const list = Object.keys(res.data.data).reverse().map(key => res.data.data[key])
        if (paginate) {
          dispatch({ type: GET_ALL_TOUR, payload: {list}});
        } else {
          dispatch({
            type: GET_ALL_TOUR_WITHOUT_PAGINATE,
            payload: {list},
          });
        }
      })
      .catch((error) => {
        console.log('--error-', error)
        reject(error);
        // NotificationManager.error(error.response.data.message);
      });
  });
};

export const getAllProduct = (filter = {}) => (dispatch) => {
  console.log(filter);
  return new Promise((resolve, reject) => {
    api
      .get("/product/all", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        resolve(res.data);
        dispatch({ type: GET_ALL_PRODUCT, payload: res.data.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createTour = (destination) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post("/tour/save", destination)
      .then((res) => {
        dispatch({ type: ADD_A_TOUR, payload: res.data.data });
        NotificationManager.success(res.data.message);
        resolve(res.data);
      })
      .catch((error) => {
        reject(error.response.data);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const onVerifyTour = (id, status) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/client/tour/verify/${id}`, {
          status
        ,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        dispatch({ type: UPDATE_TOUR, payload: {...res.data.data, tour: true} });
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateTour = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/tour/update/${data.id}`, data)
      .then((response) => {
        dispatch({ type: UPDATE_TOUR, payload: response.data.data });
        NotificationManager.success(response.data.message);
        resolve(response.data);
      })
      .catch((error) => {
        NotificationManager.error(error.response.data.message);
        reject(error.response.data);
      });
  });
};

export const updateDepartureInTour = (id, data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/tour/update_departure/${id}`, data)
      .then((response) => {
        dispatch({
          type: UPDATE_DEPARTURE_IN_TOUR,
          payload: response.data.data,
        });
        NotificationManager.success(response.data.message);
        resolve(response.data);
      })
      .catch((error) => {
        NotificationManager.error(error.response.data.message);
        reject(error.response.data);
      });
  });
};

export const deleteTour = (ids) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .delete("/tour/delete", { data: ids })
      .then((res) => {
        dispatch({ type: DELETE_TOUR, payload: idTour });
        resolve(res.data);
        NotificationManager.success("Delete Success");
      })
      .catch((error) => {
        reject(error.response.data);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const getTourDetail = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/client/tour/detail/${id}`)
      .then((res) => {
        dispatch({ type: GET_TOUR_DETAIL, payload: res.data.data });
        resolve(res.data.data);
      })
      .catch((error) => {
        reject(error.response);
        // NotificationManager.error(error.response.data)
      });
  });
};

export const getTourRates = (filter) => (dispatch) => {
  console.log(filter);
  return new Promise((resolve, reject) => {
    return api
      .get("/tour/list_rate", { params: filter })
      .then((res) => {
        dispatch({ type: GET_TOUR_RATES, payload: res.data.data });
        resolve(res.data.data);
      })
      .catch((error) => {
        reject(error.response);
        // NotificationManager.error(error.response.data)
      });
  });
};

export const addTourRates = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .post("/tour/save_calendar", data)
      .then((res) => {
        console.log(res.data);
        dispatch({ type: ADD_TOUR_RATES, payload: res.data.data });
        NotificationManager.success("Add tour rate success!");
        resolve(true);
      })
      .catch((error) => {
        reject(error.response);
        // NotificationManager.error(error.response.data)
      });
  });
};

export const removeTourRate = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .delete("/tour/delete_rate", { id: id })
      .then((res) => {
        dispatch({ type: REMOVE_TOUR_RATE, payload: id });
        NotificationManager.success("Remove tour rate success!");
        resolve(true);
      })
      .catch((error) => {
        reject(error);
        // NotificationManager.error(error.response.data)
      });
  });
};

export const removeTourRateByConditionals = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .delete("/tour/delete-rate-by-conditional", data)
      .then((res) => {
        dispatch({ type: REMOVE_TOUR_RATE });
        NotificationManager.success("Remove tour rate success!");
        resolve(true);
      })
      .catch((error) => {
        reject(error);
        console.log(error);
        // NotificationManager.error(error.response.data)
      });
  });
};

export const updateTourAirlines = (id, data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .post(`/tour/update_airline/${id}`, data)
      .then((res) => {
        dispatch({ type: UPDATE_TOUR_AIRLINES, payload: res.data });
        NotificationManager.success("Update success");
        resolve(true);
      })
      .catch((err) => {
        reject(err);
        NotificationManager.error("Update error");
      });
  });
};

export const getDeparturesOfTour = (tour_id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .get(`/tour/departure/${tour_id}`)
      .then((res) => {
        dispatch({ type: GET_DEPARTURES_OF_TOUR, payload: res.data.data });
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
