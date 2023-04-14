/**
 * Auth User Reducers
 */
import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  LOGOUT_USER,
  CHECK_TOKEN_ERROR,
  GET_MY_PERMISSION
} from "Actions/types";
import { CHECK_TOKEN_SUCCESS } from "../actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: {
    usename: ""
  },
  permission: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, isLoading: true };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        data: action.payload,
        message: action.message
      };
    case LOGIN_USER_ERROR:
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        isError: true,
        data: action.payload,
        message: action.message
      };
    case LOGOUT_USER:
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        isError: false,
        data: null,
        message: action.message
      };
    case CHECK_TOKEN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        data: action.payload,
        message: action.message
      };
    case CHECK_TOKEN_ERROR:
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        isError: false,
        data: null,
        message: action.message
      };
    case GET_MY_PERMISSION: {
      return {
        ...state,
        permission: action.payload.permission_groups
      }
    }
    default:
      return { ...state, isSuccess: false };
  }
};
