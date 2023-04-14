import {
    GET_ALL_CURRENCY,
    ADD_A_CURRENCY,
    UPDATE_CURRENCY,
    DELETE_CURRENCY,
    UPDATE_STATUS_CURRENCY,
  } from '../actions/types';
  
  const INIT_STATE = {
    listCurrency: [],
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
    // console.log(action.payload);
    switch (action.type) {
      case GET_ALL_CURRENCY:
        return {
          ...state,
          listCurrency: action.payload.list,
          paging: action.payload.paging
        };
  
      case ADD_A_CURRENCY:
        state.listCurrency.push(action.payload);
        console.log(state);
  
        return { ...state };
  
      case UPDATE_CURRENCY:
        
        let { id } = action.payload;


        let index = findIndex(state.listCurrency, id);
        let list = [...state.listCurrency];
        list[index] = action.payload;
        return {
          ...state,
            listCurrency: list
        };
  
      case UPDATE_STATUS_CURRENCY:
          let indexU = findIndex(state.listCurrency, action.payload.id);
          let listU = [...state.listCurrency];
          listU[indexU] = action.payload;
          return {
            ...state,
            listCurrency: listU
          }
  
      case DELETE_CURRENCY: {
        let newList = state.listCurrency.filter(account => {
            return action.payload.indexOf(account.id) < 0; 
        });
        let newPaging = {...state.paging};
        newPaging.count = state.paging.count - 1;
  
        return { 
            ...state, 
            listCurrency: newList,
            paging: newPaging
        };
      }
  
      default:
        return state;
    }
  };
  