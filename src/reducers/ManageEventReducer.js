import { GET_LIST_MANAGE_EVENT, ADD_MANAGE_EVENT } from "Actions/types";
import { DELETE_MANAGE_EVENT, UPDATE_MANAGE_EVENT, VERIFY_MANAGE_EVENT } from "../actions/types";
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
        case GET_LIST_MANAGE_EVENT: {
            let newList = [...action.payload];
            return {
                ...state,
                list: newList
            };
        }
        case ADD_MANAGE_EVENT:
            return {
                list: [action.payload, ...state.list]
            }
        case UPDATE_MANAGE_EVENT:
            const idx = findIndex(state.list, action.payload.id);
            let ls = [...state.list];
            ls[idx] = { ...ls[idx], ...action.payload}
            return {
                ...state,
                list: [...ls]
            }
        case DELETE_MANAGE_EVENT:
            const idxDelete = findIndex(state.list, action.payload);
            state.list.splice(idxDelete,1)
            return {
                ...state,
                list: [...state.list]
            }
            case VERIFY_MANAGE_EVENT: {
                let { id, tour } = action.payload;
                let index = findIndex(state.list, id, true);
                if(tour) {
                  let newLists1 = state.list;
                  newLists1[index] = { ...newLists1[index], status: action.payload.status};
                  return {
                    ...state,
                      listEvent: newLists1,
                  };
                }
          
                let newLists2 = state.listEvent;
                newLists2[index] = action.payload;
                return {
                  ...state,
                    listEvent: newLists2,
                };
              }
        default: return state;
    }
}