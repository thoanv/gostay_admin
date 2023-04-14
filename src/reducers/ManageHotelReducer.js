import {
    GET_LIST_MANAGE_HOTEL,
    ADD_MANAGE_HOTEL,
    GET_LIST_ROOM_HOTEL,
    GET_DETAIL_ORDER_TOUR,
    GET_DETAIL_MANAGE_HOTEL
} from "Actions/types";
import { DELETE_MANAGE_HOTEL, UPDATE_MANAGE_HOTEL, VERIFY_MANAGE_HOTEL } from "../actions/types";
const INIT_STATE = {
    list: [],
    room: []
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
        case GET_LIST_MANAGE_HOTEL: {
            let newList = [...action.payload];
            return {
                ...state,
                list: newList
            };
        }
        case GET_DETAIL_MANAGE_HOTEL: {
            return {
                ...state,
                detail: action.payload,
            };
        }
        case GET_LIST_ROOM_HOTEL: {
            let newList = [...action.payload];
            return {
                ...state,
                room: newList
            };
        }
        case ADD_MANAGE_HOTEL:
            return {
                list: [action.payload, ...state.list]
            }
        case UPDATE_MANAGE_HOTEL:
            const idx = findIndex(state.list, action.payload.id);
            let ls = [...state.list];
            ls[idx] = { ...ls[idx], ...action.payload}
            return {
                ...state,
                list: [...ls]
            }
        case DELETE_MANAGE_HOTEL:
            const idxDelete = findIndex(state.list, action.payload);
            state.list.splice(idxDelete,1)
            return {
                ...state,
                list: [...state.list]
            }
            case VERIFY_MANAGE_HOTEL: {
                let { id, tour } = action.payload;
                let index = findIndex(state.list, id, true);
                if(tour) {
                  let newLists1 = state.list;
                  newLists1[index] = { ...newLists1[index], status: action.payload.status};
                  return {
                    ...state,
                    listHotel: newLists1,
                  };
                }
          
                let newLists2 = state.listHotel;
                newLists2[index] = action.payload;
                return {
                  ...state,
                  listHotel: newLists2,
                };
              }
        default: return state;
    }
}