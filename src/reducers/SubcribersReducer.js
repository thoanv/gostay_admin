import {
    GET_ALL_SUBSCRIBERS,
    GET_ALL_SUBSCRIBERS_WITHOUT_PAGINATE
} from 'Actions/types';

const INIT_STATE = {
    listSubcribers: [],
    currentParent: {},
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
        case GET_ALL_SUBSCRIBERS: {
            return {
                ...state,
                listSubcribers: action.payload.list,
                paging: action.payload.paging
            };
        }

        case GET_ALL_SUBSCRIBERS_WITHOUT_PAGINATE: {
            if(action.payload.list.length) {
              return {
                  ...state,
                  listSubcribers: [...state.listSubcribers, ...action.payload.list],
              }
            } else {
                return {...state}
            }
          }

        default: return state;
    }
}