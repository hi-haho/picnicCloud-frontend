// src/api/api.js
import axios from "axios";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: "http://localhost:8080", // 환경 변수에서 baseURL을 가져옵니다
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false
});

// Request interceptor
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;


