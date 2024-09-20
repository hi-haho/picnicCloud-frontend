import { createStore } from 'vuex';
import apiClient from '@/api/api'; // apiClient를 가져옵니다.
import jwt_decode from 'jwt-decode'; // JWT 디코딩 라이브러리

const store = createStore({
  state() {
    return {
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      token: localStorage.getItem('token') || '',
    };
  },
  mutations: {
    setLoggedIn(state, { status, token }) {
      state.isLoggedIn = status;
      state.token = token || '';
      localStorage.setItem('isLoggedIn', status);
      localStorage.setItem('token', token || '');
    },
  },
  actions: {
    async login({ commit }, loginData) {
      try {
        const response = await apiClient.post('/auth/login', loginData);
        const token = response.data.token; // 서버 응답이 { token: "your-token" }인 경우
        commit('setLoggedIn', { status: true, token }); // 상태와 토큰을 저장합니다
      } catch (error) {
        console.error('로그인 오류:', error);
        throw error;
      }
    },
    logout({ commit }) {
      commit('setLoggedIn', { status: false, token: '' });
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn'); // 로그인 상태도 초기화
    },
    // 새로운 액션 추가: 초기 페이지 로드시 로그인 상태 확인
    checkLoginStatus({ commit }) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwt_decode(token);
          const currentTime = Math.floor(Date.now() / 1000);
          // 토큰이 만료되지 않은 경우
          if (decodedToken.exp > currentTime) {
            commit('setLoggedIn', { status: true, token }); // 로그인 상태 유지
          } else {
            // 토큰이 만료된 경우 로그아웃 처리
            commit('setLoggedIn', { status: false, token: '' });
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
          }
        } catch (error) {
          console.error('토큰 확인 중 오류 발생:', error);
          commit('setLoggedIn', { status: false, token: '' });
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
        }
      } else {
        // 토큰이 없을 경우 로그아웃 상태로 설정
        commit('setLoggedIn', { status: false, token: '' });
      }
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
  },
});

export default store;
