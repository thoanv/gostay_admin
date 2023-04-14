import {
    GET_ALL_PROMOTION,
    CREATE_NEW_PROMOTION,
    UPDATE_PROMOTION,
    GET_PROMOTION_DETAIL,
    DELETE_PROMOTION,
    CREATE_NEW_PROMOTION_PRODUCT,
    GET_ALL_PROMOTION_PRODUCT,
    DELETE_PROMOTION_PRODUCT
} from 'Actions/types';

const INIT_STATE = {
    list: [],
    paging: {
        count: 0,
        totalPage: 1,
        perpage: 1,
        page: 1
    },
    detail: {},
    promotion_product: []
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
        case GET_ALL_PROMOTION: {
            return {
                ...state,
                ...action.payload
            };
        }

        case GET_PROMOTION_DETAIL: {
            return {
                ...state,
                detail: { ...action.payload }
            };
        }

        case GET_ALL_PROMOTION_PRODUCT: {
            return {
                ...state,
                promotion_product: action.payload
            }
        }

        case CREATE_NEW_PROMOTION: {
            let newlist = [...state.list]
            newlist.unshift(action.payload);
            return {
                ...state,
                list: newlist
            };
        }

        case CREATE_NEW_PROMOTION_PRODUCT: {
            let newlist = [...state.promotion_product]
            newlist.unshift(action.payload);
            return {
                ...state,
                promotion_product: newlist
            };
        }

        case UPDATE_PROMOTION: {
            var { id } = action.payload;
            var index = findIndex(state.list, id);
            const list = [...state.list];
            list[index] = action.payload;
            return {
                ...state,
                list: list
            };
        }

        case DELETE_PROMOTION: {
            let newList = state.list.filter(item => {
                return action.payload.id.indexOf(item.id) < 0;
            });
            return {
                ...state,
                list: newList,
            }
        }
        case DELETE_PROMOTION_PRODUCT: {
            let newList = state.promotion_product.filter(item => item.id != action.payload);
            return {
                ...state,
                promotion_product: newList,
            }
        }

        default: return state;
    }
}