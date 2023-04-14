import {
    GET_ALL_GROWHACKING_CAMPAIGNS,
    ADD_A_GROWHACKING_CAMPAIGN,
    UPDATE_GROWHACKING_CAMPAIGN,
    DELETE_GROWHACKING_CAMPAIGN,
    GET_A_GROWHACKING_CAMPAIGN
} from '../actions/types';

const INIT_STATE = {
    listCampaigns: [],
    campaign: {
        items: []
    },
    paging: {
        count: 0,
        totalpage: 1,
        perpage: 1,
        page: 1
    }
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
        case GET_ALL_GROWHACKING_CAMPAIGNS:
            return {
                ...state,
                listCampaigns: action.payload.list,
                paging: action.payload.paging
            };

        case ADD_A_GROWHACKING_CAMPAIGN:
            state.listCampaigns.push(action.payload);

            return { ...state };
        case GET_A_GROWHACKING_CAMPAIGN: {
            return {
                ...state,
                campaign: action.payload
            }
        }
        case UPDATE_GROWHACKING_CAMPAIGN:

            let { id } = action.payload;


            let index = findIndex(state.listCampaigns, id);
            let list = [...state.listCampaigns];
            list[index] = action.payload;
            return {
                ...state,
                listCampaigns: list
            };

        case DELETE_GROWHACKING_CAMPAIGN: {
            let newList = state.listCampaigns.filter(item => {
                return action.payload.indexOf(item.id) < 0;
            });
            let newPaging = { ...state.paging };
            newPaging.count = state.paging.count - 1;

            return {
                ...state,
                listCampaigns: newList,
                paging: newPaging
            };
        }

        default:
            return state;
    }
};
