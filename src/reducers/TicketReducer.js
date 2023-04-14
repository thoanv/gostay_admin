import {
  GET_ALL_TICKET,
  ADD_A_TICKET,
  UPDATE_TICKET,
  DELETE_TICKET
} from "Actions/types";

const INIT_STATE = {
  listTicket: [],
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
    case GET_ALL_TICKET: {
      return {
        ...state,
        listTicket: action.payload.list,
        paging: action.payload.paging
      };
    }

    case UPDATE_TICKET: {
      console.log("action", action.payload);
      let { id } = action.payload;
      let index = findIndex(state.listTicket, id);
      let list = [...state.listTicket];
      list[index] = action.payload;
      return {
        ...state,
        listTicket: list
      };
    }

    case DELETE_TICKET: {
      let newList = state.listTicket.filter(account => {
        return action.payload.indexOf(account.id) < 0;
      });
      let newPaging = { ...state.paging };
      newPaging.count = state.paging.count - 1;

      return {
        ...state,
        listTicket: newList,
        paging: newPaging
      };
    }

    case ADD_A_TICKET: {
      state.listTicket.unshift(action.payload);
      let newList = [...state.listTicket];
      return {
        ...state,
        listTicket: newList
      };
    }

    default:
      return state;
  }
};
