import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

//Instance cho API public (không cần token)
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

//Instance cho API private (cần cookie/token)
export const privateApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // gửi cookie chứa JWT token
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// interceptor cho private API
privateApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized - Redirecting to login...');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
