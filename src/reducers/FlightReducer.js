import {
  GET_ALL_FLIGHTS,
  ADD_A_FLIGHT,
  UPDATE_FLIGHT,
  DELETE_FLIGHT,
  UPDATE_STATUS_FLIGHT,
  CHANGE_STATUS,
  BATCH_DELETE,
  SEARCH_SABRE_FLIGHTS,
  FLIGHTS_BY_TOUR
} from '../actions/types';

const INIT_STATE = {
  listFlight: [],
  paging: {
    count: 0,
    totalpage: 1,
    perpage: 1,
    page: 1
  },
  sabreFlights: [],
  flightsByTour: {},
};

var findIndex = (data, id) => {
  var result = -1;
  data.forEach((edata, index) => {
    if (edata.id === id) result = index;
  });
  return result;
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ALL_FLIGHTS:
      return {
        ...state,
        listFlight: action.payload.list,
        paging: action.payload.paging
      };

    case ADD_A_FLIGHT:
      state.listFlight.push(action.payload);

      return { ...state };

    case UPDATE_FLIGHT:

      let { id } = action.payload;


      let index = findIndex(state.listFlight, id);
      let list = [...state.listFlight];
      list[index] = action.payload;

      return {
        ...state,
        listFlight: list

      };

    //   case UPDATE_STATUS_FLIGHT:
    //       let index = findIndex(state.listFlight, action.payload.id);
    //       let list = [...state.listFlight];
    //       list[index] = action.payload;
    //       return {
    //         ...state,
    //         listFlight: list
    //       }


    case DELETE_FLIGHT: {
      let newList = state.listFlight.filter(account => {
        return action.payload.indexOf(account.id) < 0;
      });
      let newPaging = { ...state.paging };
      newPaging.count = state.paging - 1;

      return {
        ...state,
        listFlight: newList,
        paging: newPaging
      };
    }

    case SEARCH_SABRE_FLIGHTS: {
      return {
        ...state,
        sabreFlights: action.payload
      };
    }

    case FLIGHTS_BY_TOUR: {

      return {
        ...state,
        flightsByTour: action.payload
      };
    }

    default:
      return state;
  }
};
