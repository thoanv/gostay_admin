import {
    GET_ALL_GUIDE_CALENDAR,
    ADD_A_GUIDE_CALENDAR,
    UPDATE_GUIDE_CALENDAR,
    DELETE_GUIDE_CALENDAR,
    GET_CALENDAR_BY_ID
  } from "Actions/types";
import { COPY_RECORD } from "../actions/types";
  
  const INIT_STATE = {
    listGuideCalendar: [],
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
      case GET_ALL_GUIDE_CALENDAR: {
        return {
          ...state,
          listGuideCalendar: action.payload.list,
          paging: {
            ...action.payload.paging,
            page: parseInt(action.payload.paging.page),
            perpage: parseInt(action.payload.paging.perpage)
          }
        };
      }
  
      case UPDATE_GUIDE_CALENDAR: {
        let { id } = action.payload;
        let index = findIndex(state.listGuideCalendar, id);
        let list = [...state.listGuideCalendar];
        list[index] = action.payload;
        return {
          ...state,
          listGuideCalendar: list
        };
      }
  
      case DELETE_GUIDE_CALENDAR: {
        let newList = state.listGuideCalendar.filter(account => {
          return action.payload.indexOf(account.id) < 0;
        });
        let newPaging = { ...state.paging };
        newPaging.count = state.paging.count - 1;
  
        return {
          ...state,
          listGuideCalendar: newList,
          paging: newPaging
        };
      }
  
      case ADD_A_GUIDE_CALENDAR: {
        state.listGuideCalendar.unshift(action.payload);
        let newList = [...state.listGuideCalendar];
        return {
          ...state,
          listGuideCalendar: newList
        };
      }

      case COPY_RECORD: {
        return {
          ...state,
          listGuideCalendar: action.payload.list,
        };
      }

      case GET_CALENDAR_BY_ID: {
        return {
          ...state,
          listGuideCalendar: action.payload.list,
        }
      }
  
      default:
        return state;
    }
  };
  