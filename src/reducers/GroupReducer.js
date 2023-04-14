import {
    GET_ALL_GROUP,
    GET_LIST_ASSETS,
    GET_GROUP_DETAIL,
    ADD_A_GROUP,
    UPDATE_GROUP,
    DELETE_GROUP,
} from 'Actions/types';
const INIT_STATE = {
    listGroup: [],
    listAssets: [],



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
        case GET_ALL_GROUP: {
            return {
                ...state,
                listGroup: action.payload.list,
            };
        }
        case GET_LIST_ASSETS: {
            return {
                ...state,
                listAssets: action.payload.list,
            };
        }
        case ADD_A_GROUP: {
            state.listGroup.unshift(action.payload);
            return { ...state };
        }
        case DELETE_GROUP: {
            state.listGroup = state.listGroup.filter(listGroup => listGroup.id.toString() !== action.payload.id.toString());
            return { ...state };
        }
        case UPDATE_GROUP: {
            var { id } = action.payload;


            var index = findIndex(state.listGroup, id);
            const list = [...state.listGroup];
            list[index] = action.payload;
            // state.listGroup[index].title = action.payload.title;
            // state.listGroup[index].assets = action.payload.assets;
            // state.listGroup[index].updated_at = action.payload.updated_at;
            // console.log(state.listGroup);

            return {
                ...state,
                listGroup: list

            };


        }

        default: return state;
    }
}