import {
    GET_ALL_GROWTH_HACKING_RULES
} from '../actions/types';

const INIT_STATE = {
    rules: []
};

var findIndex = (data, id) => {
    var result = -1;
    data.forEach((edata, index) => {
        if (edata.id === id) result = index;
    });
    return result;
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_ALL_GROWTH_HACKING_RULES:
            return {
                ...state,
                rules: action.payload.list
            };

        default:
            return state;
    }
};
