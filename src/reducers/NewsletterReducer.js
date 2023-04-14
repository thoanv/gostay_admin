import {
    NEWSLETTER_LIST_CAMPAIGNS,
    NEWSLETTER_LIST_SEGMENTS,
    NEWSLETTER_LIST_MEMBERS_SEGMENT,
    NEWSLETTER_LIST_SUBSCRIBERS,
    NEWSLETTER_UPDATE_MEMBERS_SEGMENT,
    NEWSLETTER_LIST_TEMPLATES,
    NEWSLETTER_ADD_CAMPAIGN,
    NEWSLETTER_LIST_AUDIENCES,
    NEWSLETTER_LIST_MEMBERS
} from '../actions/types';

const INIT_STATE = {
    audiences: [],
    members: [],
    campaigns: [],
    segments: [],
    membersSegment: [],
    subscribers: [],
    templates: []
};

var findIndex = (data, id) => {
    var result = -1;
    data.forEach((edata, index) => {
        if (edata.id === id) result = index;
    });
    return result;
};

export default (state = INIT_STATE, action) => {

    switch (action.type) {
        case NEWSLETTER_LIST_AUDIENCES:
            return {
                ...state,
                audiences: action.payload.lists,
            };
        case NEWSLETTER_LIST_MEMBERS:
            return {
                ...state,
                members: action.payload.members,
            };
        case NEWSLETTER_LIST_CAMPAIGNS:
            return {
                ...state,
                campaigns: action.payload.campaigns,
            };
        case NEWSLETTER_LIST_SEGMENTS:
            return {
                ...state,
                segments: action.payload.segments
            }
        case NEWSLETTER_LIST_MEMBERS_SEGMENT:
            return {
                ...state,
                membersSegment: action.payload.members
            }
        case NEWSLETTER_LIST_SUBSCRIBERS:
            return {
                ...state,
                subscribers: action.payload.members
            }
        case NEWSLETTER_LIST_TEMPLATES:
            return {
                ...state,
                templates: action.payload.templates
            }
        // case NEWSLETTER_ADD_CAMPAIGN:
        //     let camps = state.campaigns;
        //     console.log('action', action)
        //     camps.push(action.payload)
        //     return {
        //         ...state,
        //         campaigns: camps
        //     }
        default:
            return state;
    }
};