import {
    GET_ALL_ROLE,
    CREATE_NEW_ROLE,
    GET_ALL_PERMISSION_OF_ROLE,
    UPDATE_ROLE,
    GET_ALL_PERMISSION,
    UPDATE_ROLE_USER,
    DELETE_ROLE
} from './types';
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";



export const _getAll = () => dispatch => {
console.log("aaa")
    return new Promise((resolve, reject) => {
        api
            .get(`/group/list`)
            .then(res => {
                resolve(res.data);
                dispatch({ type: GET_ALL_ROLE, payload: res.data });
            })
            .catch(error => {
                reject(error.response);
                // NotificationManager.error('Có lỗi xảy ra, vui lòng thử lại');
                console.log(error.response);
            });
    });
};


export const _createNew = data => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .post("/group/save", data)
            .then(res => {
                console.log("resssss", res)
                resolve(res.data);
                dispatch({ type: CREATE_NEW_ROLE, payload: res.data });
                NotificationManager.success("Thêm thành công");
            })
            .catch(error => {
                // reject(error.response);
                // console.log(error.response);
                NotificationManager.error('Có lỗi xảy ra, vui lòng thử lại');
            });
    });
};


export const _update = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .post(`/group/update/${data.id}`, data)
            .then(res => {
                dispatch({
                    type: UPDATE_ROLE, payload: res.data
                });
                // NotificationManager.success("Cập nhật thành công");
                resolve(res.data);
            }).catch(error => {
                // reject(error.response);
                console.log("error", error);
                // NotificationManager.error('Có lỗi xảy ra, vui lòng thử lại');
            })
    })
}

export const _getAllPermissionOfRole = (data) => dispatch => {
    let filter = {
        roleids: [data]
    }
    return new Promise((resolve, reject) => {
        api
            .get(`/group/permissions`, {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params);
                },
            })
            .then(res => {
                console.log("res role", res)
                dispatch({
                    type: GET_ALL_PERMISSION_OF_ROLE, payload: res.data
                });
                resolve(res.data);
            }).catch(error => {
                reject(error.response);
                console.log(error.response);
                // NotificationManager.error('Có lỗi xảy ra, vui lòng thử lại');
            })
    })
}



export const _getAllPermissionOfRoleArr = (data) => {
    return new Promise((resolve, reject) => {
        api
            .get(`/group/permissions`, {
                params: { ...data },
                paramsSerializer: (params) => {
                    return qs.stringify(params);
                },
            })
            .then(res => {
                resolve(res.data);
            }).catch(error => {
                reject(error.response);
                console.log(error.response);
                // NotificationManager.error('Có lỗi xảy ra, vui lòng thử lại');
            })
    })
}

export const _getAllPermissionNotOfRole = (data) => {
    return new Promise((resolve, reject) => {
        api
            .get(`/group/permissions_not_in_roles`, {
                params: { ...data },
                paramsSerializer: (params) => {
                    return qs.stringify(params);
                },
            })
            .then(res => {
                resolve(res.data);
            }).catch(error => {
                reject(error.response);
                console.log(error.response);
                // NotificationManager.error('Có lỗi xảy ra, vui lòng thử lại');
            })
    })
}



export const _getAllPermission = () => dispatch => {

    return new Promise((resolve, reject) => {
        api
            .get(`/permission/list`)
            .then(res => {
                resolve(res.data);
                dispatch({ type: GET_ALL_PERMISSION, payload: res.data });
            })
            .catch(error => {
                reject(error.response);
                // NotificationManager.error('Có lỗi xảy ra, vui lòng thử lại');
                console.log(error.response);
            });
    });
};

export const _getAddPermissionUser = (id) => {
    return new Promise((resolve, reject) => {
        api
            .get(`/customer/permissions?userid=${id}`)
            .then(res => {
                resolve(res.data);
            }).catch(error => {
                reject(error.response);
                console.log(error.response);
            })
    })
}

export const _updateAddPermissionUser = (data) => {
    return new Promise((resolve, reject) => {
        api
            .post(`/customer/permission/extra`, data)
            .then(res => {
                resolve(res.data);
                NotificationManager.success("Cập nhật thành công")
            }).catch(error => {
                reject(error.response);
                console.log(error.response);
                NotificationManager.error('Có lỗi xảy ra, vui lòng thử lại');
            })
    })
}

export const _genPermission = () => {
    return new Promise((resolve, reject) => {
        api
            .post(`/gen_admin_permission`)
            .then(res => {
                resolve(res.data);
                // NotificationManager.success("Cập nhật thành công")
            }).catch(error => {
                reject(error.response);
                console.log(error.response);
            })
    })
}


export const _updatePermissionUser = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .post(`/customer/update/role`, data)
            .then(res => {
                resolve(res.data);
                console.log(res.data)
                // NotificationManager.success("Cập nhật thành công")
                dispatch({ type: UPDATE_ROLE_USER, payload: res.data.data })
            }).catch(error => {
                console.log(error)
                reject(error.response);
                console.log(error.response);
            })
    })
}


export const _deleteRole = (id) => dispatch => {
    return new Promise((resolve, reject) => {
        api
            .delete(`/group/delete/${id}`)
            .then(res => {
                resolve(res.data);
                dispatch({ type: DELETE_ROLE, payload: res.data, id: id })
            }).catch(error => {
                reject(error.response);
            })
    })
}




