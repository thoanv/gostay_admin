import {
  GET_ALL_AIRLINES,
  ADD_A_AIRLINE,
  UPDATE_AIRLINE,
  DELETE_AIRLINE,
  UPDATE_STATUS_AIRLINE,
  CHANGE_STATUS,
  BATCH_DELETE,
  GET_ALL_AIRLINES_WITHOUT_PAGINATE,
} from '../actions/types';

const INIT_STATE = {
  listAirlines: [],
  paging: {
    count: 0,
    totalpage: 1,
    perpage: 1,
    page: 1
  }
};

var findIndex = (data, id) => {
  var result = -1;
  data.forEach((edata, index) => {
    if (edata.id === id) result = index;
  });
  return result;
};

export default (state = INIT_STATE, action) => {
  // console.log(action.payload);

  var id = '';
  var index = -1;
  // console.log('id: ', id, 'index: ', index);
  switch (action.type) {
    case GET_ALL_AIRLINES:
      return {
        ...state,
        listAirlines: action.payload.list,
        paging: action.payload.paging
      };
    
    case GET_ALL_AIRLINES_WITHOUT_PAGINATE: {
      if(action.payload.list.length) {
        return {
            ...state,
            listAirlines: [...state.listAirlines, ...action.payload.list],
        }
      } else {
          return {...state}
      }
    }

    case ADD_A_AIRLINE:
      let newList=[...state.listAirlines]
      newList.unshift(action.payload);
      return { ...state,listAirlines:newList };
      


    case UPDATE_AIRLINE:
      id = action.payload.id;
      index = findIndex(state.listAirlines, id);
      var lineAirline = state.listAirlines[index];
      lineAirline.title = action.payload.title;
      lineAirline.short_title = action.payload.short_title;
      lineAirline.signed = action.payload.signed;
      lineAirline.code = action.payload.code;
      lineAirline.logo = action.payload.logo;
      lineAirline.status = action.payload.status;
      lineAirline.image = action.payload.image;
      lineAirline.params = action.payload.params;
      return {
        ...state
      };

    case UPDATE_STATUS_AIRLINE:
        // id = action.payload.id;
        // index = findIndex(state.listAirlines, id);
        // var lineAirlineStatus = state.listAirlines[index];
        // console.log(action.payload);
        // lineAirlineStatus.status = action.payload.status;
        let index = findIndex(state.listAirlines, action.payload.id);
        let list = [...state.listAirlines];
        list[index] = action.payload;
        return {
          ...state,
          listAirlines: list
        }
      

    // case DELETE_AIRLINE:
    //   id = action.payload.id;
    //   index = findIndex(state.listAirlines, id);
    //   state.listAirlines = state.listAirlines.filter(
    //     listAirlines =>
    //       listAirlines.id.toString() !== action.payload.id.toString()
    //   );
    //   return {
    //     ...state
    //   };

    case DELETE_AIRLINE: {
      let newList = state.listAirlines.filter(account => {
          return action.payload.indexOf(account.id) < 0; 
      });
      let newPaging = {...state.paging};
      newPaging.count = state.paging.count - 1;

      return { 
          ...state, 
          listAirlines: newList,
          paging: newPaging
      };
    }

    default:
      return state;
  }
};
