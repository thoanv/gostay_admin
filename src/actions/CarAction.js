import {
  GET_ALL_CAR,
  ADD_A_CAR,
  UPDATE_CAR,
  DELETE_CAR,
  GET_DETAIL_CAR,
  GET_ALL_ROUTE,
  ADD_A_ROUTE,
  UPDATE_ROUTE,
  DELETE_ROUTE,
  GET_ROUTE_DETAIL
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";
var FileSaver = require('file-saver');

export const _getAll = (filter = {}) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get("/vehicle/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then((res) => {
        dispatch({ type: GET_ALL_CAR, payload: res.data.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const _getDetail = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/vehicle/load/${id}`, id)
      .then((res) => {
        dispatch({ type: GET_DETAIL_CAR, payload: res.data.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const _create = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post("/vehicle/save", data)
      .then((res) => {
        console.log("res", res)
        dispatch({ type: ADD_A_CAR, payload: res.data.data });
        NotificationManager.success("Create success");
        resolve(res.data);
      })
      .catch((error) => {
        console.log("err", error.response)
        reject(error.response);
        NotificationManager.error("Can't create item");
      });
  });
};

export const _update = (data) => (dispatch) => {
  console.log("data", data)
  return new Promise((resolve, reject) => {
    api
      .post(`/vehicle/update/${data.id}`, data)
      .then((res) => {
        dispatch({ type: UPDATE_CAR, payload: res.data.data });
        NotificationManager.success("Update success");
        resolve(res.data);
      })
      .catch((error) => {
        reject(error.response.data);
        NotificationManager.error("Can't update");
        console.log(error);
      });
  });
};

export const _delete = (ids) => (dispatch) => {

  return new Promise((resolve, reject) => {
    api
      .delete("/vehicle/delete", { data: ids })
      .then((res) => {
        dispatch({ type: DELETE_CAR, payload: res.data.data });

        NotificationManager.success("Deleted success");
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error("Can't delete");
        reject(error);
      });
  });
};


export const _getAllRoute = (filter = {}) => (dispatch) => {

  return new Promise((resolve, reject) => {
    api
      .get("/route/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then((res) => {
        dispatch({ type: GET_ALL_ROUTE, payload: res.data.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);
        NotificationManager.error(error.response.data.message);
      });
  });
};


export const _createRoute = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post("/route/save", data)
      .then((res) => {
        dispatch({ type: ADD_A_ROUTE, payload: res.data.data });
        NotificationManager.success("Create success");
        resolve(res.data);
      })
      .catch((error) => {
        reject(error.response);
        console.log(error)
        console.log(error.response)
        NotificationManager.error("Can't create item");
      });
  });
};

export const _updateRoute = (data) => (dispatch) => {

  return new Promise((resolve, reject) => {
    api
      .post(`/route/update/${data.id}`, data)
      .then((res) => {
        dispatch({ type: UPDATE_ROUTE, payload: res.data.data });
        NotificationManager.success("Update success");
        resolve(res.data);
      })
      .catch((error) => {
        reject(error.response.data);
        NotificationManager.error("Can't update");
        console.log(error);
      });
  });
};

export const _deleteRoute = (ids) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .delete("/route/delete", { data: ids })
      .then((res) => {
        dispatch({ type: DELETE_ROUTE, payload: res.data.data });
        NotificationManager.success("Deleted success");
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        NotificationManager.error("Can't delete");
        reject(error);
      });
  });
};


export const _searchCar = (filter = {}) => {
  return new Promise((resolve, reject) => {
    api
      .get("/vehicle/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);
      });
  });
};

export const _getRouteDetail = (item) => dispatch => {
  dispatch({ type: GET_ROUTE_DETAIL, payload: item });
}

export const _getDetailRoute = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/route/load/${id}`, id)
      .then((res) => {
        dispatch({ type: GET_ROUTE_DETAIL, payload: res.data.data });
        resolve(res.data.data);
      })
      .catch((error) => {
        dispatch({ type: GET_ROUTE_DETAIL, payload: {} });
        console.log(error.response);
        reject(error);
        NotificationManager.error(error.response.data.message);
      });
  });
};



export const _requestGetAllRoute = (filter = {}) => {

  return new Promise((resolve, reject) => {
    api
      .get("/route/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const _exportRoutes = (filter = {}) => {
  return new Promise((resolve, reject) => {
    api
      .get("/route/exportExcelRoute", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
        responseType: 'blob'
      })
      .then((response) => {
        resolve(response);
        console.log(response)
        let time_stamp = new Date().getTime();
        // Log somewhat to show that the browser actually exposes the custom HTTP header
        const fileNameHeader = "Content-Disposition";
        const suggestedFileName = response.headers[fileNameHeader];
        const effectiveFileName = (suggestedFileName === undefined
          ? `danh_sach_tuyen_duong_${time_stamp}.xlsx`
          : suggestedFileName);
        console.log("Received header [" + fileNameHeader + "]: " + suggestedFileName + ", effective fileName: " + effectiveFileName);
        // Let the user save the file.
        FileSaver.saveAs(response.data, effectiveFileName);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });
};

export const _exportCars = (filter = {}) => {
  return new Promise((resolve, reject) => {
    api
      .get("/vehicle/export", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
        responseType: 'blob'
      })
      .then((response) => {
        resolve(response);
        console.log(response)
        let time_stamp = new Date().getTime();
        // Log somewhat to show that the browser actually exposes the custom HTTP header
        const fileNameHeader = "Content-Disposition";
        const suggestedFileName = response.headers[fileNameHeader];
        const effectiveFileName = (suggestedFileName === undefined
          ? `danh_sach_xe_${time_stamp}.xlsx`
          : suggestedFileName);
        console.log("Received header [" + fileNameHeader + "]: " + suggestedFileName + ", effective fileName: " + effectiveFileName);
        // Let the user save the file.
        FileSaver.saveAs(response.data, effectiveFileName);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });
};