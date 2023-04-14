import {
    GET_ALL_ROLE,
    CREATE_NEW_ROLE,
    UPDATE_ROLE,
    GET_ALL_PERMISSION_OF_ROLE,
    GET_ALL_PERMISSION,
    DELETE_ROLE
} from '../actions/types';

const INIT_STATE = {
    list_role: [],
    permission_of_role: {
        list: [],
        list_id: []
    },
    list_permission: [],
    list_permission_id: []
};

function findIndex(arrID, id) {
    if (arrID.length) {
        for (let i = 0; i < arrID.length; i++) {
            if (arrID[i]._id.toString() === id.toString()) return i;
        }
    }
    return -1;
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_ALL_PERMISSION: {
            return {
                ...state,
                list_permission: action.payload.data,
                list_permission_id: action.payload.permission_id_arr
            };
        }
        case GET_ALL_ROLE: {
            return {
                ...state,
                list_role: action.payload.data.list,
            };
        }
        case DELETE_ROLE: {
            let newList = state.list_role.filter(item => {
                return item.id != action.id;
            });

            return {
                ...state,
                list_role: newList
            };
        }
        case GET_ALL_PERMISSION_OF_ROLE: {
            return {
                ...state,
                permission_of_role: {
                    list: action.payload.data,
                    list_id: action.payload.permission_id_arr
                }
            }
        }

        default: return state;
    }
}