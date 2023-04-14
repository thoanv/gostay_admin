import {
    GET_ALL_CUSTOMER,
    GET_CUSTOMER_DETAIL,
    ADD_A_CUSTOMER,
    UPDATE_A_CUSTOMER_IN_LIST,
    UPDATE_CUSTOMER,
    DELETE_A_CUSTOMER_IN_LIST,
    DELETE_CUSTOMER,
} from 'Actions/types';

const INIT_STATE = {
    listCustomer: [],
    paging: {
        count: 0,
        totalPage: 1,
        perpage: 1,
        page: 1
    },
    currentCustomer: {}
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
        case GET_ALL_CUSTOMER: {
            return {
                ...state,
                listCustomer: action.payload.list,
                paging: action.payload.paging
            };
        }
        case GET_CUSTOMER_DETAIL: {
            return {
                ...state,
                currentCustomer: action.payload.data
            };
        }
        case UPDATE_A_CUSTOMER_IN_LIST: {
            var { id } = action;
            var index = findIndex(state.listCustomer, id);
            const list = [...state.listCustomer];
            list[index] = action.payload;
            return { ...state, listCustomer: list }
        }
        case ADD_A_CUSTOMER: {
            state.listCustomer.unshift(action.payload);
            return { ...state };
        }

        default: return state;
    }
}