import {
    GET_ALL_PAGES,
    ADD_A_PAGES,
    UPDATE_PAGES,
    DELETE_PAGES,
} from 'Actions/types';

const INIT_STATE = {
    listPages: [],
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
        case GET_ALL_PAGES: {
            return {
                ...state,
                listPages: action.payload.list,
                paging: action.payload.paging
            };
        }
        case UPDATE_PAGES: {
            var { id } = action.payload;


            var index = findIndex(state.listPages, id);

            const list = [...state.listPages];
            list[index] = action.payload;

            return {
                ...state,
                listPages: list

            };


        }

        case DELETE_PAGES: {
            let newList = state.listPages.filter(item => {
                return action.payload.indexOf(item.id) < 0;
            });
            let newPaging = { ...state.paging };
            newPaging.count = state.paging - action.payload.length;
            return {
                ...state,
                listPages: newList,
                paging: newPaging
            }
        }

        case ADD_A_PAGES: {
            let newList = [...state.listPages];
            newList.unshift(action.payload)
            return { 
              ...state,
              listPages: newList
          };
        }
        default: return state;
    }
}