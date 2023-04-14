import {
    GET_ALL_EMAIL,
    ADD_A_EMAIL,
    UPDATE_EMAIL,
    DELETE_EMAIL,
    UPDATE_STATUS_EMAIL,
    GET_ALL_EMAIL_WITHOUT_PAGINATE
  } from '../actions/types';
  
  const INIT_STATE = {
    listEmail: [],
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
  
    var id = '';
    var index = -1;
    // console.log('id: ', id, 'index: ', index);
    switch (action.type) {
      case GET_ALL_EMAIL:
        return {
          ...state,
          listEmail: action.payload.list,
          paging: action.payload.paging
        };
      
      case GET_ALL_EMAIL_WITHOUT_PAGINATE: {
        if(action.payload.list.length) {
          return {
              ...state,
              listEmail: [...state.listEmail, ...action.payload.list],
          }
        } else {
            return {...state}
        }
      }
  
      case ADD_A_EMAIL:
        state.listEmail.push(action.payload);
        console.log(state);
  
        return { ...state };
  
      case UPDATE_EMAIL:
            let { id } = action.payload;
            let index = findIndex(state.listEmail, id);
            let list = [...state.listEmail];
            list[index] = action.payload;
        return {
          ...state,
          listEmail: list
        };
  
    //   case UPDATE_STATUS_EMAIL:
    //       let index = findIndex(state.listEmail, action.payload.id);
    //       let list = [...state.listEmail];
    //       list[index] = action.payload;
    //       return {
    //         ...state,
    //         listEmail: list
    //       }
  
      case DELETE_EMAIL: {
        let newList = state.listEmail.filter(account => {
            return action.payload.indexOf(account.id) < 0; 
        });
        let newPaging = {...state.paging};
        newPaging.count = state.paging.count - 1;
  
        return { 
            ...state, 
            listEmail: newList,
            paging: newPaging
        };
      }
  
      default:
        return state;
    }
  };
  