import {
    DELETE_ROUTE_SERVICE,
    GET_ALL_ROUTE_SERVICE,
    UPDATE_ROUTE_SERVICE,
    CREATE_ROUTE_SERVICE
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const _getAll = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .get(`/route_service/list`, {
                params: { ...filter },
                paramsSerializer: params => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                }
            })
            .then(res => {
                resolve(res.data);
                dispatch({ type: GET_ALL_ROUTE_SERVICE, payload: res.data.data });
            })
            .catch(error => {
                console.log(error)
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};


export const _create = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .post("/route_service/save", data)
            .then(res => {
                resolve(res.data);
                dispatch({ type: CREATE_ROUTE_SERVICE, payload: res.data.data });
                console.log(res.data.data )
                NotificationManager.success(res.data.message);
            })
            .catch(error => {
                reject(error.response);
                NotificationManager.error(error.response.data.message);
            });
    });
};


export const _update = data => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .post(`/route_service/update/${data.id}`, data)
            .then(res => {
                resolve(res.data);
                console.log(res.data)
                dispatch({ type: UPDATE_ROUTE_SERVICE, payload: res.data.data });
                NotificationManager.success(res.data.message);
            })
            .catch(error => {
                console.log(error)
                reject(error.response);
                NotificationManager.error(error.response.data.message);
            });
    });
};

export const _delete = ids => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .delete("/route_service/delete", { data: ids })
            .then(res => {
                dispatch({ type: DELETE_ROUTE_SERVICE, payload: ids });
                NotificationManager.success("Deleted success");
                resolve(res.data);
            })
            .catch(error => {
                console.log(error);

                reject(error.response);
                NotificationManager.error(error.response.data.message);
            });
    });
};
