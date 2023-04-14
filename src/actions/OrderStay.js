import {
  GET_LIST_ORDER_STAY,
  GET_ALL_ORDER_VOUCHER,
  ADD_ORDER_TOUR,
  ADD_ORDER_VOUCHER,
  GET_DETAIL_ORDER_TOUR,
  UPDATE_PASSENGER,
  DELETE_ORDER_TOUR,
  UPDATE_ORDER_TOUR,
  UPDATE_ORDER_VOUCHER,
  DELETE_ORDER_VOUCHER,
  HANDLE_CANCEL_ORDER_STAY
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";
var FileSaver = require('file-saver');


export const getListOrder = (filter) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get("/orders/stay", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        resolve(res.data);
        dispatch({ type: GET_LIST_ORDER_STAY, payload: res.data.data });
      })
      .catch((error) => {
        reject(error);
        console.log(error.response)
      });
  });
};

export const getAllOrderVoucher = (id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/orders/voucher/list/${id}`, {
        params: {},
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        console.log(res.data);

        resolve(res.data);
        dispatch({ type: GET_ALL_ORDER_VOUCHER, payload: res.data.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getDetailOrderTour = (filter, id) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/orders/load/${id}`, {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        resolve(res.data);


        dispatch({ type: GET_DETAIL_ORDER_TOUR, payload: res.data.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createAOrderTour = (orders) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post("/orders/save", orders)
      .then((res) => {
        dispatch({ type: ADD_ORDER_TOUR, payload: res.data.data });
        NotificationManager.success("Success create");
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
        NotificationManager.error(error.response.data.message);
      });
  });
};

export const createOrderVoucher = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post("/orders/voucher/save", data)
      .then((res) => {
        dispatch({ type: ADD_ORDER_VOUCHER, payload: res.data.data });
        NotificationManager.success("Created!");
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
        NotificationManager.error("Failed!");
      });
  });
};

export const updateOrderVoucher = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/orders/voucher/update/${data.id}`, data)
      .then((res) => {
        dispatch({ type: UPDATE_ORDER_VOUCHER, payload: res.data.data });
        NotificationManager.success("Updated!");
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
        NotificationManager.error("Failed!");
      });
  });
};

export const updatePassenger = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/passenger/update/${data.id}`, data)
      .then((response) => {
        dispatch({ type: UPDATE_PASSENGER, payload: response.data.data });
        NotificationManager.success(response.data.message);
        resolve(response.data);
      })
      .catch((error) => {
        NotificationManager.error(error.response.data.message);
        reject(error.response.data);
      });
  });
};

export const batchDelete = (ids) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .delete("/orders/delete", { data: ids })
      .then((res) => {
        dispatch({ type: DELETE_ORDER_TOUR, payload: res.data.data });
        resolve(res.data);
        NotificationManager.success("Delete Success");
      })
      .catch((error) => {
        reject(error);
        NotificationManager.error(error);
      });
  });
};

export const updateOrderTour = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/orders/update/${data.id}`, data)
      .then((response) => {
        dispatch({ type: UPDATE_ORDER_TOUR, payload: response.data.data });
        NotificationManager.success(response.data.message);
        resolve(response.data);
      })
      .catch((error) => {
        NotificationManager.error(error.response.data.message);
        reject(error.response.data);
      });
  });
};

export const deleteVoucher = (ids) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .delete("/orders/voucher/delete", { data: ids })
      .then((res) => {
        dispatch({ type: DELETE_ORDER_VOUCHER, payload: res.data.data });
        resolve(res.data);
        NotificationManager.success("Deleted!");
      })
      .catch((error) => {
        reject(error);
        NotificationManager.error(error);
      });
  });
};

export const inquiryAssign = (filter) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .get("/inquiry/listAssign", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then((res) => {
        resolve(res.data);
        dispatch({ type: INQUIRY_LIST_ASSIGN, payload: res.data.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const handleCancel = (order_number, refundAmount) => (dispatch) => {
  return new Promise((resolve, reject) => {
    api
      .post("/orders/handleCancelBooking", {
        orderNumber: order_number,
        amount: refundAmount
      })
      .then((res) => {
        resolve(res.data);
        dispatch({ type: HANDLE_CANCEL_ORDER_STAY, payload: res.data.data });
        NotificationManager.success("Hoàn tiền cho đơn hàng thành công");
      })
      .catch((error) => {
        reject(error);
        NotificationManager.error("Đã có lỗi xảy ra. Vui lòng thử lại");
      });
  });
};

export const _exportOrder = (filter = {}) => {
  return new Promise((resolve, reject) => {
    api
      .get("/orders/exportExcelStay", {
        params: { ...filter },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
        responseType: 'blob'
      })
      .then((response) => {
        resolve(response);
        console.log(response)
        let time_stamp = new Date().getTime();
        // Log somewhat to show that the browser actually exposes the custom HTTP header
        const fileNameHeader = "Content-Disposition";
        const suggestedFileName = response.headers[fileNameHeader];
        const effectiveFileName = (suggestedFileName === undefined
          ? `danh_sach_don_hang_stay_${time_stamp}.xlsx`
          : suggestedFileName);
        console.log("Received header [" + fileNameHeader + "]: " + suggestedFileName + ", effective fileName: " + effectiveFileName);
        // Let the user save the file.
        FileSaver.saveAs(response.data, effectiveFileName);
      })
      .catch((error) => {
        console.log(error.response);
        reject(error);

      });
  });
};


export const detailBooking = (id) => {
  return new Promise((resolve, reject) => {
      return api.get(`/orders/stay/${id}`).then(response => {
          // console.log(response, 'response for detail booking')
          resolve(response.data.data)
      }).catch(error => {
          reject(error.response);
      })
  })
}

export const exportReceipt = (id) => {
  return new Promise((resolve, reject) => {
      return api.post(`/client/stay/exportReceipt`, { id: id }, {
          responseType: "blob"
      }).then(response => {
          let time_stamp = new Date().getTime();
          // Log somewhat to show that the browser actually exposes the custom HTTP header
          const fileNameHeader = "Content-Disposition";
          const suggestedFileName = response.headers[fileNameHeader];
          const effectiveFileName = (suggestedFileName === undefined
              ? `Booking_Receipt_${time_stamp}.pdf`
              : suggestedFileName);
          console.log("Received header [" + fileNameHeader + "]: " + suggestedFileName + ", effective fileName: " + effectiveFileName);
          // Let the user save the file.
          FileSaver.saveAs(response.data, effectiveFileName);
          // resolve(response.data.data)
      }).catch(error => {
          reject(error.response);
      })
  })
}

export const getPolicyCancel = (id) => {
  return new Promise((resolve, reject) => {
      return api.post(`/client/stay/checkPolicyCancel`, { order_id: id }).then(response => {
          console.log(response.data.data);
          resolve(response.data.data);
      }).catch(err => {
          console.log(err);
          reject(err);
      })
  });
}
