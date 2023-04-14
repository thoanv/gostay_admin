import {
  REPORT_CUSTOMER_BY_TOUR,
  REPORT_FILTER_TOUR_DEPART,
  EXPORT_EXCEL_CUSTOMER,
} from "../actions/types";

const INIT_STATE = {
  listCustomerByTour: [],
  listTourDepartDate: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case REPORT_CUSTOMER_BY_TOUR: {
      return {
        ...state,
        listCustomerByTour: action.payload,
      };
    }

    case REPORT_FILTER_TOUR_DEPART: {
      return {
        ...state,
        listTourDepartDate: action.payload,
      };
    }

    default:
      return state;
  }
};
