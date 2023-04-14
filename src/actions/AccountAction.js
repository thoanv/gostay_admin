import {
  GET_ALL_ACCOUNT,
  ADD_A_ACCOUNT,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
  ACCOUNT_WISHLIST,
  GET_ALL_ACCOUNT_WITHOUT_PAGINATE,
  GET_DETAIL_ACCOUNT
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";
var FileSaver = require('file-saver');

export const getAllACCOUNT = (filter = {}, type) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get(`/customer/list/${type}`, {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        resolve(res.data);
        dispatch({ type: GET_ALL_ACCOUNT, payload: res.data.data });
      })
      .catch(error => {
        reject(error);
        NotificationManager.error('Failed!');
      });
  });
};

export const getListAdmin = (filter = {}, type) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get(`/customer/listAdmin`, {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        resolve(res.data);
        dispatch({ type: GET_ALL_ACCOUNT, payload: res.data.data });
      })
      .catch(error => {
        console.log(error)
        reject(error);
        NotificationManager.error('Failed!');
      });
  });
};

export const getAllAccountWithoutPaging = (filter = {}, type) => dispatch => {


  return new Promise((resolve, reject) => {
    api
      .get(`/customer/list/${type}`, {
        params: { paging: 0 },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {

        dispatch({
          type: GET_ALL_ACCOUNT_WITHOUT_PAGINATE,
          payload: res.data.data
        });
        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        // NotificationManager.error(error.response.data.msg);
      });
  });
};

export const createACCOUNT = ACCOUNT => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post("/customer/save", ACCOUNT)
      .then(res => {
        resolve(res.data);
        dispatch({ type: ADD_A_ACCOUNT, payload: res.data.data });
        NotificationManager.success(res.data.message);
      })
      .catch(error => {
        reject(error.response);
        NotificationManager.error(error.response.data.message);
      });
  });
};
export const updateACCOUNT = ACCOUNTupdate => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/customer/update/${ACCOUNTupdate.id}`, ACCOUNTupdate)
      .then(res => {
        resolve(res.data);
        dispatch({ type: UPDATE_ACCOUNT, payload: res.data.data });
        NotificationManager.success(res.data.message);


      })
      .catch(error => {
        reject(error.response);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const batchDelete = ids => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .delete("/customer/delete", { data: ids })
      .then(res => {
        dispatch({ type: DELETE_ACCOUNT, payload: res.data.data });
        NotificationManager.success("Deleted success");
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const updatePermissionACCOUNT = update => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post("/customer/permission", update)
      .then(res => {
        resolve(res.data);
        dispatch({ type: UPDATE_ACCOUNT, payload: res.data.data });
        NotificationManager.success(res.data.message);
      })
      .catch(error => {
        reject(error.response);
        // NotificationManager.error(error.response);
      });
  });
};
export const getAllWishListAccount = (id, filter = {}) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get(`/tour/mywishlist?user_id=${id}`, {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        resolve(res.data);

        dispatch({ type: ACCOUNT_WISHLIST, payload: res.data.data });
      })
      .catch(error => {
        reject(error.response.data);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const getCustomerDetail = (id) => dispatch => {


  return new Promise((resolve, reject) => {
    api.get(`/customer/load/${id}`).then(res => {
      dispatch({ type: GET_DETAIL_ACCOUNT, payload: res.data.data });


      resolve(res.data);

    })
      .catch(error => {
        reject(error.response);
        // NotificationManager.error(error.response.data.message);
        console.log(error);
      })
  })
}


export const _searchAccount = (filter = {}, type) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/customer/list/${type}`, {
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

export const uactivity = (filter) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/uactivity/list`, {
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
        NotificationManager.error('Failed!');
      });
  });
};

export const _exportAccount = (type, filter = {}) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/customer/export/${type}`, {
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
          ? `danh_sach_tai_khoan_${time_stamp}.xlsx`
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

export const _exportAdmin = (filter = {}) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/customer/exportAdmin`, {
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
          ? `danh_sach_tai_khoan_${time_stamp}.xlsx`
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