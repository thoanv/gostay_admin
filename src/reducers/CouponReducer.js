import {
    GET_ALL_COUPON,
    ADD_A_COUPON,
    UPDATE_COUPON,
    DELETE_COUPON,
    GET_ALL_COUPON_WITHOUT_PAGINATE,
} from 'Actions/types';

const INIT_STATE = {
    listCoupon: [],
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
        case GET_ALL_COUPON: {
            return {
                ...state,
                listCoupon: action.payload.list,
                paging: {
                    ...action.payload.paging,
                    page : parseInt(action.payload.paging.page),
                    perpage : parseInt(action.payload.paging.perpage),

                }
            };
        }

        case GET_ALL_COUPON_WITHOUT_PAGINATE: {
            if(action.payload.list.length) {
                return {
                    ...state,
                    listCoupon: [...state.listCoupon, ...action.payload.list],
                }
            } else {
                return {...state}
            }
        }

        case UPDATE_COUPON: {
            console.log('action',action.payload);
            var { id } = action.payload;
            var index = findIndex(state.listCoupon, id);
            var list = [...state.listCoupon];
            list[index] = action.payload;

            return {
                ...state,
                listCoupon: list
            };


        }

        case DELETE_COUPON: {
            let newList = state.listCoupon.filter(account => {
                return action.payload.indexOf(account.id) < 0; 
            });
            let newPaging = {...state.paging};
            newPaging.count = state.paging.count - 1;
      
            return { 
                ...state, 
                listCoupon: newList,
                paging: newPaging
            };
        }


        case ADD_A_COUPON: {
            state.listCoupon.unshift(action.payload);
            let newList = [...state.listCoupon];
            return { 
                ...state,
                listCoupon: newList
            };
        }

        default: return state;
    }
}