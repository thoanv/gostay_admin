import {
  GET_ALL_CATEGORY,
  ADD_A_CATEGORIES,
  UPDATE_CATEGORIES,
  DELETE_CATEGORY,
  BATCH_DELETE,
  GET_ALL_PARENT,
  GET_ALL_PARENT_WITHOUT_PAGINATE
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getAllCategory = (filter, paginate = true) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get("/category/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
          // return qs.stringify(params, { encodeValuesOnly: true });
        }
      })
      .then(res => {
        resolve(res.data);
        // if(paginate) {
          dispatch({ type: GET_ALL_CATEGORY, payload: res.data.data });
        // } 
        // else {
        //   dispatch({ type: GET_ALL_PARENT_WITHOUT_PAGINATE, payload: res.data.data });
        // }
      })
      .catch(error => {
        reject(error);
        console.log(error);
      });
  });
};
export const getAllParent = () => dispatch => {

  return new Promise((resolve, reject) => {
    api
      .get("/category/list", {
        params: { paging: 0 },
        paramsSerializer: params => {
          return qs.stringify(params, { encodeValuesOnly: true });
        }
      })
      .then(res => {
        resolve(res.data);
        dispatch({ type: GET_ALL_PARENT, payload: res.data.data });
      })
      .catch(error => {
        reject(error);
        console.log(error);
      });
  });
};
export const createACategory = category => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post("/category/save", category)
      .then(res => {
        console.log(res.data);
        dispatch({ type: ADD_A_CATEGORIES, payload: res.data.data });
        NotificationManager.success("Success create");
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const updateCategory = data => dispatch => {

  return new Promise((resolve, reject) => {
    api
      .post(`/category/update/${data.id}`, data)
      .then(response => {
        dispatch({ type: UPDATE_CATEGORIES, payload: response.data.data });
        NotificationManager.success(response.data.message);
        resolve(response.data);
      })
      .catch(error => {
        NotificationManager.error(error.response.data.message);
        reject(error.response.data);
      });
  });
};

// export const updateParent = ( data) => dispatch => {
//     return new Promise((resolve, reject) => {
//          api.post('/category/save', data).then(response => {

//         dispatch({ type: UPDATE_CATEGORY, payload: response.data.data });
//         NotificationManager.success(response.data.msg);

//             resolve(response.data);

//         }).catch(error => {
//                 NotificationManager.error(error.response.data.msg);
//                  reject(error.response.data);

//             })
//     })
// }

// export const deleteCategory = (idCategory) => dispatch => {
//     return new Promise((resolve, reject) => {
//         api.post('/category/delete', idCategory).then(res => {
//             dispatch({ type: DELETE_CATEGORY, payload: res.data.data });
//             resolve(res.data);
//             NotificationManager.success('Delete Success');
//         }).catch(error => {
//             reject(error.response.data);
//             NotificationManager.error(error.response.data.msg)
//         })
//     })
// }

export const batchDelete = idCategory => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .delete("/category/delete", {data:idCategory})
      .then(res => {
        dispatch({ type: DELETE_CATEGORY, payload: res.data.data });
        resolve(res.data);
        NotificationManager.success("Delete Success");
      })
      .catch(error => {
        reject(error);
        // NotificationManager.error(error)
      });
  });
};
