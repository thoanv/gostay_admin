import {
    GET_ALL_ACCOUNT,
    ADD_A_ACCOUNT,
    UPDATE_ACCOUNT,
    DELETE_ACCOUNT,
    BATCH_DELETE,
    ACCOUNT_WISHLIST,
    GET_ALL_ACCOUNT_WITHOUT_PAGINATE,
    GET_DETAIL_ACCOUNT,
    UPDATE_ROLE_USER

} from 'Actions/types';;
const INIT_STATE = {
    detailAccount:{},
    listAccount: [],
    wishlist:[],
    listAccountPaging: [],
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
        case GET_ALL_ACCOUNT: {
            let newList = [...action.payload.list];
            return {
                ...state,
                listAccount: newList,
                paging: action.payload.paging
            };
        }
        case ACCOUNT_WISHLIST: {
            let newList = [...action.payload.list];
            return {
                ...state,
                wishlist: newList,
            };
        }

        case GET_ALL_ACCOUNT_WITHOUT_PAGINATE: {
            return {
                ...state,
                listAccountPaging: action.payload.list,
                paging: 0
            }
          }

        case ADD_A_ACCOUNT: {
            state.listAccount.unshift(action.payload);
            return { ...state };
        }
        case UPDATE_ACCOUNT: {
            let { id } = action.payload;
            let index = findIndex(state.listAccount, id);
            const list = [...state.listAccount];
            list[index] = action.payload;

            return {
                ...state,
                listAccount: list
            };
        }
        case UPDATE_ROLE_USER: {
            let { id } = action.payload;
            let index = findIndex(state.listAccount, id);
            const list = [...state.listAccount];
            list[index] = action.payload;

            return {
                ...state,
                listAccount: list
            };
        }
        case DELETE_ACCOUNT: {
            let newList = state.listAccount.filter(account => {
                return action.payload.indexOf(account.id) < 0;
            });
            let newPaging = { ...state.paging };
            newPaging.count = state.paging.count - action.payload.length;

            return {
                ...state,
                listAccount: newList,
                paging: newPaging
            };
        }
        case GET_DETAIL_ACCOUNT: {
            return {
                ...state,
                detailAccount: action.payload
            };
        }
        default: return state;
    }
}