import {
  GET_LIST_ORDER_STAY,
  GET_ALL_ORDER_TOUR,
  GET_ALL_ORDER_VOUCHER,
  GET_DETAIL_ORDER_TOUR,
  ADD_ORDER_TOUR,
  UPDATE_PASSENGER,
  DELETE_ORDER_TOUR,
  UPDATE_ORDER_TOUR,
  UPDATE_ORDER_VOUCHER,
  DELETE_ORDER_VOUCHER,

} from "Actions/types";
import { INQUIRY_LIST_ASSIGN, HANDLE_CANCEL_ORDER_STAY } from "../actions/types";

const INIT_STATE = {
  listOrderTour: [],
  listOrderStay: [],
  listPassenger: [],
  currentOrderTour: {
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
    case GET_ALL_ORDER_TOUR: {
      return {
        ...state,
        listOrderTour: action.payload.list,
        paging: action.payload.paging,
      };
    }

    case GET_LIST_ORDER_STAY: {
      return {
        ...state,
        listOrderStay: action.payload.list,
        paging: action.payload.paging,
      };
    }


    case GET_DETAIL_ORDER_TOUR: {
      return {
        ...state,
        currentOrderTour: action.payload,
        orderDetail: action.payload,
      };
    }

    case GET_ALL_ORDER_VOUCHER: {
      return {
        ...state,
        listOrderVoucher: action.payload,
      };
    }

    case UPDATE_ORDER_VOUCHER: {
      let { id } = action.payload;
      let index = findIndex(state.listOrderVoucher, id);
      let list = [...state.listOrderVoucher];
      list[index] = { ...list[index], ...action.payload };

      return {
        ...state,
        listOrderVoucher: list,
      };
    }

    case UPDATE_PASSENGER: {
      let orderTour = { ...state.currentOrderTour };
      let { id } = action.payload;
      let index = findIndex(orderTour.passenger, id);
      let list = [...orderTour.passenger];
      list[index] = action.payload;

      return {
        ...state,
        currentOrderTour: { ...orderTour, passenger: list },
      };
    }

    case DELETE_ORDER_TOUR: {
      let newList = state.listOrderTour.filter((account) => {
        return action.payload.indexOf(account.id) < 0;
      });
      let newPaging = { ...state.paging };
      newPaging.count = state.paging.count - 1;

      return {
        ...state,
        listOrderTour: newList,
        paging: newPaging,
      };
    }

    case DELETE_ORDER_VOUCHER: {
      let newList = state.listOrderVoucher.filter((account) => {
        return action.payload.indexOf(account.id) < 0;
      });
      // let newPaging = {...state.paging};
      // newPaging.count = state.paging.count - 1;

      return {
        ...state,
        listOrderVoucher: newList,
      };
    }

    case ADD_ORDER_TOUR: {
      state.listOrderTour.push(action.payload);
      let newList = [...state.listOrderTour];
      return {
        ...state,
        listOrderTour: newList,
      };
    }

    case UPDATE_ORDER_TOUR: {
      let { id } = action.payload;

      let index = findIndex(state.listOrderTour, id);
      let list = [...state.listOrderTour];
      list[index] = { ...list[index], ...action.payload };
      console.log('---list---', action.payload, index, list)
      return {
        ...state,
        listOrderTour: list,
      };
    }

    case INQUIRY_LIST_ASSIGN: {
      return {
        ...state,
        listAssign: action.payload.list,
      };
    }

    case HANDLE_CANCEL_ORDER_STAY: {
      let OrdersStay = state.listOrderStay;
      let index = OrdersStay.findIndex(e => { return (e.id == action.payload.id) })
      OrdersStay[index] = { ...OrdersStay[index], cancelled_completed: 1 };
      return {
        ...state,
        listOrderStay: OrdersStay
      };
    }

    default:
      return state;
  }
};
