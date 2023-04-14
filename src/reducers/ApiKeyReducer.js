import {
    GET_ALL_API_KEYS,
    CREATE_NEW_API_KEY,
    DELETE_API_KEY
} from '../actions/types';

const INIT_STATE = {
    keys: [],
    paging: {
        count: 0,
        totalpage: 1,
        perpage: 1,
        page: 1
    }
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_ALL_API_KEYS: {
            return {
                ...state,
                keys: action.payload.list,
                paging: action.payload.paging
            };
        }

        case CREATE_NEW_API_KEY: {
            state.keys.push(action.payload);

            return { ...state };
        }

        case DELETE_API_KEY: {
            let newList = state.keys.filter(item => {
                return action.payload.indexOf(item.id) < 0;
            });
            let newPaging = { ...state.paging };
            newPaging.count = state.paging.count - 1;

            return {
                ...state,
                keys: newList,
                paging: newPaging
            };
        }

        default: return state;
    }
};
