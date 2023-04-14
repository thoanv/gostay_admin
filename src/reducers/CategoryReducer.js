import {
    GET_ALL_CATEGORY,
    ADD_A_CATEGORIES,
    UPDATE_CATEGORIES,
    DELETE_CATEGORY,
    BATCH_DELETE,
    UPADATE_PARENT,
    GET_ALL_PARENT,
    GET_ALL_PARENT_WITHOUT_PAGINATE
} from 'Actions/types';

const INIT_STATE = {
    listCategory: [],
    listParent: [],
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
        case GET_ALL_CATEGORY: {
            // console.log(action.payload);
            return {
                ...state,
                listCategory: action.payload.list,
                paging: action.payload.paging
            };
        }

        case GET_ALL_PARENT_WITHOUT_PAGINATE: {
            // let newListParent = state.listCategory.filter(item => {
            //     return item.payload
            // });
            if(action.payload.list.length) {
              return {
                  ...state,
                  listCategory: [...state.listCategory, ...action.payload.list],
              }
            } else {
                return {...state}
            }
          }

        case GET_ALL_PARENT: {
            return {
                ...state,
                listParent: action.payload.list,
                // listCategory: [...state.listCategory, ...action.payload.list],

            };
        }

        case UPDATE_CATEGORIES: {
            console.log('action',action.payload);
            
            var { id } = action.payload;


            var index = findIndex(state.listCategory, id);
            var list = [...state.listCategory];
            list[index] = action.payload;

            return {
                ...state,
                listCategory: list
            };


        }

        case UPADATE_PARENT: {
            return {...state}
        }

        case DELETE_CATEGORY: {
            let newList = state.listCategory.filter(account => {
                return action.payload.indexOf(account.id) < 0; 
            });
            let newPaging = {...state.paging};
            newPaging.count = state.paging.count - 1;
      
            return { 
                ...state, 
                listCategory: newList,
                paging: newPaging
            };
        }


        case ADD_A_CATEGORIES: {
            state.listCategory.push(action.payload);
            let newList = [...state.listCategory];
            return { 
                ...state,
                listCategory: newList
            };
        }

        default: return state;
    }
}