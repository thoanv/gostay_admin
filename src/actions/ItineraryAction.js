import {
  LIST_ITINERARIES,
  ADD_ITINERARIES,
  UPDATE_ITINERARIES,
  DELETE_ITINERARIES,
  BATCH_DELETE
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getItineraries = (filter = {}, id) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get(`/itinerary/list/${id}`, {
        params: { ...filter },
        paramsSerializer: params => {
          //   return qs.stringify(params, { arrayFormat: "repeat" });
          return qs.stringify(params, { encodeValuesOnly: true });
        }
      })
      .then(res => {
        resolve(res.data);
        dispatch({ type: LIST_ITINERARIES, payload: res.data.data });
      })
      .catch(error => {
        reject(error);
        NotificationManager.error(error.response.data.message);
        console.log(error);
      });
  });
};
export const createAItineraries = data => dispatch => {
  console.log('data', data);
  
  return new Promise((resolve, reject) => {
    api
      .post("/itinerary/save", data)
      .then(res => {
        console.log(res)
        dispatch({ type: ADD_ITINERARIES, payload: res.data.data });
        NotificationManager.success(res.data.message);
        resolve(res.data);
      })
      .catch(error => {
        console.log(error)
        reject(error);
        // NotificationManager.error(error.response.data.msg);
      });
  });
};

export const updateItineraries = data => dispatch => {
  console.log(data);
  
  return new Promise((resolve, reject) => {
    api
      .post(`/itinerary/update/${data.id}`, data)
      .then(response => {
        console.log('res', response);
        
        dispatch({ type: UPDATE_ITINERARIES, payload: response.data.data });
        NotificationManager.success(response.data.message);
        resolve(response.data);
      })
      .catch(error => {
        NotificationManager.error(error.response.data.message);
        reject(error);
        console.log(error.response)
      });
  });
};

// export const deleteCategory = (idCategory) => dispatch => {
//     return new Promise((resolve, reject) => {
//         api.post('/itinerary/delete', idCategory).then(res => {
//             dispatch({ type: DELETE_ITINERARIES, payload: res.data.data });
//             resolve(res.data);
//             NotificationManager.success('Delete Success');
//         }).catch(error => {
//             reject(error.response.data);
//             NotificationManager.error(error.response.data.msg)
//         })
//     })
// }

export const batchDelete = ids => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .delete("/itinerary/delete", {data:ids})
      .then(res => {
        dispatch({ type: BATCH_DELETE, payload: res.data.data });
        resolve(res.data);
        NotificationManager.success("Delete Success");
      })
      .catch(error => {
        reject(error);
        // NotificationManager.error(error)
      });
  });
};
