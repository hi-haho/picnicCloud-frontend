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

// 응답 인터셉터
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // 토큰이 만료되면 로그아웃 처리
      store.dispatch('logout');
      // 로그아웃 처리 후 사용자가 로그인 페이지로 이동하지 않음, 그냥 로그아웃 상태로 둠
    }
    return Promise.reject(error);
  }
);

export default apiClient;
