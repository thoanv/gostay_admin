// import {} from 'Actions/types';
import qs from 'qs';
import { NotificationManager } from 'react-notifications';
import api from '../api';

export const sendToken = (data) => {
    api.post("/device_firebase", data).then(res => {
    })
        .catch(error => {
            console.log(error.response);
        })
}