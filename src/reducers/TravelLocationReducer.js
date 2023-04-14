import {
    GET_ALL_TRAVEL_LOCATION,
    ADD_A_TRAVEL_LOCATION, DELETE_A_TRAVEL_LOCATION
} from 'Actions/types';

const INIT_STATE = {
    listTravelLocation: [],
    listTravelLocationParent: [],
    paging: {
        count: 0,
        totalPage: 1,
        perpage: 1,
        page: 1
    },
    types: []
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
        case GET_ALL_TRAVEL_LOCATION: {
            return {
                ...state,
                listTravelLocation: action.payload
            };
        }

        case ADD_A_TRAVEL_LOCATION: {
            state.listTravelLocation.unshift(action.payload);
            return { ...state };
        }


        case DELETE_A_TRAVEL_LOCATION: {
            const idxDelete = findIndex(state.listTravelLocation, action.payload);
            state.list.splice(idxDelete,1)
            return {
                ...state,
                listTravelLocation: [...state.list]
            }
        }

        default: return state;
    }
}