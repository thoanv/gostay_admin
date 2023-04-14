import { GET_LIST_ROOM_UTILITIES, ADD_ROOM_UTILITIES } from "Actions/types";
import { DELETE_ROOM_UTILITIES, UPDATE_ROOM_UTILITIES } from "../actions/types";
const INIT_STATE = {
    list: [],
    
};

function findIndex(arrID, id) {
    if (arrID.length) {
        for (let i = 0; i < arrID.length; i++) {
            if (arrID[i].id.toString() === id.toString()) return i;
        }
    }
    return -1;
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_LIST_ROOM_UTILITIES: {
            let newList = [...action.payload];
            return {
                ...state,
                list: newList
            };
        }
        case ADD_ROOM_UTILITIES:
            return {
                list: [action.payload, ...state.list]
            }
        case UPDATE_ROOM_UTILITIES:
            const idx = findIndex(state.list, action.payload.id);
            let ls = [...state.list];
            ls[idx] = { ...ls[idx], ...action.payload}
            return {
                ...state,
                list: [...ls]
            }
        case DELETE_ROOM_UTILITIES:
            const idxDelete = findIndex(state.list, action.payload);
            state.list.splice(idxDelete,1)
            return {
                ...state,
                list: [...state.list]
            }
        default: return state;
    }
}