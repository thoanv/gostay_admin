import {
    GET_ALL_ASSET,
    GET_ASSET_DETAIL,
    ADD_A_ASSET,
    UPDATE_ASSET,
    DELETE_ASSET,
} from 'Actions/types';
const INIT_STATE = {

    listAssets: [],
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
        case GET_ALL_ASSET: {
            return {
                ...state,
                listAssets: action.payload.list,
                paging: action.payload.paging
            };
        }
        case ADD_A_ASSET: {
            state.listAssets.unshift(action.payload)
            return {
                ...state
            }
        }
        case DELETE_ASSET: {
            let newList = state.listAssets.filter(item => {
                return action.payload.indexOf(item.id) < 0;
            });
            let newPaging = { ...state.paging };
            newPaging.count = state.paging.count - action.payload.length;

            return {
                ...state,
                listAssets: newList,
                paging: newPaging
            };
        }
        case UPDATE_ASSET: {
            var { id } = action.payload;
            var index = findIndex(state.listAssets, id);
            const list = [...state.listAssets];
            list[index] = action.payload;

            return {
                ...state,
                listAssets: list

            };


        }
        default: return state;
    }
}