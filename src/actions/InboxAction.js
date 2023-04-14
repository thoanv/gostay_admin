/**
 * Chat App Actions
 */
import {
    INBOX_WITH_SELECTED_USER,
    INBOX_MESSAGE_TO_USER,
    GET_ALL_MESSAGES_INBOX,
    SET_READ_CONVERSATION_INBOX,
    GET_NEW_MESSAGE_CONVERSATION_INBOX,
    REMOVE_CURRENT_INBOX,
    REMOVE_CONVERSATION_INLIST_INBOX,
    OPEN_INBOX,
    REPLY_INBOX_CHAT,
    RELOAD_MESSAGE
} from 'Actions/types';

import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

/**
 * Redux Action To Emit Boxed Layout
 * @param {*boolean} isBoxLayout 
 */
export const chatWithSelectedUser = (conversation) => dispatch => {
    dispatch({
        type: INBOX_WITH_SELECTED_USER,
        payload: conversation
    })

};

export const sendMessageToUser = (data, cplData) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post("/chat/sendMessage", data)
            .then(res => {
                resolve(data);
                dispatch({ type: INBOX_MESSAGE_TO_USER, payload: cplData });
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


export const receiveMessageInbox = (cplData) => dispatch => {
    dispatch({ type: GET_NEW_MESSAGE_CONVERSATION_INBOX, payload: cplData });
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
                dispatch({ type: GET_ALL_MESSAGES_INBOX, payload: res.data.data });
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
                dispatch({ type: SET_READ_CONVERSATION_INBOX, payload: data });
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


export const reply = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post("/chat/reply", data)
            .then(res => {
                resolve(data);
                dispatch({ type: REPLY_INBOX_CHAT, payload: data });
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

export const removeCurrentInbox = (data) => dispatch => {
    dispatch({ type: REMOVE_CURRENT_INBOX, payload: data })
}

export const removeCVinListInbox = (data) => dispatch => {
    dispatch({ type: REMOVE_CONVERSATION_INLIST_INBOX, payload: data })
}

export const openInbox = data => dispatch => {
    dispatch({ type: OPEN_INBOX, payload: data })
}