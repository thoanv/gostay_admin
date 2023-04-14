import {
    GET_LIST_FILE_AND_FOLDER,
    CREATE_FOLDER,
    UPLOAD_FILE,
    UPLOAD_IMG,
    DELETE_FOLDER_FILE
} from 'Actions/types';

const INIT_STATE = {
    folders: [],
    docs: [],
    images: [],
    videos: [],
    currentfolder: ""
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_LIST_FILE_AND_FOLDER: {
            return { ...action.payload, currentfolder: action.currentfolder };
        }
        case CREATE_FOLDER: {
            return state;
        }
        case DELETE_FOLDER_FILE: {
            return state;
        }
        default: return state;
    }
}

