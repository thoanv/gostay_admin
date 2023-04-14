import {
    GET_ALL_PROPERTY,
    ADD_A_PROPERTY,
    UPDATE_PROPERTY,
    DELETE_PROPERTY,
    GET_DETAIL_PROPERTY,
    ADD_PROPERTY_ROOM_RATE,
    GET_PROPERTY_ROOM_RATE,
    DELETE_PROPERTY_ROOM_RATE,
    UPDATE_PROPERTY_ROOM_RATE,
    UPDATE_MULTI_PROPERTY_ROOM_RATE,
    GET_DATA_UTIL,
    GET_UTIL_NEAR_BY,
    UPDATE_UTIL_NEAR_BY,
    UNAPPROVE,
    APPROVE
    
} from 'Actions/types';
const INIT_STATE = {
    detail:{},
    list: [],
    listRoomRates:[],
    listDataUtilities:[],
    listUtilNearby:[],
    paging: {
        count: 0,
        totalPage: 1,
        perpage: 1,
        page: 1
    },
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
        case GET_ALL_PROPERTY: {
            let newList = [...action.payload.list];
            return {
                ...state,
                list: newList,
                paging: action.payload.paging
            };
        }
      

        case ADD_A_PROPERTY: {
            state.list.unshift(action.payload);
            return { ...state };
        }
        case APPROVE: {
            let { id } = action.payload;
            let index = findIndex(state.list, id);
            let newlist = [...state.list];
            newlist[index] = action.payload;

            return {
                ...state,
                list: newlist
            };
        }
        case UNAPPROVE: {
            let { id } = action.payload;
            let index = findIndex(state.list, id);
            let newlist = [...state.list];
            newlist[index] = action.payload;

            return {
                ...state,
                list: newlist
            };
        }
        case UPDATE_PROPERTY: {
            let { id } = action.payload;
            let index = findIndex(state.list, id);
            let newlist = [...state.list];
            newlist[index] = action.payload;

            return {
                ...state,
                list: newlist
            };
        }
        case DELETE_PROPERTY: {
            let newList = state.list.filter(item => {
                return action.payload.indexOf(item.id) < 0;
            });
            let newPaging = { ...state.paging };
            newPaging.count = state.paging.count - action.payload.length;

            return {
                ...state,
                list: newList,
                paging: newPaging
            };
        }
        case GET_DETAIL_PROPERTY: {
            return {
                ...state,
                detail: action.payload
            };
        }
        case GET_DATA_UTIL:{
            return {
                ...state,
                listDataUtilities: action.payload
            }
        }
        case  GET_UTIL_NEAR_BY:{
            return {
                ...state,
                listUtilNearby: action.payload
            }
        }
        
        case UPDATE_UTIL_NEAR_BY: {
            return { ...state };
          }
        case GET_PROPERTY_ROOM_RATE: {
            return { ...state, listRoomRates: action.payload };
          }
          case ADD_PROPERTY_ROOM_RATE: {
            return { ...state };
          }
          case UPDATE_PROPERTY_ROOM_RATE: {
            return { ...state };
          }
          case DELETE_PROPERTY_ROOM_RATE: {
            return { ...state };
          }
          case UPDATE_MULTI_PROPERTY_ROOM_RATE: {
            return { ...state };
          }
        default: return state;
    }
}