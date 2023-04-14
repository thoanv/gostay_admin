import {
  GET_ALL_PROPERTY,
  ADD_A_PROPERTY,
  UPDATE_PROPERTY,
  DELETE_PROPERTY,
  GET_DETAIL_PROPERTY,
  ADD_PROPERTY_ROOM_RATE,
  GET_PROPERTY_ROOM_RATE,
  DELETE_PROPERTY_ROOM_RATE,
  UPDATE_PROPERTY_ROOM_RATE,
  UPDATE_MULTI_PROPERTY_ROOM_RATE,
  GET_DATA_UTIL,
  GET_UTIL_NEAR_BY,
  UPDATE_UTIL_NEAR_BY,
  APPROVE,
  UNAPPROVE
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";
var FileSaver = require('file-saver');


export const _getAll = (filter = {}) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get("/property/list", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
      })
      .then((res) => {
        dispatch({ type: GET_ALL_PROPERTY, payload: res.data.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const _requestGetAll = (filter = {}) => {
  return new Promise((resolve, reject) => {
    api
      .get("/property/list", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
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

export const _getDetail = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/property/load/${id}`, id)
      .then((res) => {
        dispatch({ type: GET_DETAIL_PROPERTY, payload: res.data.data });
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
      .post("/property/save", data)
      .then((res) => {
        dispatch({ type: ADD_A_PROPERTY, payload: res.data.data });
        NotificationManager.success("Create success");
        resolve(res.data);
      })
      .catch((error) => {
        reject(error.response);
        NotificationManager.error("Can't create item");
      });
  });
};

export const _update = (data) => (dispatch) => {
  console.log('data', data);
  return new Promise((resolve, reject) => {
    api
      .post(`/property/update/${data.id}`, data)
      .then((res) => {
        dispatch({ type: UPDATE_PROPERTY, payload: res.data.data });
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
      .delete("/property/delete", { data: ids })
      .then((res) => {
        dispatch({ type: DELETE_PROPERTY, payload: res.data.data });
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

export const getpropertyRoomRates = (id, month, year) => (dispatch) => {
  console.log('year', year);
  return new Promise((resolve, reject) => {
    return api
      .get(`/property/list_room_rate/${id}`, {
        params: {
          month: month,
          year: year
        },
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
      })
      .then((res) => {
        dispatch({ type: GET_PROPERTY_ROOM_RATE, payload: res.data.data });
        resolve(res.data.data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
};
export const addpropertyRoomRates = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .post("/property/save_room_rate", data)
      .then((res) => {
        dispatch({ type: ADD_PROPERTY_ROOM_RATE, payload: res.data.data });
        NotificationManager.success("Add  success!");
        resolve(res.data.data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
};
export const updatepropertyRoomRates = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post("/property/update_room_rate", data)
      .then((res) => {
        dispatch({ type: UPDATE_PROPERTY_ROOM_RATE, payload: res.data.data });
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
export const updatemultipropertyRoomRates = (data) => (dispatch) => {

  return new Promise((resolve, reject) => {
    api
      .post("/property/update_list_date", data)
      .then((res) => {
        dispatch({ type: UPDATE_MULTI_PROPERTY_ROOM_RATE, payload: res.data.data });
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
export const removePropertyRateByConditionals = (data) => (dispatch) => {

  return new Promise((resolve, reject) => {
    return api
      .delete("/property/delete_room_rate", { data: data })
      .then((res) => {
        dispatch({ type: DELETE_PROPERTY_ROOM_RATE });
        NotificationManager.success("Xoá thành công");
        resolve(true);
      })
      .catch((error) => {
        reject(error);
        console.log(error);

      });
  });
};
export const getFilterDataUtilities = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/property_sup/getFilterDataUtilities`)
      .then((res) => {
        dispatch({ type: GET_DATA_UTIL, payload: res.data.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });

}
export const getlistUtilNearby = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get('/property_sup/listUtilNearby')
      .then((res) => {
        dispatch({ type: GET_UTIL_NEAR_BY, payload: res.data.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });
};
export const updateUtilNearby = (data, id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/property_sup/updateRoomUtil/${id}`, { nearby_util: data })
      .then((res) => {
        console.log('res', res);
        dispatch({ type: UPDATE_UTIL_NEAR_BY, payload: res.data.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });
};
export const approveProperty = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/property/approve/${id}`)
      .then((res) => {

        dispatch({ type: APPROVE, payload: res.data.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });
};
export const unapproveProperty = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/property/unapprove/${id}`)
      .then((res) => {
        console.log('unapproveProperty', res);
        dispatch({ type: UNAPPROVE, payload: res.data.data });
        resolve(res.data);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });
};

export const _exportOrder = (filter = {}) => {
  return new Promise((resolve, reject) => {
    api
      .get("/property/export", {
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
          ? `danh_sach_phong_${time_stamp}.xlsx`
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

