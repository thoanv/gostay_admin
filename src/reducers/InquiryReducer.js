import {
    GET_ALL_INQUIRY,
    ADD_A_INQUIRY,
    UPDATE_INQUIRY,
    DELETE_INQUIRY,
} from 'Actions/types';

const INIT_STATE = {
    listInquiry: [],
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
        case GET_ALL_INQUIRY: {
            return {
                ...state,
                listInquiry: action.payload.list,
                paging: {
                    ...action.payload.paging,
                    page : parseInt(action.payload.paging.page),
                    perpage : parseInt(action.payload.paging.perpage),

                }
            };
        }

        case UPDATE_INQUIRY: {
            var { id } = action.payload;
            var index = findIndex(state.listInquiry, id);
            var list = [...state.listInquiry];
            list[index] = action.payload;

            return {
                ...state,
                listInquiry: list
            };


        }

        case DELETE_INQUIRY: {
            let newList = state.listInquiry.filter(account => {
                return action.payload.indexOf(account.id) < 0; 
            });
            let newPaging = {...state.paging};
            newPaging.count = state.paging.count - 1;
      
            return { 
                ...state, 
                listInquiry: newList,
                paging: newPaging
            };
        }


        case ADD_A_INQUIRY: {
            state.listInquiry.unshift(action.payload);
            let newList = [...state.listInquiry];
            return { 
                ...state,
                listInquiry: newList
            };
        }

        default: return state;
    }
}