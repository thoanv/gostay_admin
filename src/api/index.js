import axios from 'axios';
import { setCookie, removeCookie, getCookie } from '../helpers/session';
import { NotificationManager } from 'react-notifications';
import config from '../../config';

const api = axios.create({
   baseURL: config.API_URL,
   timeout: 50000,
   headers: {
      'Content-Type': 'application/json',
      Accept: "application/json"
   }
})

api.interceptors.request.use(function (config) {
   // let accessToken = localStorage.getItem('token');
   let accessToken = getCookie('2stay_token');
   // 'Authorization': "Bearer " + accessToken
   // const session_id = getCookie('session_id');
   // Do something before request is sent
   console.log('---', accessToken)
   if (accessToken) {
      config.headers.common['Authorization'] = "Bearer " + accessToken
   }
   return config;
}, function (error) {
   // Do something with request error
   return Promise.reject(error);
});

api.interceptors.response.use(
   response => response,
   error => {
      // console.log(error);

      if (error && error.response && error.response.status === 401) {
         removeCookie('2stay_token')
         // localStorage.removeItem('token');
         setTimeout(() => {
            window.location.reload();
         }, 1000);
      }
      else if (error && error.response && error.response.status === 403) {
         window.location.href = "/app/403"
      }
      return Promise.reject(error);
   }
);

export default api;

// export default class RequestHelper {
//    static async getHeader(accessToken = null) {
//       accessToken = await localStorage.getItem('token')
//       return {
//          Accept: "application/json",
//          "Content-Type": "application/json",
//          'Authorization': "Bearer " + accessToken
//       };
//    }

//    static handleError = (error) => {

//       const { code, message, config, request, response, isAxiosError } = error;

//       if (isAxiosError) {
//          console.warn('Axios Error')
//       }
//       if(code !== 200){
//          return new Promise.reject(error);
//       }
//    };


//    static async get(url, params = {}) {
//       const header = await this.getHeader();
//       return instance
//          .get(url, {
//             headers: header,
//             params: params,
//             // paramsSerializer: params => {
//             //    return qs.stringify(params, { arrayFormat: "repeat" });
//             // }
//          })
//          .then(data => {
//             // console.log(data);
//             if(data.status_code !== 200){
//                this.handleError(data);
//             }
//             return data.data;
//          })
//          .catch(e => {
//             this.handleError(e);
//             throw e;
//          });
//    }

//    static async post(url, data) {
//       return instance({
//          method: "post",
//          url: url,
//          headers: await this.getHeader(),
//          data: data
//       })
//          .then(data => {
//             console.log(data)
//             if(data.status_code !== 200){

//                this.handleError(data);
//             }
//             return data.data;
//          })
//          .catch(e => {
//             this.handleError(e);
//             throw e;
//          });
//    }

//    static async put(apiUrl, data) {
//       return instance({
//          method: "put",
//          url: apiUrl,
//          headers: await this.getHeader(),
//          data: data
//       })
//          .then(data => {
//             return data.data;
//          })
//          .then(data => {
//             return this.preprocessResponse(data);
//          })
//          .catch(e => {
//             this.handleError(e);
//             throw e;
//          });
//    }

//    static async delete(apiUrl, data) {
//       return instance({
//          method: "delete",
//          url: apiUrl,
//          headers: await this.getHeader(),
//          data: data
//       })
//          .then(data => {
//             return data.data;
//          })
//          .then(data => {
//             return this.preprocessResponse(data);
//          })
//          .catch(e => {
//             this.handleError(e);
//             throw e;
//          });
//    }

//    static async postAndUploadImage(apiUrl, data) {
//       return instance({
//          method: "post",
//          url: apiUrl,
//          headers: await this.getHeaderUploadFile(),
//          data: data
//       })
//          .then(data => {
//             return data.data;
//          })
//          .then(data => {
//             return this.preprocessResponse(data);
//          })
//          .catch(e => {
//             this.handleError(e);
//             throw e;
//          });
//    }
//    static getHeaderUploadFile(){
//       throw new Error("Method not implemented.");
//    }
// }

