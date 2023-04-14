import axios, { AxiosError } from 'axios';
import { JWT_TOKEN } from '../constants/constants';
import { userState } from './NavService';

// axios instance for making requests 
const http = axios.create();

// request interceptor for adding token
http.interceptors.request.use((config) => {
  // add token to request headers
  // console.log("Inside JWT Interceptor", config)
  config.headers.Authorization = sessionStorage.getItem(JWT_TOKEN);
  return config;
});

http.interceptors.response.use((response) => response, (error: AxiosError) => {
  // whatever you want to do with the error
  if (error?.response?.status === 403) {
    sessionStorage.clear()
    userState.next(null)
  }
  throw error;
});

export default http;
