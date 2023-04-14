import {
    GET_ALL_WARD,
  
} from "./types";
import api  from "../api";

export const _getAllWards = (id) => dispatch => {
    return new Promise((resolve, reject) => {
     api.get(`/vn/wards/${id}`).then(res => {
        resolve(res.data)
      
        dispatch({type: GET_ALL_WARD, payload: res.data.data})
    }).catch(err => {
        reject(err)
        console.log(err);
    })
})
}