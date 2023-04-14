import {
    GET_ALL_GROUP,
    GET_LIST_ASSETS,
    GET_GROUP_DETAIL,
    ADD_A_GROUP,
    UPDATE_GROUP,
    DELETE_GROUP,
} from 'Actions/types';
import api from '../api';
import { NotificationManager } from 'react-notifications';

export const getAllGroups = () => dispatch => {
    console.log("aa")
    return new Promise((resolve, reject) => {
        api.get('/group/list'

        ).then(res => {


            dispatch({ type: GET_ALL_GROUP, payload: res.data.data });
            resolve(res.data);
        }).catch(error => {
            reject(error.response.data);
            NotificationManager.error(error.response.data.message);
        })
    })
}
export const getListAssets = () => dispatch => {
    return new Promise((resolve, reject) => {
        api.get('/asset/list'

        ).then(res => {
            dispatch({ type: GET_LIST_ASSETS, payload: res.data.data });
            resolve(res.data);
        }).catch(error => {
            reject(error.response.data);
            NotificationManager.error(error.response.data.message);
        })
    })
}
export const createAGroup = (group) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post('/group/save', group).then(res => {
             
             
            dispatch({ type: ADD_A_GROUP, payload: res.data.data });
            resolve(res.data);
        }).catch(error => {
            reject(error.response.data);
            NotificationManager.error(error.response.data.message);
        })
    })
}
export const deleteGroup = (idGroup) => dispatch => {
    return new Promise((resolve, reject) => {
        api.delete('/group/delete', {data:idGroup}).then(response => {
          

            dispatch({ type: DELETE_GROUP, payload: idGroup });
            resolve(response.data);
            NotificationManager.success('Delete Success');
        }).catch(error => {
            reject(error.response.data);
            NotificationManager.error(error.response.data.message);
        })
        
    })
}
export const updateGroup = ( asset) => dispatch => {
    return new Promise((resolve, reject) => {
         api.post(`/group/update/${asset.id}`, asset).then(response => {
            
        dispatch({ type: UPDATE_GROUP, payload: response.data.data });
        NotificationManager.success(response.data.message);
         console.log('data:',response);
         
     
            resolve(response.data);
           
        }).catch(error => {
                NotificationManager.error(error.response.data.message);
                 reject(error.response.data);
                
             
            })
    })
}