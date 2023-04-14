import {
    GET_ALL_GROWTH_HACKING_RULES
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getAllRules = (filter, paginate = true) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get("/growth-hacking-rules/list", {
            params: { ...filter },
            paramsSerializer: params => {
                return qs.stringify(params, { encodeValuesOnly: true });
            }
        }).then(res => {
            resolve(res.data);
            dispatch({ type: GET_ALL_GROWTH_HACKING_RULES, payload: res.data.data });
        }).catch(error => {
            reject(error);
            console.log(error);
            // NotificationManager.error(error.response.data.message);
        });
    });
};