import {
    LIST_ITINERARIES,
    ADD_ITINERARIES,
    UPDATE_ITINERARIES,
    DELETE_ITINERARIES,
    BATCH_DELETE,
} from 'Actions/types';

const INIT_STATE = {
    items: [],
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
        case LIST_ITINERARIES: {
            return {
                ...state,
                items: action.payload.list,
                paging: action.payload.paging
            };
        }

        case UPDATE_ITINERARIES: {
            let { id } = action.payload;

            let index = findIndex(state.items, id);
            let list = [...state.items];
            list[index] = action.payload;

            return {
                ...state,
                items: list
            };
        }

        // case UPADATE_PARENT: {
        //     return {...state}
        // }

        // case GET_ALL_PARENT: {
        //     return {
        //         ...state,
        //         currentParent: action.payload
        //     }
        // }

        case BATCH_DELETE: {
            let newList = state.items.filter(account => {
                return action.payload.indexOf(account.id) < 0; 
            });
            let newPaging = {...state.paging};
            newPaging.count = state.paging.count - 1;
      
            return { 
                ...state, 
                items: newList,
                paging: newPaging
            };
        }

        case DELETE_ITINERARIES: {
            state.items = state.items.filter(items => items.id.toString() !== action.payload.id.toString());
            return {
                ...state
            }
        }
        case ADD_ITINERARIES: {
            state.items.unshift(action.payload);
            let list = [...state.items];
            return { 
                ...state,
                items: list
             };
        }

        default: return state;
    }
}