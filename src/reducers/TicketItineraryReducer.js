import {
    LIST_TICKET_ITINERARIES,
    ADD_TICKET_ITINERARIES,
    UPDATE_TICKET_ITINERARIES,
    BATCH_DELETE,
} from 'Actions/types';

const INIT_STATE = {
    listdata: [],
 

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
        case LIST_TICKET_ITINERARIES: {
            return {
                ...state,
                listdata: action.payload,
             
            };
        }

        case UPDATE_TICKET_ITINERARIES: {
            let { id } = action.payload;

            let index = findIndex(state.listdata, id);
            let list = [...state.listdata];
            list[index] = action.payload;

            return {
                ...state,
                listdata: list
            };
        }

   

        case BATCH_DELETE: {
            let newList = state.listdata.filter(account => {
                return action.payload.indexOf(account.id) < 0; 
            });
           
           
      
            return { 
                ...state, 
                listdata: newList,
               
            };
        }
        case ADD_TICKET_ITINERARIES: {
            state.listdata.unshift(action.payload);
            let list = [...state.listdata];
            return { 
                ...state,
                listdata: list
             };
        }

        default: return state;
    }
}