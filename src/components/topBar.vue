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
          <li v-if="!isLoggedIn"><router-link to="/login">로그인</router-link></li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/myPage">마이페이지</router-link>
            <a @click="logout" href="#">로그아웃</a> <!-- 로그아웃 링크 -->
            <span @click="goToChat" class="notification-icon">🔔</span>
          </li>
        </ul>
      </nav>
    </div>
    <nav class="bottom-nav">
      <ul>
        <li>
          <router-link to="/place">
            <img src="../image/navIcon/iconPlace.png" alt="테마별 장소"><br>
            <span class="nav-text">테마별 장소</span>
          </router-link>
        </li>
        <li>
          <router-link to="/fleaMarketMain">
            <img src="../image/navIcon/iconMarket.png" alt="피클마켓"><br>
            <span class="nav-text">피클마켓</span>
          </router-link>
        </li>
        <li>
          <router-link to="/map">
            <img src="../image/navIcon/iconMap.png" alt="키즈존"><br>
            <span class="nav-text">키즈존</span>
          </router-link>
        </li>
        <li>
          <router-link to="/bookMain">
            <img src="../image/navIcon/iconBook.png" alt="어린이도서"><br>
            <span class="nav-text">어린이도서</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>


<script>
import { computed, onMounted } from 'vue';
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

    // 컴포넌트가 마운트될 때 로컬 스토리지에서 토큰을 확인하고 Vuex 상태를 설정
    onMounted(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        store.dispatch('logout'); // 토큰이 없으면 로그아웃 처리
      }
    });

    return {
      isLoggedIn,
      goToChat,
      logout
    };
  }
};
</script>
