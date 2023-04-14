import {
    GET_ALL_GROWHACKING_CAMPAIGNS,
    ADD_A_GROWHACKING_CAMPAIGN,
    UPDATE_GROWHACKING_CAMPAIGN,
    DELETE_GROWHACKING_CAMPAIGN,
    GET_A_GROWHACKING_CAMPAIGN
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getAllCampaigns = (filter, paginate = true) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get("/growth-hacking/list", {
            params: { ...filter },
            paramsSerializer: params => {
                return qs.stringify(params, { encodeValuesOnly: true });
            }
        }).then(res => {
            resolve(res.data);
            dispatch({ type: GET_ALL_GROWHACKING_CAMPAIGNS, payload: res.data.data });
        }).catch(error => {
            reject(error);
            console.log(error);
            // NotificationManager.error(error.response.data.message);
        });
    });
};

export const getCampaignDetail = (id) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get(`/growth-hacking/load/${id}`).then(res => {
            dispatch({ type: GET_A_GROWHACKING_CAMPAIGN, payload: res.data.data });
            resolve(res.data.data);
        }).catch(error => {
            reject(error);
            console.log(error);
            // NotificationManager.error(error.response.data.message);
        });
    });
};

export const createCampaign = data => dispatch => {
    return new Promise((resolve, reject) => {
        api.post("/growth-hacking/save", data).then(res => {
            dispatch({ type: ADD_A_GROWHACKING_CAMPAIGN, payload: res.data.data });
            NotificationManager.success("Create success");
            resolve(res.data);
        }).catch(error => {
            reject(error.response.data);
            NotificationManager.error("Can't create item");
        });
    });
};

export const updateCampaign = (id, data) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post(`/growth-hacking/update/${id}`, data).then(res => {
            dispatch({ type: UPDATE_GROWHACKING_CAMPAIGN, payload: res.data.data });
            NotificationManager.success("Update success");
            resolve(res.data);
        }).catch(error => {
            reject(error.response.data);
            // NotificationManager.error(error.response.data.message);
            NotificationManager.error("Can't update");
            // console.log(error);
        });
    });
};

export const batchDelete = ids => dispatch => {
    return new Promise((resolve, reject) => {
        api.delete("/growth-hacking/delete", {data: {ids: ids}}).then(res => {
            dispatch({ type: DELETE_GROWHACKING_CAMPAIGN, payload: ids });
            NotificationManager.success("Deleted success");
            resolve(res.data);
        }).catch(error => {
            console.log(error);

            NotificationManager.error("Can't delete");
            reject(error);
        });
    });
};