import {
    GET_ALL_ACTIVITY,
    ADD_A_ACTIVITY,
    UPDATE_ACTIVITY,
    DELETE_ACTIVITY,
} from 'Actions/types';

const INIT_STATE = {
    listActivity: [],
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
        case GET_ALL_ACTIVITY: {
            return {
                ...state,
                listActivity: action.payload.list,
                paging: action.payload.paging
            };
        }
        case UPDATE_ACTIVITY: {
            var { id } = action.payload;


            var index = findIndex(state.listActivity, id);

            const list = [...state.listActivity];
            list[index] = action.payload;

            return {
                ...state,
                listActivity: list

            };


        }

        case DELETE_ACTIVITY: {
            let newList = state.listActivity.filter(item => {
                return action.payload.indexOf(item.id) < 0;
            });
            let newPaging = { ...state.paging };
            newPaging.count = state.paging.count - action.payload.length;
            return {
                ...state,
                listActivity: newList,
                paging: newPaging
            }
        }

        case ADD_A_ACTIVITY: {
            state.listActivity.push(action.payload);
            return { ...state };
        }
        default: return state;
    }
}