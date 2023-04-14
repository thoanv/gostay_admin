import {
    GET_ALL_HOLIDAYS,
    GET_ALL_HOLIDAY_EXCHANGES
} from 'Actions/types';

const INIT_STATE = {
    holidays: [],
    paging: {
        count: 0,
        totalPage: 1,
        perpage: 1,
        page: 1
    },
    exchanges: [],
    exchangePaging: {
        count: 0,
        totalPage: 1,
        perpage: 1,
        page: 1
    }
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_ALL_HOLIDAYS: {
            return {
                ...state,
                holidays: action.payload.list,
                paging: action.payload.paging
            };
        }
        case GET_ALL_HOLIDAY_EXCHANGES: {
            return {
                ...state,
                exchanges: action.payload.list,
                exchangePaging: action.payload.paging
            };
        }
        default: return state;
    }
}