import {
    GET_EARNING_OVERVIEW,
    GET_EARNING_DATA,
  } from "Actions/types"
  
  const INIT_STATE = {
    listOverview: {},
    list:[],
    paging: {
      count: 0,
      totalPage: 1,
      perpage: 1,
      page: 1,
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
      case GET_EARNING_OVERVIEW: {
       
        return {
          ...state,
          listOverview: action.payload,
        };
      }
  
      case GET_EARNING_DATA: {
        let newList = [...action.payload.list];
        return {
            ...state,
            list: newList,
            paging: action.payload.paging
        };
    }
  
  
      default:
        return state;
    }
  };
  