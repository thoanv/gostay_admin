import {
    GET_ALL_API_KEYS,
    CREATE_NEW_API_KEY,
    DELETE_API_KEY
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getAllApiKeys = (filter, paginate = true) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get("/api-key/list", {
            params: { ...filter },
            paramsSerializer: params => {
                return qs.stringify(params, { encodeValuesOnly: true });
            }
        }).then(res => {
            resolve(res.data);
            dispatch({ type: GET_ALL_API_KEYS, payload: res.data.data });
        }).catch(error => {
            reject(error);
            console.log(error);
            // NotificationManager.error(error.response.data.message);
        });
    });
};

export const createApiKey = data => dispatch => {
    return new Promise((resolve, reject) => {
        api.post("/api-key/save", data).then(res => {
            dispatch({ type: CREATE_NEW_API_KEY, payload: res.data.data });
            NotificationManager.success("Create success");
            resolve(res.data);
        }).catch(error => {
            reject(error.response.data);
            NotificationManager.error("Can't create item");
        });
    });
};

export const deleteApiKeys = ids => dispatch => {
    return new Promise((resolve, reject) => {
        api.delete("/api-key/delete", {data: {id: ids}}).then(res => {
            dispatch({ type: DELETE_API_KEY, payload: ids });
            NotificationManager.success("Deleted success");
            resolve(res.data);
        }).catch(error => {
            NotificationManager.error("Can't delete");
            reject(error);
        });
    });
};