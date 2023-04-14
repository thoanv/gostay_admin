import {
  GET_CONVERSATION,
  GET_LIST_MESSAGES_CHAT,
  SEND_MESSAGES_CHAT,
  RELOAD_MESSAGE
} from "Actions/types";
import { GET_LIST_NEW_MESSAGES } from "../actions/types";

const INIT_STATE = {
  listConversation: [],
  listMessages: [],
  newMessage: [],
  messageSent: {},
  paging: {
    count: 0,
    totalPage: 1,
    perpage: 1,
    page: 1
  },
  messageReceived: null
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CONVERSATION: {
      return {
        ...state,
        listConversation: action.payload.list,
        count_unread: action.payload.count_unread
      };
    }

    case GET_LIST_MESSAGES_CHAT: {
      return {
        ...state,
        listMessages: action.payload.list
      };
    }

    case GET_LIST_NEW_MESSAGES: {
      return {
        ...state,
        newMessage: action.payload
      };
    }

    case SEND_MESSAGES_CHAT: {
      // console.log(state.listMessages);

      // state.listMessages.unshift(action.payload);
      let newMessage = [action.payload].concat(state.listMessages);
      return {
        ...state,
        listMessages: newMessage
      };
    }

    case RELOAD_MESSAGE: {
      return { ...state, messageReceived: action.payload }
    }

    default: return state;
  }
};
