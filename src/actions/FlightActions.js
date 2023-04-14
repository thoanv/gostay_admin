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
} from './types';
import api from '../api';
import axios from 'axios';
import qs from 'qs';
import { NotificationManager } from 'react-notifications';


export const getAllFlight = (filter = {}) => dispatch => {
  console.log('filter', filter);

  return new Promise((resolve, reject) => {
    api
      .get('/flight/list', {
        params: { ...filter },
        paramsSerializer: params => {
          return qs.stringify(params, { encodeValuesOnly: true });
          // return qs.stringify(params, { arrayFormat: "repeat" });
        }
      })
      .then(res => {
        resolve(res.data);
        console.log(res);
        // return;

        dispatch({ type: GET_ALL_FLIGHTS, payload: res.data.data });
        // console.log('action: ', res.data.data);
      })
      .catch(error => {
        reject(error);
        console.log(error)
        // NotificationManager.error(error.response.data.message);
      });
  });
};

export const createFlight = data => dispatch => {
  console.log('------', data);
  return new Promise((resolve, reject) => {
    api
      .post('/flight/save', data)
      .then(res => {
        dispatch({ type: ADD_A_FLIGHT, payload: res.data.data });
        NotificationManager.success('Create success');
        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        NotificationManager.error('Can\'t create item');
      });
  });
};

export const updateFlight = data => dispatch => {
  return new Promise((resolve, reject) => {
    api
      .post(`/flight/update/${data.id}`, data)
      .then(res => {
        dispatch({ type: UPDATE_FLIGHT, payload: res.data.data });
        NotificationManager.success('Update success');
        resolve(res.data);
      })
      .catch(error => {
        reject(error.response.data);
        // NotificationManager.error(error.response.data.message);
        NotificationManager.error('Can\'t update');
        // console.log(error);
      });
  });
};

export const updateFlightStatus = (data) => dispatch => {

  return new Promise((resolve, reject) => {
    api
      .post('/common/status', data)
      .then(res => {
        dispatch({ type: UPDATE_STATUS_FLIGHT, payload: res.data.data });
        // NotificationManager.success('Update status success');
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
        // NotificationManager.error('Can\'t status update');
      })
  })
}


export const batchDelete = (ids) => dispatch => {
  // console.log('ids',this);

  return new Promise((resolve, reject) => {
    api.delete('/flight/delete', {data:ids}).then(res => {
      dispatch({ type: DELETE_FLIGHT, payload: res.data.data });
      NotificationManager.success('Deleted success');
      resolve(res.data);
    }).catch(error => {
      console.log(error);

      NotificationManager.error('Can\'t delete');
      reject(error);
    })
  })
}

export const searchSabreFlights = (query) => dispatch => {
  return new Promise((resolve, reject) => {
    axios.get('https://app.gopanda.asia/sabre', {params: { ...query }}).then(res => {
      dispatch({ type: SEARCH_SABRE_FLIGHTS, payload: res.data });
      resolve(res.data);
    }).catch(error => {
      console.log(error);
      reject(error);
    })
  })
}

export const getFlightsByTour = (tour_id) => dispatch => {
  return new Promise((resolve, reject) => {
    return api.get(`/flight/tour?tour_id=${tour_id}`).then(res => {
      console.log(res.data);
      dispatch({ type: FLIGHTS_BY_TOUR, payload: res.data.data });
      resolve(res.data.data)
    }).catch(err => {
      reject(err);
    })
  });
}