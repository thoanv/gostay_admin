import {
    GET_ALL_RULES,
    ADD_A_RULES,
    UPDATE_RULES,
    DELETE_RULES,
} from 'Actions/types';

const INIT_STATE = {
    listRules: [],
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
        case GET_ALL_RULES: {
            return {
                ...state,
                listRules: action.payload.list,
                paging: action.payload.paging
            };
        }
        case UPDATE_RULES: {
            var { id } = action.payload;


            var index = findIndex(state.listRules, id);

            const list = [...state.listRules];
            list[index] = action.payload;

            return {
                ...state,
                listRules: list

            };


        }

        case DELETE_RULES: {
            let newList = state.listRules.filter(item => {
                return action.payload.indexOf(item.id) < 0;
            });
            let newPaging = { ...state.paging };
            newPaging.count = state.paging - action.payload.length;
            return {
                ...state,
                listRules: newList,
                paging: newPaging
            }
        }

        case ADD_A_RULES: {
            state.listRules.unshift(action.payload);
            return { ...state };
        }
        default: return state;
    }
}