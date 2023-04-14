import {
    GET_ALL_MESSAGES,
    ADD_MESSAGES,
    UPDATE_MESSAGES,
    DELETE_MESSAGES,
    SEND_MESSAGES,
    GET_ALL_MESSAGES_WITHOUT_PAGINATE
  } from '../actions/types';
  
  const INIT_STATE = {
    listMessages: [],
    paging: {
      count: 0,
      totalpage: 1,
      perpage: 1,
      page: 1
    }
  };
  
  var findIndex = (data, id) => {
    var result = -1;
    data.forEach((edata, index) => {
      if (edata.id === id) result = index;
    });
    return result;
  };
  
  export default (state = INIT_STATE, action) => {
  
    switch (action.type) {
      case GET_ALL_MESSAGES:
        return {
          ...state,
          listMessages: action.payload.list,
          paging: action.payload.paging
        };
      
      case GET_ALL_MESSAGES_WITHOUT_PAGINATE: {
        if(action.payload.list.length) {
          return {
              ...state,
              listMessages: [...state.listMessages, ...action.payload.list],
          }
        } else {
            return {...state}
        }
      }
  
      case ADD_MESSAGES:
        state.listMessages.push(action.payload);
        return { ...state };
  
      case UPDATE_MESSAGES:
        let { id } = action.payload;
        let index = findIndex(state.listMessages, id);
        var list = [...state.listMessages];
        list[index] = action.payload;

        return {
            ...state,
            listMessages: list
        };
  
      case SEND_MESSAGES: 
        // let { id_send } = action.payload;
        // let index_send = findIndex(state.listMessages, id);
        return {
          ...state
        }

      case DELETE_MESSAGES: {
        let newList = state.listMessages.filter(account => {
            return action.payload.indexOf(account.id) < 0; 
        });
        let newPaging = {...state.paging};
        newPaging.count = state.paging.count - 1;
  
        return { 
            ...state, 
            listMessages: newList,
            paging: newPaging
        };
      }
  
      default:
        return state;
    }
  };
  