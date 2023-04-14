import {
    DELETE_ROUTE_SERVICE,
    GET_ALL_ROUTE_SERVICE,
    UPDATE_ROUTE_SERVICE,
    CREATE_ROUTE_SERVICE
} from '../actions/types';
;
const INIT_STATE = {
    detail: {},
    list: [],
    paging: {
        count: 0,
        totalPage: 1,
        perpage: 10,
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
        case GET_ALL_ROUTE_SERVICE: {
            return {
                ...state,
                list: action.payload.list,
                paging: action.payload.paging
            };
        }


        case CREATE_ROUTE_SERVICE: {
            let newList = [...state.list];
            newList.unshift(action.payload);
            return { ...state };
        }
        case UPDATE_ROUTE_SERVICE: {
            let { id } = action.payload;
            let index = findIndex(state.list, id);
            let newlist = [...state.list];
            newlist[index] = action.payload;
            return {
                ...state,
                list: newlist
            };
        }
        case DELETE_ROUTE_SERVICE: {
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

        default: return state;
    }
}