import {
    GET_ALL_PROVINCE,
  
} from "./types";
import api from "../api";

export const _getAllProvinces = () => dispatch => {
    return new Promise((resolve, reject) => {
     api.get(`/vn/provinces`).then(res => {
        resolve(res.data)
      
        dispatch({type: GET_ALL_PROVINCE, payload: res.data.data})
    }).catch(err => {
        reject(err)
        console.log(err);
    })
})
}
