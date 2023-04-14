/**
 * Chat App Reducers
 */

// actions types
import {
    INBOX_WITH_SELECTED_USER,
    INBOX_MESSAGE_TO_USER,
    GET_ALL_MESSAGES_INBOX,
    SET_READ_CONVERSATION_INBOX,
    GET_NEW_MESSAGE_CONVERSATION_INBOX,
    REMOVE_CURRENT_INBOX,
    REMOVE_CONVERSATION_INLIST_INBOX,
    OPEN_INBOX,
    REPLY_INBOX_CHAT

} from 'Actions/types';


const INITIAL_STATE = {
    isOpen: false,
    selectedUser: null,
    newMessage: null,
    listConversation: [],
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

        case INBOX_WITH_SELECTED_USER:
            return { ...state, selectedUser: action.payload }


        case GET_ALL_MESSAGES_INBOX: {
            return { ...state, allMessagesChat: action.payload }
        }


        case SET_READ_CONVERSATION_INBOX: {
            let { conversation_id } = action.payload;
            let index = findItem(state.listConversation, conversation_id);
            if (index != -1) {
                let listConversation = state.listConversation;
                listConversation[index] = { ...listConversation[index], unread: false }
                return {
                    ...state,
                    listConversation: listConversation,
                    selectedUser: { ...state.selectedUser, unread: false }
                }
            }
            return state;
        }

        case GET_NEW_MESSAGE_CONVERSATION_INBOX: {
            let newM = action.payload;
            let listConversation = [...state.listConversation];
            let index = findItem(listConversation, newM.conversation_id);
            if (index != -1) {
                let newItem = { ...listConversation[index], unread: true }
                listConversation[index] = newItem
            }

            return {
                ...state,
                newMessage: newM,
                listConversation: listConversation,
                selectedUser: state.selectedUser ? state.selectedUser.id == newM.conversation_id ? { ...state.selectedUser, unread: true } : state.selectedUser : state.selectedUser
            }

        }

        case REMOVE_CURRENT_INBOX: {
            return {
                ...state,
                selectedUser: null,
                isOpen: false
            }
        }

        case REMOVE_CONVERSATION_INLIST_INBOX: {
            let item = action.payload;
            let listConversation = state.listConversation.filter(i => {
                return i.id != item.id
            })
            if (state.selectedUser) {
                if (item.id == state.selectedUser.id) {
                    return {
                        ...state,
                        selectedUser: null,
                        isOpen: false,
                        listConversation: listConversation
                    }
                }
                else return {
                    ...state,
                    listConversation: listConversation
                }
            }
            else return {
                ...state,
                selectedUser: null,
                isOpen: false,
                listConversation: listConversation
            }

        }

        case OPEN_INBOX: {
            let listConversation = [...state.listConversation];
            let newItem = action.payload;
            let index = findItem(listConversation, newItem.id);
            if (index == -1) listConversation.unshift(newItem)

            return {
                ...state,
                isOpen: true,
                listConversation: listConversation,
                selectedUser: newItem
            }
        }

        case REPLY_INBOX_CHAT: {
            return state;
        }

        default: return { ...state };
    }
}
