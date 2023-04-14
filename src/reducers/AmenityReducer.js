import {
  GET_ALL_AMENITY,
  ADD_A_AMENITY,
  UPDATE_AMENITY,
  DELETE_AMENITY,
  GET_A_AMENITY,
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
    case GET_ALL_AMENITY: {
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

    case UPDATE_AMENITY: {
      let { id } = action.payload;
      let index = findIndex(state.listItem, id);
      let newList = [...state.listItem];
      newList[index] = action.payload;
      return {
        ...state,
        listItem: newList,
      };
    }

    case DELETE_AMENITY: {
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

    case ADD_A_AMENITY: {
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
