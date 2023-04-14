import {
    NEWSLETTER_LIST_CAMPAIGNS,
    NEWSLETTER_LIST_MEMBERS_SEGMENT,
    NEWSLETTER_LIST_SEGMENTS,
    NEWSLETTER_LIST_SUBSCRIBERS,
    NEWSLETTER_UPDATE_MEMBERS_SEGMENT,
    NEWSLETTER_ADD_SEGMENT,
    NEWSLETTER_DELETE_SEGMENT,
    NEWSLETTER_LIST_TEMPLATES,
    NEWSLETTER_ADD_CAMPAIGN, NEWSLETTER_DELETE_CAMPAIGN,
    NEWSLETTER_LIST_AUDIENCES, NEWSLETTER_LIST_MEMBERS,
    NEWSLETTER_RESEND_CAMPAIGN
} from "./types";
import api from "../api";
import qs from "qs";
import { NotificationManager } from "react-notifications";

export const getListAudiences = (filter = {}, type) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get(`/newsletter/audiences/`, {})
            .then(res => {
                console.log(res, 'get audiences')
                resolve(res.data);
                dispatch({ type: NEWSLETTER_LIST_AUDIENCES, payload: res.data.data });
            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const getListMembers = () => dispatch => {
    return new Promise((resolve, reject) => {
        api.get(`/newsletter/subscribers/`, {})
            .then(res => {
                console.log(res, 'get members')
                dispatch({ type: NEWSLETTER_LIST_MEMBERS, payload: res.data.data });
                resolve(res.data);

            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const addListMembers = (emails) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post(`/newsletter/addSubcribers/`, {
            emails: emails
        })
            .then(res => {
                console.log(res, 'add members to list')
                // dispatch({ type: NEWSLETTER_LIST_MEMBERS, payload: res.data.data });
                NotificationManager.success('Success!');
                resolve(res.data);

            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const getListCampaigns = (filter = {}, type) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get(`/newsletter/campaigns/`, {})
            .then(res => {
                console.log(res)
                resolve(res.data);
                dispatch({ type: NEWSLETTER_LIST_CAMPAIGNS, payload: res.data.data });
            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const getListSegments = (filter = {}, type) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get(`/newsletter/segments/`, {})
            .then(res => {
                console.log(res)
                resolve(res.data);
                dispatch({ type: NEWSLETTER_LIST_SEGMENTS, payload: res.data.data });
            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const getListMembersSegment = (segmentId) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get(`/newsletter/segments/${segmentId}/members`, {})
            .then(res => {
                console.log(res, 'newsletter members segment');
                resolve(res.data);
                dispatch({ type: NEWSLETTER_LIST_MEMBERS_SEGMENT, payload: res.data.data });
            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const getListSubscribers = () => dispatch => {
    return new Promise((resolve, reject) => {
        api.get(`/newsletter/subscribers`, {})
            .then(res => {
                console.log(res, 'subscribers');
                dispatch({ type: NEWSLETTER_LIST_SUBSCRIBERS, payload: res.data.data });
                resolve(res.data);

            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const updateMembersSegment = (segmentId, name, emails) => dispatch => {
    return new Promise((resolve, reject) => {
        api.put(`/newsletter/segments/${segmentId}/members`, {
            emails: emails,
            name: name
        })
            .then(res => {
                console.log(res, 'update members segment');
                dispatch({ type: NEWSLETTER_UPDATE_MEMBERS_SEGMENT, payload: res.data.data });
                resolve(res.data);

            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const addSegment = (name, emails) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post(`/newsletter/segments`, {
            emails: emails,
            name: name
        })
            .then(res => {
                console.log(res, 'add segment');
                dispatch({ type: NEWSLETTER_ADD_SEGMENT, payload: res.data.data });
                resolve(res.data);
            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};
export const deleteSegment = (segmentId) => dispatch => {
    return new Promise((resolve, reject) => {
        api.delete(`/newsletter/segments/${segmentId}`, {})
            .then(res => {
                console.log(res, 'delete segment');
                dispatch({ type: NEWSLETTER_DELETE_SEGMENT, payload: res.data.data });
                resolve(res.data);
            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const getListTemplates = (segmentId) => dispatch => {
    return new Promise((resolve, reject) => {
        api.get(`/newsletter/templates`, {})
            .then(res => {
                console.log(res, 'get templates');
                dispatch({ type: NEWSLETTER_LIST_TEMPLATES, payload: res.data.data });
                resolve(res.data);
            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const addCampaign = (name, subject, template_id, segment_id) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post(`/newsletter/campaigns`, {
            subject: subject,
            name: name,
            segment_id: segment_id,
            template_id: template_id
        })
            .then(res => {
                if (res.data.data.status >= 400) {
                    reject(res);
                    NotificationManager.error(res.data.data.detail);
                }
                dispatch({ type: NEWSLETTER_ADD_CAMPAIGN, payload: res.data.data });
                NotificationManager.success('Add campaign success!');
                resolve(res.data);
            })
            .catch(error => {
                console.log('err', error);
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const deleteCampaign = (campaignId) => dispatch => {
    return new Promise((resolve, reject) => {
        api.delete(`/newsletter/campaigns/${campaignId}`, {})
            .then(res => {
                console.log('delete campaign', res)
                NotificationManager.success('Delete success!');
                dispatch({ type: NEWSLETTER_DELETE_CAMPAIGN, payload: res.data.data });
                resolve(res.data);
            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const sendCampaign = (campaignId) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post(`/newsletter/campaigns/${campaignId}/actions/send`, {})
            .then(res => {
                console.log('send campaign', res)
                if (res.data.data.status >= 400) {
                    reject(res);
                    NotificationManager.error(res.data.data.detail);
                }
                NotificationManager.success('Send success!');
                // dispatch({ type: NEWSLETTER_DELETE_CAMPAIGN, payload: res.data.data });
                resolve(res.data);
            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const scheduleCampaign = (campaignId, datetime) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post(`/newsletter/campaigns/${campaignId}/actions/schedule`, { datetime: datetime })
            .then(res => {
                console.log('schedule campaign', res)
                if (res.data.data.status >= 400) {
                    reject(res);
                    NotificationManager.error(res.data.data.detail);
                }
                else {
                    NotificationManager.success('Send success!');
                    // dispatch({ type: NEWSLETTER_DELETE_CAMPAIGN, payload: res.data.data });
                    resolve(res.data);
                }

            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};

export const resendCampaign = (campaignId) => dispatch => {
    return new Promise((resolve, reject) => {
        api.post(`/newsletter/campaigns/${campaignId}/actions/reduplicate`, {})
            .then(res => {
                console.log('resend campaign', res)
                if (res.data.data.status >= 400) {
                    reject(res);
                    NotificationManager.error(res.data.data.detail);
                }
                else {
                    NotificationManager.success('Send success!');
                    // dispatch({ type: NEWSLETTER_DELETE_CAMPAIGN, payload: res.data.data });
                    resolve(res.data);
                }

            })
            .catch(error => {
                reject(error);
                NotificationManager.error('Failed!');
            });
    });
};