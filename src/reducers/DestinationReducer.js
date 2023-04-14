import {
    GET_ALL_DESTINATION,
    ADD_A_DESTINATION,
    UPDATE_DESTINATION,
    DELETE_DESTINATION,
    BATCH_DELETE,
    GET_ALL_DESTINATION_PARENT,
    GET_ALL_DESTINATION_WITHOUT_PAGINATE,
    GET_ALL_DESTINATION_TYPES
} from 'Actions/types';

const INIT_STATE = {
    listDestination: [],
    listDestinationParent: [],
    paging: {
        count: 0,
        totalPage: 1,
        perpage: 1,
        page: 1
    },
    types: []
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
        case GET_ALL_DESTINATION: {
            return {
                ...state,
                listDestination: action.payload,
                paging: action.payload.paging
            };
        }

        case GET_ALL_DESTINATION_WITHOUT_PAGINATE: {
            if(action.payload.list.length) {
                return {
                    ...state,
                    listDestination: [...state.listDestination, ...action.payload.list],
                }
            } else {
                return {...state}
            }
        }

        case GET_ALL_DESTINATION_PARENT: {
            return {
                ...state,
                listDestinationParent: action.payload.list,
            };
        }

        case UPDATE_DESTINATION: {
            var { id } = action.payload;


            var index = findIndex(state.listDestination, id);

            const list = [...state.listDestination];
            list[index] = action.payload;

            return {
                ...state,
                listDestination: list

            };


        }

        case DELETE_DESTINATION: {
            let newList = state.listDestination.filter(item => {
                return action.payload.indexOf(item.id) < 0;
            });
            let newPaging = { ...state.paging };
            newPaging.count = state.paging.count - action.payload.length;
            return {
                ...state,
                listDestination: newList,
                paging: newPaging
            }
        }

        case ADD_A_DESTINATION: {
            state.listDestination.unshift(action.payload);
            return { ...state };
        }

        case GET_ALL_DESTINATION_TYPES: {
            return {
                ...state,
                types: action.payload
            }
        }
        default: return state;
    }
}