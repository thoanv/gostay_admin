import {
  GET_LIST_ORDER_STAY,
  GET_ALL_ORDER_COMBO,
  GET_ALL_ORDER_VOUCHER,
  GET_DETAIL_ORDER_COMBO,
  ADD_ORDER_COMBO,
  UPDATE_PASSENGER,
  DELETE_ORDER_COMBO,
  UPDATE_ORDER_COMBO,
  UPDATE_ORDER_VOUCHER,
  DELETE_ORDER_VOUCHER,

} from "Actions/types";
import { INQUIRY_LIST_ASSIGN, HANDLE_CANCEL_ORDER_STAY } from "../actions/types";

const INIT_STATE = {
  listOrderCombo: [],
  listOrderStay: [],
  listPassenger: [],
  currentOrderCombo: {
    passenger: [],
  },
  orderDetail: null,
  listOrderVoucher: [],
  listAssign: [],
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
    case GET_ALL_ORDER_COMBO: {
      return {
        ...state,
        listOrderCombo: action.payload.list,
        paging: action.payload.paging,
      };
    }

    case GET_DETAIL_ORDER_COMBO: {
      return {
        ...state,
        currentOrderCombo: action.payload,
        orderDetail: action.payload,
      };
    }

    default:
      return state;
  }
};
