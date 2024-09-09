import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true', // 초기 상태를 로컬 스토리지에서 불러옴
    };
  },
  mutations: {
    setLoggedIn(state, status) {
      state.isLoggedIn = status;
      localStorage.setItem('isLoggedIn', status); // 상태를 로컬 스토리지에 저장
    },
  },
  actions: {
    login({ commit }) {
      commit('setLoggedIn', true); // 로그인 상태를 true로 설정하고 로컬 스토리지에 저장
    },
    logout({ commit }) {
      commit('setLoggedIn', false); // 로그아웃 상태를 false로 설정하고 로컬 스토리지에서 삭제
      localStorage.removeItem('token'); // 로그인 시 저장된 토큰도 삭제
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn, // 로그인 상태를 반환
  },
});

export default store;
