import {
  LIST_REVIEW,
    ADD_REVIEW,
    UPDATE_REVIEW,
    DELETE_REVIEW,
    UPDATE_STATUS_REVIEW
} from 'Actions/types';

const INIT_STATE = {
  listReview: [],
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
      case LIST_REVIEW: {
          return {
              ...state,
              listReview: action.payload.list,
              paging: action.payload.paging
          };
      }

      case UPDATE_REVIEW: {
        let { id } = action.payload;
    
        let index = findIndex(state.listReview, id);  
        let newLists = [...state.listReview];
        newLists[index] = action.payload;
        
        return {
            ...state,
            listReview: newLists,
        };
      }
      case DELETE_REVIEW: {
          let newList = state.listReview.filter(account => {
              return action.payload.indexOf(account.id) < 0; 
          });
          let newPaging = {...state.paging};
          newPaging.count = state.paging.count - 1;
    
          return { 
              ...state, 
              listReview: newList,
              paging: newPaging
          };
      }

      case ADD_REVIEW: {
          // console.log("add", action.payload)
          let newList = [...state.listReview];
          newList.unshift(action.payload)
          return { 
            ...state,
            listReview: newList
        };
      }

      default: return state;
  }
}