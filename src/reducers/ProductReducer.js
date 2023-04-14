/**
 * Auth User Reducers
 */
import {
    
} from 'Actions/types';
import { CHECK_TOKEN_SUCCESS, LIST_PRODUCT, LIST_PRODUCT_ERROR, LIST_PRODUCT_SUCCESS } from '../actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    isLoading:false,
    isSuccess:false,
    isError:false,
    message:"",
    data:[]
};

var listProduct = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_PRODUCT:
            return { ...state, isLoading: true };
        case LIST_PRODUCT_SUCCESS:
            return { ...state, isLoading: false, isSuccess:true, data: action.payload, message:action.message  };
        case LIST_PRODUCT_ERROR:
            return { ...state, isLoading: false, isSuccess:false, isError:true, data: action.payload, message:action.message };
        default: return state
    }
}
export {
    listProduct
}