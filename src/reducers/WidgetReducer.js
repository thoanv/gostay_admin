import {
    GET_ALL_WIDGETS,
    ADD_A_WIDGET,
    UPDATE_WIDGET,
    DELETE_WIDGET,
    GET_A_WIDGET
} from 'Actions/types';
import { NEW_PRODUCT_COMBO, NEW_PRODUCT_HOTEL, NEW_PRODUCT_TOUR, NEW_PRODUCT_VOUCHER, NEW_TRADE_MARK, NEW_BLOG } from '../actions/types';

const INIT_STATE = {
    widgets: [],
    currentWidget: {},
    paging: {
        count: 0,
        totalpage: 1,
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
        case GET_ALL_WIDGETS: {
            return {
                ...state,
                widgets: action.payload.list,
                paging: action.payload.paging
            }
        }
        case NEW_PRODUCT_COMBO: {
            const combo = action.payload.list.map(x => {
                return { id: x.combo_id, title: x.title }
            })
            return {
                ...state,
                combo,
            }
        }
        case NEW_PRODUCT_TOUR: {
            return {
                ...state,
                tour: action.payload.list.map(x => {
                    return { id: x.tour_id, title: x.title }
                })
            }
        }
        case NEW_PRODUCT_VOUCHER: {
            return {
                ...state,
                voucher: action.payload.list.map(x => {
                    return { id: x.id, title: x.order_number }
                })
            }
        }
        case NEW_PRODUCT_HOTEL: {
            return {
                ...state,
                hotel: action.payload.map(x => {
                    return { id: x.id, title: x.name }
                })
            }
        }
        case NEW_TRADE_MARK: {
            return {
                ...state,
                trademark: action.payload.map(x => {
                    return { id: x.id, title: x.name }
                })
            }
        }
        case NEW_BLOG: {
            return {
                ...state,
                blog: action.payload.map(x => {
                    return { id: x.slug, title: x.name_cate }
                })
            }
        }
        case ADD_A_WIDGET: {
            return {
                ...state,
                widgets: [action.payload, ...state.widgets],
            }
        }
        case GET_A_WIDGET: {
            return {
                ...state,
                currentWidget: action.payload,
            }
        }
        case UPDATE_WIDGET: {
            let { id } = action.payload;
    
            let index = findIndex(state.widgets, id);  
            let newLists = state.widgets;
            newLists[index] = action.payload;

            return {
                ...state,
                widgets: newLists
            }
        }
        case DELETE_WIDGET: {
            console.log(action.payload)
            let newList = state.widgets.filter(widget => {
                return action.payload.indexOf(widget.id) < 0; 
            });
            
            let newPaging = {...state.paging};
            newPaging.count = state.paging - 1;
      
            return { 
                ...state, 
                widgets: newList,
                paging: newPaging
            };
        }
        default: return state;
    }
}
