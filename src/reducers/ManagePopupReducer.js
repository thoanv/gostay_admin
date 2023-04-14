import { GET_LIST_POPUP, ADD_POPUP, DELETE_POPUP, UPDATE_POPUP } from "../actions/types";
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
        case GET_LIST_POPUP: {
            let newList = [...action.payload];
            console.log(action.payload,newList)
            return {
                ...state,
                list: [action.payload]
            };
        }
        case ADD_POPUP:
            return {
                list: [action.payload, ...state.list]
            }
        case UPDATE_POPUP:
            const idx = findIndex(state.list, action.payload.id);
            let ls = [...state.list];
            ls[idx] = { ...ls[idx], ...action.payload}
            return {
                ...state,
                list: [...ls]
            }
        case DELETE_POPUP:
            const idxDelete = findIndex(state.list, action.payload);
            state.list.splice(idxDelete,1)
            return {
                ...state,
                list: [...state.list]
            }
        default: return state;
    }
}