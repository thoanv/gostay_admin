import {
  GET_ALL_COMBO,
  UPDATE_COMBO,
  GET_COMBO_DETAIL,
  GET_ALL_COMBO_WITHOUT_PAGINATE,
} from "Actions/types";

const INIT_STATE = {
  listCombo: [],
  listProduct: [],
  listComboWithoutPaginate: [],
  currentCombo: {},
  paging: {
    count: 0,
    totalpage: 1,
    perpage: 1,
    page: 1,
  },
  listRates: [],
  departures: [],
};

function findIndex(arrID, id, combo) {
      if (arrID.length) {
      for (let i = 0; i < arrID.length; i++) {
        if (arrID[i].combo_id.toString() === id.toString()) return i;
      }
    }
  
  
  return -1;
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ALL_COMBO: {
      return {
        ...state,
        listCombo: action.payload.list,
        paging: action.payload.paging,
      };
    }

    case GET_ALL_COMBO_WITHOUT_PAGINATE: {
      if (action.payload.list.length) {
        return {
          ...state,
          listCombo: [...state.listCombo, ...action.payload.list],
        };
      } else {
        return { ...state };
      }
    }

    case UPDATE_COMBO: {
      let { id, combo } = action.payload;
      let index = findIndex(state.listCombo, id, true);
      
      

      if(combo) {
        let newLists = state.listCombo;
        newLists[index] = { ...newLists[index], status: action.payload.status};
        return {
          ...state,
          listCombo: newLists,
        };
      }

      let newLists = state.listCombo;
      newLists[index] = action.payload;
      return {
        ...state,
        listCombo: newLists,
      };
    }

    case GET_COMBO_DETAIL: {
      return { ...state, currentCombo: action.payload };
    }
    default:
      return state;
  }
};
