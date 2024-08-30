// src/api/api.js
import axios from "axios";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // 환경 변수에서 baseURL을 가져옵니다
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
