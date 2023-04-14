/**
 * Chat App Actions
 */
import {
    CHAT_WITH_SELECTED_USER,
    GET_NEW_MESSAGE_CONVERSATION_CHAT,
    REPLY_CONVERSATION_CHAT,
    GET_ALL_MESSAGES_CHAT,
    GET_ALL_CONVERSATION_CHAT,
    GET_USER_CONVERSATION_CHAT,
    SET_READ_CONVERSATION_CHAT,
    RELOAD_MESSAGE
} from 'Actions/types';

import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

/**
 * Redux Action To Emit Boxed Layout
 * @param {*boolean} isBoxLayout 
 */
export const chatWithSelectedUser = (user) => dispatch => {
    dispatch({
        type: CHAT_WITH_SELECTED_USER,
        payload: user
    })

};

export const sendMessageToUser = (data, cplData) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post("/chat/sendMessage", data)
            .then(res => {
                resolve(data);
                dispatch({ type: GET_NEW_MESSAGE_CONVERSATION_CHAT, payload: cplData });
                dispatch({
                    type: RELOAD_MESSAGE,
                    payload: data
                })
            })
            .catch(error => {
                reject(error);
                console.log(error);
                NotificationManager.error("Send error. Please try again")
            });
    });
}


export const receiveMessageCVS = (cplData) => dispatch => {
    dispatch({ type: GET_NEW_MESSAGE_CONVERSATION_CHAT, payload: cplData });
}



export const getAllConversationChat = (filter) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get("/chat/conversation/list", {
            params: filter,
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        })
            .then(res => {
                resolve(res.data);
                dispatch({ type: GET_ALL_CONVERSATION_CHAT, payload: res.data.data });
            })
            .catch(error => {
                reject(error);
                console.log(error);
                NotificationManager.error(error.response.data.message)
            });
    });
}

export const getUserConversationChat = (id, filter) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get(`/chat/listConversation/${id}`, {
            params: filter,
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        })
            .then(res => {
                resolve(res.data);
                dispatch({ type: GET_USER_CONVERSATION_CHAT, payload: res.data.data });
            })
            .catch(error => {
                reject(error);
                console.log(error);
                NotificationManager.error(error.response.data.message)
            });
    });
}

export const getAllMessageChat = (id, filter) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get(`/chat/messages/${id}`, {
            params: filter,
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" });
            }
        })
            .then(res => {
                resolve(res.data);
                dispatch({ type: GET_ALL_MESSAGES_CHAT, payload: res.data.data });
            })
            .catch(error => {
                reject(error);
                console.log(error);
                NotificationManager.error(error.response.data.message)
            });
    });
}

export const reply = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post("/chat/reply", data)
            .then(res => {
                resolve(data);
                dispatch({ type: REPLY_CONVERSATION_CHAT, payload: data });
                dispatch({
                    type: RELOAD_MESSAGE,
                    payload: data
                })
            })
            .catch(error => {
                reject(error);
                console.log(error);
                NotificationManager.error(error.response.data.message)
            });
    });
}

export const setRead = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post("/chat/setRead", data)
            .then(res => {
                resolve(data);
                dispatch({ type: SET_READ_CONVERSATION_CHAT, payload: data });
                dispatch({
                    type: RELOAD_MESSAGE,
                    payload: data
                })
            })
            .catch(error => {
                reject(error);
                console.log(error);
                NotificationManager.error(error.response.data.message)
            });
    });
}
