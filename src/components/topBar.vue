<template>
  <header>
    <div id="upper-nav">
      <div id="logo">
        <router-link to="/">
          <img src="../image/logo.svg" alt="picniCloud">
        </router-link>
      </div>
      <nav>
        <ul>
          <li v-if="!isLoggedIn"><router-link to="/login">login</router-link></li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/myPage">MyPage</router-link>
            <a @click="logout" href="#">logout</a> <!-- 로그아웃 링크 -->
            <span @click="goToChat" class="notification-icon">🔔</span>
          </li>
        </ul>
      </nav>
    </div>
    <nav class="bottom-nav">
      <ul>
        <li><router-link to="/place">테마 추천</router-link></li>
        <li><router-link to="/fleaMarketMain">중고거래</router-link></li>
        <li><router-link to="/map">지도</router-link></li>
        <li><router-link to="/bookMain">도서</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex'; // Vuex store 사용
import { useRouter } from 'vue-router';
import './topBar.css';

export default {
  setup() {
    const store = useStore(); // Vuex 스토어 인스턴스
    const router = useRouter();

    // Vuex의 로그인 상태 가져오기
    const isLoggedIn = computed(() => store.getters.isLoggedIn);

    const goToChat = () => {
      router.push('/chatList');
    };

    // 로그아웃 함수: Vuex 상태와 로컬 스토리지 동기화
    const logout = () => {
      store.dispatch('logout'); // Vuex에서 로그아웃 처리
      alert('로그아웃 되었습니다.');
      router.push('/'); // 로그아웃 후 메인 페이지로 이동
    };

    return {
      isLoggedIn,
      goToChat,
      logout
    };
  }
};
</script>
