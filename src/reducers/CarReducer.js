import {
    GET_ALL_CAR,
    ADD_A_CAR,
    UPDATE_CAR,
    DELETE_CAR,
    GET_DETAIL_CAR
} from 'Actions/types'; 


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
        case GET_ALL_CAR: {
            let newList = [...action.payload.list];
            return {
                ...state,
                list: newList,
                paging: action.payload.paging
            };
        }


        case ADD_A_CAR: {
            state.list.unshift(action.payload);
            return { ...state };
        }
        case UPDATE_CAR: {
            let { id } = action.payload;
            let index = findIndex(state.list, id);
            let newlist = [...state.list];
            newlist[index] = action.payload;

            return {
                ...state,
                list: newlist
            };
        }
        case DELETE_CAR: {
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
        case GET_DETAIL_CAR: {
            return {
                ...state,
                detail: action.payload
            };
        }
        default: return state;
    }
}