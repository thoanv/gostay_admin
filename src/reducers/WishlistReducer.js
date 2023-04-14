import { data } from 'jquery';
import { GET_ALL_WISHLIST, GET_DETAIL_WISHLIST ,GET_WISHLIST_LOG} from '../actions/types'


const initState = {
    list: [],
    detailItem: null,
    listlog:{
        list: [],
        paging: {}
    },
    paging: {}
}

export default (state = initState, action) => {
    switch (action.type) {
        case GET_ALL_WISHLIST:
            return Object.assign({}, state, { list: action.payload.list, paging: action.payload.paging });
        case GET_DETAIL_WISHLIST:
            return Object.assign({}, state, { detailItem: action.payload })
            case GET_WISHLIST_LOG: {
                return {
                    ...state,
                    listlog:{
                        list: action.payload.list,
                        paging: action.payload.paging
                    }
              
                }
            }
        default:
            return state;
    }
}