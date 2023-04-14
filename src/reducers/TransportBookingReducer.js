import {
    GET_ALL_ORDER_TRANSPORT,
    UPDATE_ORDER_TRANSPORT,
    DETAIL_ORDER_TRANSPORT,
    HANDLE_CANCEL_ORDER_TRANSPORT
} from '../actions/types';


const INIT_STATE = {
    detail: {},
    list: [],
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
        case GET_ALL_ORDER_TRANSPORT: {
            return {
                ...state,
                list: action.payload.list,
                paging: action.payload.paging
            };
        }
        case UPDATE_ORDER_TRANSPORT: {
            let { id } = action.payload;
            let index = findIndex(state.list, id);
            let newlist = [...state.list];
            newlist[index] = action.payload;

            return {
                ...state,
                list: newlist,

            };
        }
        case DETAIL_ORDER_TRANSPORT: {
            return {
                ...state,
                detail: action.payload
            };
        }

        case HANDLE_CANCEL_ORDER_TRANSPORT: {
            let newlist = [...state.list];
            let index = newlist.findIndex(e => { return (e.id == action.payload.id) })
            if (index > -1)
                newlist[index] = { ...newlist[index], cancelled_completed: 1 };
            return {
                ...state,
                list: newlist
            };
        }

        default: return state;
    }
}