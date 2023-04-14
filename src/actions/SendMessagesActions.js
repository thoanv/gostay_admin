import {
  GET_LIST_MESSAGES_CHAT,
  GET_CONVERSATION,
  SEND_MESSAGES_CHAT,
  GET_LIST_NEW_MESSAGES,
  REPLY,
  RELOAD_MESSAGE
} from "./types";
import qs from "qs";
import { NotificationManager } from "react-notifications";
import api from "../api";

export const getListMessageChat = (id, filter) => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get(`/chat/messages/${id}`, {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        dispatch({ type: GET_LIST_MESSAGES_CHAT, payload: res.data.data });
        resolve(res.data);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

export const reloadMessage = data => dispatch => {
  
  dispatch({
    type: RELOAD_MESSAGE,
    payload: data
  })
}

export const getListNewMessage = () => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .get(`/chat/listNewMessage`)
      .then(res => {
        dispatch({ type: GET_LIST_NEW_MESSAGES, payload: res.data.data });
        resolve(res.data);
      })
      .catch(error => {
        console.log(error.response);
        reject(error);
      });
  });
};

export const getConversation = id => dispatch => {
  
  return new Promise((resolve, reject) => {
    api
      .get(`/chat/listConversation/${id}`, {
        params: {},
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        dispatch({ type: GET_CONVERSATION, payload: res.data.data });
        resolve(res.data);
        // const count = res.data.data.count_unread;
        // if (count > 0) {
        //   NotificationManager.success(
        //     "You have " + count + " unread message(s)"
        //   );
        // }
      })
      .catch(error => {
        console.log(error.response);
        reject(error);
      });
  });
};

export const sendMessage = data => dispatch => {
  console.log(data);
  
  return new Promise((resolve, reject) => {
    api
      .post("/chat/sendMessage", data)
      .then(res => {
        dispatch({ type: SEND_MESSAGES_CHAT, payload: res.data.data });
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
        NotificationManager.error("Failed!");
      });
  });
};

export const reply = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post("/chat/reply", data)
      .then(res => {
        dispatch({ type: REPLY, payload: res.data.data });
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
        NotificationManager.error("Failed!");
      });
  });
};

export const setRead = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post("/chat/setRead", data)
      .then(res => {
        // dispatch({ type: SEND_MESSAGES_CHAT, payload: res.data.data });
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
        NotificationManager.error("Failed!");
      });
  });
};
