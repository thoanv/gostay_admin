import {
    GET_ALL_DISTRICT,
  
} from './types';
import api from "../api";

export const _getAllDistricts = (id) => dispatch => {
    return new Promise((resolve, reject) => {
     api.get(`/vn/districts/${id}`).then(res => {
        resolve(res.data)
      
        dispatch({type: GET_ALL_DISTRICT, payload: res.data.data})
    }).catch(err => {
        reject(err)
        console.log(err);
    })
})
}

