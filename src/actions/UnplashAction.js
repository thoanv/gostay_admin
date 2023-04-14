import unplashApi from "../api/unplash";

export const searchPhotos = (filter) => {
    return new Promise((resolve, reject) => {
        unplashApi.get(`/search/photos`, { params: filter }).then(res => {
            resolve(res.data.results);
        }).catch(err => {
            reject(err)
            console.log(err);
        })
    })
}