import {
  GET_ALL_TOUR,
  ADD_A_TOUR,
  UPDATE_TOUR,
  UPDATE_DEPARTURE_IN_TOUR,
  DELETE_TOUR,
  GET_TOUR_DETAIL,
  GET_TOUR_RATES,
  ADD_TOUR_RATES,
  REMOVE_TOUR_RATE,
  GET_DEPARTURES_OF_TOUR,
  GET_ALL_TOUR_WITHOUT_PAGINATE,
  UPDATE_TOUR_AIRLINES,
} from "Actions/types";
import { GET_ALL_PRODUCT } from "../actions/types";

const INIT_STATE = {
  listTour: [],
  listProduct: [],
  listTourWithoutPaginate: [],
  currentTour: {},
  paging: {
    count: 0,
    totalpage: 1,
    perpage: 1,
    page: 1,
  },
  listRates: [],
  departures: [],
};

function findIndex(arrID, id, tour) {
  if(tour) {
    if (arrID.length) {
      for (let i = 0; i < arrID.length; i++) {
        if (arrID[i].tour_id.toString() === id.toString()) return i;
      }
    }
  } else {
      if (arrID.length) {
      for (let i = 0; i < arrID.length; i++) {
        if (arrID[i].id.toString() === id.toString()) return i;
      }
    }
  }
  
  return -1;
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ALL_TOUR: {
      return {
        ...state,
        listTour: action.payload.list,
        paging: action.payload.paging,
      };
    }

    case GET_ALL_PRODUCT: {
      return {
        ...state,
        listProduct: action.payload.list,
        paging: action.payload.paging,
      };
    }

    case GET_ALL_TOUR_WITHOUT_PAGINATE: {
      if (action.payload.list.length) {
        return {
          ...state,
          listTour: [...state.listTour, ...action.payload.list],
        };
      } else {
        return { ...state };
      }
    }

    case UPDATE_TOUR: {
      let { id, tour } = action.payload;
      let index = findIndex(state.listTour, id, true);
      
      

      if(tour) {
        let newLists = state.listTour;
        newLists[index] = { ...newLists[index], status: action.payload.status};
        return {
          ...state,
          listTour: newLists,
        };
      }

      let newLists = state.listTour;
      newLists[index] = action.payload;
      return {
        ...state,
        listTour: newLists,
      };
    }
    case UPDATE_DEPARTURE_IN_TOUR: {
      return { ...state };
    }

    case GET_TOUR_DETAIL: {
      return { ...state, currentTour: action.payload };
    }

    case DELETE_TOUR: {
      let newLists = state.listTour.filter(
        (listTour) => action.payload.id.indexOf(listTour.id) < 0
      );
      return {
        ...state,
        listTour: newLists,
      };
    }
    case ADD_A_TOUR: {
      let newLists = [action.payload, ...state.listTour];
      return { ...state, listTour: newLists };
    }
    case GET_TOUR_RATES: {
      return { ...state, listRates: action.payload };
    }
    case ADD_TOUR_RATES: {
      return { ...state };
    }
    case REMOVE_TOUR_RATE: {
      // let newListRates = state.listRates.filter(rate => rate.tour_options.id != action.payload);
      // return{
      //     ...state,
      //     listRates: newListRates
      // }
      return { ...state };
    }
    case GET_DEPARTURES_OF_TOUR: {
      return { ...state, departures: action.payload };
    }
    case UPDATE_TOUR_AIRLINES: {
      return { ...state, currentTour: action.payload.data };
    }
    default:
      return state;
  }
};
