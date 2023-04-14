import axios from 'axios';

const unplashApi = axios.create({
   baseURL: 'https://api.unsplash.com/',
   timeout: 50000,
   headers: {
      'Content-Type': 'application/json',
      Accept: "application/json",
      Authorization: `Client-ID 1mJVIDjRyLEmNCUpH7ipI9Z2VqKkKEyp7d0dBcxFP10`
   }
})

export default unplashApi;