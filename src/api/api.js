// src/api/api.js
import axios from "axios";
import store from '@/store'; // Vuex store를 가져옵니다.

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false
});

// 요청 인터셉터
apiClient.interceptors.request.use(config => {
  const token = store.state.token; // Vuex에서 토큰을 가져옵니다.
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;
