import {
    GET_ALL_OFFICE,
    ADD_A_OFFICE,
    UPDATE_OFFICE,
    DELETE_OFFICE,
    GET_ALL_OFFICE_WITHOUT_PAGINATE,
} from 'Actions/types';

const INIT_STATE = {
    listOffice: [],
    currentParent: {},
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
        case GET_ALL_OFFICE: {
            // console.log(action.payload);
            return {
                ...state,
                listOffice: action.payload.list,
                paging: action.payload.paging
            };
        }

        case GET_ALL_OFFICE_WITHOUT_PAGINATE: {
            if(action.payload.list.length) {
                return {
                    ...state,
                    listOffice: [...state.listOffice, ...action.payload.list],
                }
            } else {
                return {...state}
            }
        }

        case UPDATE_OFFICE: {
            console.log('action',action.payload);
            var { id } = action.payload;
            var index = findIndex(state.listOffice, id);
            var list = [...state.listOffice];
            list[index] = action.payload;

            return {
                ...state,
                listOffice: list
            };


        }

        case DELETE_OFFICE: {
            let newList = state.listOffice.filter(account => {
                return action.payload.indexOf(account.id) < 0; 
            });
            let newPaging = {...state.paging};
            newPaging.count = state.paging.count - 1;
      
            return { 
                ...state, 
                listOffice: newList,
                paging: newPaging
            };
        }


        case ADD_A_OFFICE: {
            state.listOffice.push(action.payload);
            let newList = [...state.listOffice];
            return { 
                ...state,
                listOffice: newList
            };
        }

        default: return state;
    }
}