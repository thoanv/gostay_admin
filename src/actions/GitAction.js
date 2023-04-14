import {
    GET_ALL_GIT,
    ADD_A_GIT,
    UPDATE_GIT,
    DELETE_GIT
  } from "./types";
  import api from "../api";
  import qs from "qs";
  import { NotificationManager } from "react-notifications";
  
  export const getAllGit = (filter = {}) => dispatch => {
    return new Promise((resolve, reject) => {
      api
        .get("/git/list", {
          params: { ...filter },
          paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
        .then(res => {
          dispatch({ type: GET_ALL_GIT, payload: res.data.data });
          resolve(res.data);
          console.log(res.data);
        })
        .catch(error => {
          console.log(error.response);
          reject(error);
          NotificationManager.error(error.response.data.message);
        });
    });
  };
  
  export const createGit = data => dispatch => {
    console.log("------", data);
    return new Promise((resolve, reject) => {
      api
        .post("/git/save", data)
        .then(res => {
            console.log(res);
            
          dispatch({ type: ADD_A_GIT, payload: res.data.data });
          NotificationManager.success("Create success");
          resolve(res.data);
        })
        .catch(error => {
            console.log(error.response);
            
          reject(error.response.data);
          NotificationManager.error("Can't create item");
        });
    });
  };
  
  export const updateGit = data => dispatch => {
    return new Promise((resolve, reject) => {
      api
        .post(`/git/update/${data.id}`, data)
        .then(res => {
          dispatch({ type: UPDATE_GIT, payload: res.data.data });
          NotificationManager.success("Update success");
          resolve(res.data);
        })
        .catch(error => {
          reject(error.response.data);
          // NotificationManager.error(error.response.data.message);
          NotificationManager.error("Can't update");
          // console.log(error);
        });
    });
  };
  
  export const batchDelete = ids => dispatch => {
    return new Promise((resolve, reject) => {
      api
        .delete("/git/delete", {data:ids})
        .then(res => {
          dispatch({ type: DELETE_GIT, payload: res.data.data });
          NotificationManager.success("Deleted success");
          resolve(res.data);
        })
        .catch(error => {
          console.log(error);
          NotificationManager.error("Can't delete");
          reject(error);
        });
    });
  };
  