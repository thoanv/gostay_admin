import api from "../api";
import qs from "qs";


export const getStatisticRevenue = (filter) => {

    return new Promise((resolve, reject) => {
        api
            .get(`/statistic/revenue`, {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                },
            })
            .then(res => {
                resolve(res.data.data);
                console.log(res.data.data);
            })
            .catch(error => {
                reject(error);
                console.log(error.response);
            });
    });
};

export const getStatisticOrder = (filter) => {

    return new Promise((resolve, reject) => {
        api
            .get(`/statistic/order`, {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                },
            })
            .then(res => {
                resolve(res.data.data);
            })
            .catch(error => {
                reject(error);
                console.log(error);
            });
    });
};

export const getStatisticOrderDetail = (filter) => {
    return new Promise((resolve, reject) => {
        api
            .get(`/statistic/orderStatisticDetail`, {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                },
            })
            .then(res => {
                resolve(res.data.data);
            })
            .catch(error => {
                reject(error);
                console.log(error);
            });
    });
};

export const getStatisticCustomer = (filter) => {

    return new Promise((resolve, reject) => {
        api
            .get(`/statistic/customer?start_date=${filter.start_date}&end_date=${filter.end_date}`)
            .then(res => {
                resolve(res.data.data);
            })
            .catch(error => {
                reject(error);
                console.log(error);
            });
    });
};

export const getStatisticGeneral = (filter) => {

    return new Promise((resolve, reject) => {
        api
            .get(`/statistic/general`)
            .then(res => {
                resolve(res.data.data);
            })
            .catch(error => {
                reject(error);
                console.log(error);
            });
    });
};

export const getStatisticCusomerOrder = (filter) => {

    return new Promise((resolve, reject) => {
        api
            .get(`/statistic/customerOrder`, {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                },
            })
            .then(res => {
                resolve(res.data.data);
            })
            .catch(error => {
                reject(error);
                console.log(error.response);
            });
    });
};

export const getRoomPerformance = (filter) => {

    return new Promise((resolve, reject) => {
        api
            .get(`/statistic/roomPerformance`, {
                params: { ...filter },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: "repeat" });
                },
            })
            .then(res => {
                resolve(res.data.data);
            })
            .catch(error => {
                reject(error);
                console.log(error.response);
            });
    });
};
