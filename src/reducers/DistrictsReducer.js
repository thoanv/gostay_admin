import {
    GET_ALL_DISTRICT
} from "Actions/types";
const INIT_STATE = {
   
    list: [],
  
};


export default (state = INIT_STATE, action) => {
   
    switch (action.type) {
        case GET_ALL_DISTRICT: {
            return {
                ...state,
                list: action.payload
              
            };
        }
        default: return state;
    }
}