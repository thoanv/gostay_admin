import {
  CHANGE_STATUS,
  PUBLISH_STATUSES,
  UNPUBLISH_STATUSES,
  CONSUMER,
  GET_PAYMENT_ACTION,
} from "./types";
import api from "../api";
import qs from 'qs';

export const changeStatus = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .post("/common/status", data)
      .then((res) => {
        console.log(res.data);
        dispatch({ type: CHANGE_STATUS, payload: res.data.data });
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const publish = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .post("/common/publish", data)
      .then((res) => {
        dispatch({ type: PUBLISH_STATUSES, payload: res.data.data });
        resolve(true);
      })
      .catch((err) => {
        console.log(err.response);

        reject(err);
      });
  });
};

export const unpublish = (data) => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .post("/common/unpublish", data)
      .then((res) => {
        dispatch({ type: UNPUBLISH_STATUSES, payload: res.data.data });
        resolve(true);
      })
      .catch((err) => {
        console.log(err.response);
        reject(err);
      });
  });
};

export const getconsumer = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/dashboard/")
      .then((res) => {
        dispatch({ type: CONSUMER, payload: res.data.data });
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getPaymentAction = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    return api
      .get("/dashboard/payment_action")
      .then((res) => {
        // console.log(res.data);
        dispatch({ type: GET_PAYMENT_ACTION, payload: res.data.data });
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const reSendMail = (data) => {
  return new Promise((resolve, reject) => {
    return api
      .post("/orders/reSendMail", data)
      .then((res) => {
        console.log(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
        console.log(err);
        console.log(err.response);

      });
  });
};

export const getNewOrder = () => {
  return new Promise((resolve, reject) => {
    return api
      .get("/dashboard/getNewOrder")
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getNewRoom = () => {
  return new Promise((resolve, reject) => {
    return api
      .get("/dashboard/getNewRoom")
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getNewCustomer = () => {
  const filter = {
    paging: {
      perpage: 10,
      page: 1
    }
  };
  return new Promise((resolve, reject) => {
    return api
      .get("/customer/list/registered", {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

