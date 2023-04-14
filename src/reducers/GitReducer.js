import {
    GET_ALL_GIT,
    ADD_A_GIT,
    UPDATE_GIT,
    DELETE_GIT
  } from "Actions/types";
  
  const INIT_STATE = {
    listGit: [],
    paging: {
      count: 0,
      totalPage: 1,
      perpage: 1,
      page: 1
    }
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
      case GET_ALL_GIT: {
        console.log("all", action.payload);
        return {
          ...state,
          listGit: action.payload.list,
          paging: {
            ...action.payload.paging,
            page: +(action.payload.paging.page),
            perpage: +(action.payload.paging.perpage)
          }
        };
      }
  
      case UPDATE_GIT: {
        console.log("action", action.payload);
        let { id } = action.payload;
        let index = findIndex(state.listGit, id);
        let list = [...state.listGit];
        list[index] = action.payload;
        return {
          ...state,
          listGit: list
        };
      }
  
      case DELETE_GIT: {
        let newList = state.listGit.filter(account => {
          return action.payload.indexOf(account.id) < 0;
        });
        let newPaging = { ...state.paging };
        newPaging.count = state.paging.count - 1;
  
        return {
          ...state,
          listGit: newList,
          paging: newPaging
        };
      }
  
      case ADD_A_GIT: {
        state.listGit.push(action.payload);
        let newList = [...state.listGit];
        return {
          ...state,
          listGit: newList
        };
      }
  
      default:
        return state;
    }
  };
  