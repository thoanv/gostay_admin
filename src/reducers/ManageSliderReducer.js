import { GET_LIST_SLIDER, ADD_SLIDER, DELETE_SLIDER, UPDATE_SLIDER } from "../actions/types";
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
        case GET_LIST_SLIDER: {
            let newList = [...action.payload];
            return {
                ...state,
                list: newList
            };
        }
        case ADD_SLIDER:
            return {
                list: [action.payload, ...state.list]
            }
        case UPDATE_SLIDER:
            const idx = findIndex(state.list, action.payload.id);
            let ls = [...state.list];
            ls[idx] = { ...ls[idx], ...action.payload}
            return {
                ...state,
                list: [...ls]
            }
        case DELETE_SLIDER:
            const idxDelete = findIndex(state.list, action.payload);
            state.list.splice(idxDelete,1)
            return {
                ...state,
                list: [...state.list]
            }
        default: return state;
    }
}