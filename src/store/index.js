import { createStore } from 'vuex';
import apiClient from '@/api/api'; // apiClient를 가져옵니다.

const store = createStore({
  state() {
    return {
      isLoggedIn: false,  // 초기 상태는 false로 두고 로컬 스토리지를 동기화
      token: '',
    };
  },
  mutations: {
    setLoggedIn(state, { status, token }) {
      state.isLoggedIn = status;
      state.token = token || '';
      localStorage.setItem('isLoggedIn', status);
      localStorage.setItem('token', token || '');
    },
    initializeStore(state) {
      const token = localStorage.getItem('token');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (token && isLoggedIn) {
        state.token = token;
        state.isLoggedIn = isLoggedIn;
      }
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
      }
    },
    logout({ commit }) {
      commit('setLoggedIn', { status: false, token: '' });
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn'); // 로그인 상태도 초기화
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
  },
});

export default store;
