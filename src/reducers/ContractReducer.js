import {
    GET_ALL_HOTEL,
    ADD_A_HOTEL,
    UPDATE_HOTEL,
    DELETE_HOTEL,
} from 'Actions/types';

const INIT_STATE = {
    listHotel: [],
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
        case GET_ALL_HOTEL: {
            return {
                ...state,
                listHotel: action.payload.list,
                paging: action.payload.paging
            };
        }
        case UPDATE_HOTEL: {
            var { id } = action.payload;


            var index = findIndex(state.listHotel, id);

            const list = [...state.listHotel];
            list[index] = action.payload;

            return {
                ...state,
                listHotel: list

            };


        }

        case DELETE_HOTEL: {
            let newList = state.listHotel.filter(item => {
                return action.payload.indexOf(item.id) < 0;
            });
            let newPaging = { ...state.paging };
            newPaging.count = state.paging - action.payload.length;
            return {
                ...state,
                listHotel: newList,
                paging: newPaging
            }
        }

        case ADD_A_HOTEL: {
            state.listHotel.push(action.payload);
            return { ...state };
        }
      
        default: return state;
    }
}