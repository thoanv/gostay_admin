import {
  CHANGE_STATUS,
  PUBLISH_STATUSES,
  UNPUBLISH_STATUSES,
  CONSUMER,
} from "Actions/types";
import { GET_PAYMENT_ACTION } from "../actions/types";

const INIT_STATE = {
  consumer: [],
  record_copied: [],
  paymentList: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_STATUS: {
      return { ...state };
    }
    case PUBLISH_STATUSES: {
      return { ...state };
    }
    case UNPUBLISH_STATUSES: {
      return { ...state };
    }
    case CONSUMER: {
      return { ...state, consumer: action.payload };
    }
    case GET_PAYMENT_ACTION: {
      return { ...state, paymentList: action.payload };
    }
    default:
      return state;
  }
};
