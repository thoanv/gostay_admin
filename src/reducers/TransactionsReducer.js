import {
    GET_TRANSACTION,
    GET_TRANSACTION_DETAIL,
    TRANSACTION_APPROVE
} from "Actions/types"


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
        case GET_TRANSACTION: {
            let newList = [...action.payload.list];
            return {
                ...state,
                list: newList,
                paging: action.payload.paging
            };
        }
       
        case GET_TRANSACTION_DETAIL: {
            return {
                ...state,
                detail: action.payload
            };
        }
        case TRANSACTION_APPROVE: {
            let { id } = action.payload;
            let index = findIndex(state.list, id);
            let newlist = [...state.list];
            newlist[index] = action.payload;

            return {
                ...state,
                list: newlist
            };
        }
        default: return state;
    }
}