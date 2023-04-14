import {
  GET_ALL_CRUISES,
  ADD_CRUISE,
  UPDATE_CRUISE,
  DELETE_CRUISE,
} from "../actions/types";

const INIT_STATE = {
  listCruise: [],
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
    case GET_ALL_CRUISES: {
      console.log(action.payload);
      return {
        ...state,
        listCruise: action.payload.list,
        paging: {
          ...action.payload.paging,
          page: +action.payload.paging.page,
          perpage: +action.payload.paging.perpage,
        },
      };
    }

    default:
      return state;
  }
};
