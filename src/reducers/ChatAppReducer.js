/**
 * Chat App Reducers
 */

// actions types
import {
    CHAT_WITH_SELECTED_USER,
    SEND_MESSAGE_TO_USER,
    UPDATE_USERS_SEARCH,
    SEARCH_USERS,
    GET_RECENT_CHAT_USERS,
    REPLY_CONVERSATION_CHAT,
    GET_ALL_MESSAGES_CHAT,
    GET_ALL_CONVERSATION_CHAT,
    GET_USER_CONVERSATION_CHAT,
    SET_READ_CONVERSATION_CHAT,
    GET_NEW_MESSAGE_CONVERSATION_CHAT
} from 'Actions/types';

const INITIAL_STATE = {
    selectedUser: null,
    newMessage: null,
    allConversationChat: {
        list: [],
        paging: {
            count: 0,
            totalpage: 1,
            perpage: 20,
            page: 1
        }
    },
    userConversationChat: {
        list: [],
        paging: {
            count: 0,
            totalpage: 1,
            perpage: 20,
            page: 1
        },
        count_unread: 0
    },
    allMessagesChat: {
        list: [],
        paging: {
            count: 0,
            totalpage: 1,
            perpage: 20,
            page: 1
        },
        attend: false
    },
    currSetReply: null,
    currSetRead: null
};

function findItem(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) return i;
    }
    return -1;
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {


        // chat with selected user
        case CHAT_WITH_SELECTED_USER:
            return { ...state, selectedUser: action.payload }

        // send message to user

        case GET_USER_CONVERSATION_CHAT: {
            return { ...state, userConversationChat: action.payload }
        }

        case GET_ALL_CONVERSATION_CHAT: {
            return { ...state, allConversationChat: action.payload }
        }

        case GET_ALL_MESSAGES_CHAT: {
            return { ...state, allMessagesChat: action.payload }
        }

        case REPLY_CONVERSATION_CHAT: {
            return { ...state, currSetReply: action.payload, allMessagesChat: { ...state.allMessagesChat, attend: true } }
        }

        case SET_READ_CONVERSATION_CHAT: {
            let { conversation_id } = action.payload;
            let indexA = findItem(state.allConversationChat.list, conversation_id);
            let indexU = findItem(state.userConversationChat.list, conversation_id);
            let newA = [...state.allConversationChat.list];
            if (indexA != -1) {

                newA[indexA] = { ...state.allConversationChat.list[indexA], unread: false }
            }
            let newU = [...state.userConversationChat.list];
            if (indexU != -1) {

                newU[indexU] = { ...state.userConversationChat.list[indexU], unread: false }
            }
            return {
                ...state,
                selectedUser: { ...state.selectedUser, unread: false },
                allConversationChat: { ...state.allConversationChat, list: newA },
                userConversationChat: { ...state.userConversationChat, list: newU, count_unread: state.userConversationChat.count_unread - 1 },
                currSetRead: action.payload,
            }
        }

        case GET_NEW_MESSAGE_CONVERSATION_CHAT: {
            let newM = action.payload;
            let newListM = [...state.allMessagesChat.list];
            newListM.push(newM);

            // let indexA = findItem(state.allConversationChat.list, newM.conversation_id);
            // let indexU = findItem(state.userConversationChat.list, newM.conversation_id);
            // let newA = [...state.allConversationChat.list];
            // if (indexA != -1) {

            //     newA[indexA] = {
            //         ...state.allConversationChat.list[indexA], last_message: {
            //             ...newM,
            //             firstname: newM.sender_firstname,
            //             lastname: newM.sender_lastname,
            //             avatar: newM.avatar_thumb
            //         }
            //     }
            // }
            // let newU = [...state.userConversationChat.list];
            // if (indexU != -1) {

            //     newU[indexU] = {
            //         ...state.userConversationChat.list[indexU], last_message: {
            //             ...newM,
            //             firstname: newM.sender_firstname,
            //             lastname: newM.sender_lastname,
            //             avatar: newM.avatar_thumb
            //         }
            //     }
            // }

            return {
                ...state,
                allMessagesChat: {
                    ...state.allMessagesChat,
                    list: newListM
                },
                // allConversationChat: { ...state.allConversationChat, list: newA },
                // userConversationChat: { ...state.userConversationChat, list: newU },
                newMessage: newM
            }

        }

        default: return { ...state };
    }
}
