import {
  GET_ALL_CANCEL_POLICY,
  ADD_A_CANCEL_POLICY,
  UPDATE_CANCEL_POLICY,
  DELETE_CANCEL_POLICY,
  GET_A_CANCEL_POLICY,
} from "../actions/types";

const INIT_STATE = {
  listItem: [],
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
    case GET_ALL_CANCEL_POLICY: {
      console.log(action.payload);
      return {
        ...state,
        listItem: action.payload.list,
        paging: {
          ...action.payload.paging,
          page: +action.payload.paging.page,
          perpage: +action.payload.paging.perpage,
        },
      };
    }

    case UPDATE_CANCEL_POLICY: {
      let { id } = action.payload;
      let index = findIndex(state.listItem, id);
      let newList = [...state.listItem];
      newList[index] = action.payload;
      return {
        ...state,
        listItem: newList,
      };
    }

    case DELETE_CANCEL_POLICY: {
      let newList = state.listItem.filter((account) => {
        return action.payload.indexOf(account.id) < 0;
      });
      let newPaging = { ...state.paging };
      newPaging.count = state.paging.count - 1;

      return {
        ...state,
        listItem: newList,
        paging: newPaging,
      };
    }

    case ADD_A_CANCEL_POLICY: {
      state.listItem.unshift(action.payload);
      let newList = [...state.listItem];
      return {
        ...state,
        listItem: newList,
      };
    }

    default:
      return state;
  }
};
