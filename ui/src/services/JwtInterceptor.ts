import axios from 'axios';

// axios instance for making requests 
const http = axios.create();

// request interceptor for adding token
http.interceptors.request.use((config) => {
  // add token to request headers
  // console.log("Inside JWT Interceptor", config)
  config.headers.Authorization = sessionStorage.getItem('jwtToken');
  return config;
});

export default http;
