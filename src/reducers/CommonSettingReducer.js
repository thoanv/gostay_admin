import {
    GET_COMMON_APP_SETTING,
    SET_COMMON_APP_SETTING,
    RESET_COMMON_APP_SETTING,
} from 'Actions/types';

const INIT_STATE = {}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_COMMON_APP_SETTING: {
            return action.payload;
        }
        case SET_COMMON_APP_SETTING: {
            return action.payload;
        }
        case RESET_COMMON_APP_SETTING: {
            return {...state}
        }
        default: {
            return {...state}
        }
    }
}