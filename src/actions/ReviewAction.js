import { NotificationManager } from "react-notifications";
import {
  LIST_REVIEW,
  ADD_REVIEW,
  UPDATE_REVIEW,
  DELETE_REVIEW,
  UPDATE_STATUS_REVIEW,
} from "Actions/types";
import api from "../api";
import qs from "qs";

export const getAllReview = (filter = {}) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get("/review/list", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        resolve(res.data);
        dispatch({ type: LIST_REVIEW, payload: res.data.data });
        // console.log('action: ', res);
      })
      .catch((error) => {
        reject(error.response.data);
        // NotificationManager.error(error.response.data.message);
      });
  });
};

export const createReview = (data) => (dispatch) => {
  // console.log('------', data);
  return new Promise((resolve, reject) => {
    api
      .post("/review/save", data)
      .then((res) => {
        console.log("res", res.data);
        dispatch({ type: ADD_REVIEW, payload: res.data.data });
        NotificationManager.success("Create success");
        resolve(res.data);
        // console.log("res",res.data)
      })
      .catch((err) => {
        console.log("data", err.response);

        reject(err.response);
        NotificationManager.error("Can't create item");
      });
  });
};

export const updateReview = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/review/update/${data.id}`, data)
      .then((res) => {
        dispatch({ type: UPDATE_REVIEW, payload: res.data.data });
        NotificationManager.success("Update success");
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
        console.log(error);

        // NotificationManager.error(error.response.data.message);
        NotificationManager.error("Can't update");
        //  console.log(error.response);
      });
  });
};

export const updateReviewStatus = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post("/common/status", data)
      .then((res) => {
        dispatch({ type: UPDATE_STATUS_REVIEW, payload: res.data.data });
        // NotificationManager.success('Update status success');
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
        // NotificationManager.error('Can\'t status update');
      });
  });
};

// export const deleteAirline = idAirline => dispatch => {
//   return new Promise((resolve, reject) => {
//     // console.log('res: ');
//     api
//       .post('/airline/delete', { id: idAirline })
//       .then(res => {
//         console.log(res.data.data);

//         dispatch({ type: DELETE_AIRLINE, payload: res.data.data });
//         NotificationManager.success('Deleted success');
//         resolve(res.data);
//       })
//       .catch(error => {
//         reject(error.response.data);
//         NotificationManager.error('Can\'t delete');
//       });
//   });
// };

export const batchDelete = (ids) => (dispatch) => {
  // console.log('ids',this);

  return new Promise((resolve, reject) => {
    api
      .delete("/review/delete", {data:ids})
      .then((res) => {
        dispatch({ type: DELETE_REVIEW, payload: res.data.data });
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
