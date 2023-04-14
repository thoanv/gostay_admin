import {
  GET_ALL_MESSAGES,
  ADD_MESSAGES,
  UPDATE_MESSAGES,
  DELETE_MESSAGES,
  SEND_MESSAGES,
  GET_ALL_MESSAGES_WITHOUT_PAGINATE
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getAllMessages = (filter, paginate = true) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get("/messages/list", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
          // return qs.stringify(params, { encodeValuesOnly: true });
        }
      })
      .then(res => {
        resolve(res.data);
        if (paginate) {
          dispatch({ type: GET_ALL_MESSAGES, payload: res.data.data });
        }
        else {
          dispatch({ type: GET_ALL_MESSAGES_WITHOUT_PAGINATE, payload: res.data.data });
        }
      })
      .catch(error => {
        reject(error);
        console.log(error);
      });
  });
};
export const createMessages = messages => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post("/messages/save", messages)
      .then(res => {
        console.log(res.data);
        dispatch({ type: ADD_MESSAGES, payload: res.data.data });
        NotificationManager.success("Success create");
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const updateMessages = data => dispatch => {
  console.log("data", data);

  return new Promise((resolve, reject) => {
    api
      .post(`/messages/update/${data.id}`, data)
      .then(response => {
        dispatch({ type: UPDATE_MESSAGES, payload: response.data.data });
        NotificationManager.success(response.data.message);
        resolve(response.data);
      })
      .catch(error => {
        console.log(error.response);
        NotificationManager.error(error.response.data.message);
        reject(error.response.data);
      });
  });
};

export const batchDelete = ids => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .delete("/messages/delete", { data: ids })
      .then(res => {
        dispatch({ type: DELETE_MESSAGES, payload: res.data.data });
        resolve(res.data);
        NotificationManager.success("Delete Success");
      })
      .catch(error => {
        reject(error);
        // NotificationManager.error(error)
      });
  });
};

export const sendMessages = (msg_id, ids) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/messages/send/${msg_id}`, { uids: ids })
      .then(res => {
        // dispatch({ type: SEND_MESSAGES, payload: res.data.data });
        resolve(res.data);
        NotificationManager.success("Đã gửi thành công!");
      })
      .catch(error => {
        reject(error);
        console.log(error.response);
        NotificationManager.error('Có lỗi xảy ra');
      });
  });
};

export const sendMessageAll = (msg_id) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/messages/sendAll/${msg_id}`, {})
      .then(res => {
        resolve(res.data);
        NotificationManager.success("Đã gửi thành công!");
      })
      .catch(error => {
        reject(error);
        console.log(error.response);
        NotificationManager.error('Có lỗi xảy ra');
      });
  });
};
