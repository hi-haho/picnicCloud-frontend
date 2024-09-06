<template>
  <header>
    <div id="upper-nav">
      <div id="logo">
        <router-link to="/">
          picnic_cloud
        </router-link>
      </div>
      <nav>
        <ul>
          <li v-if="!isLoggedIn"><router-link to="/login">login</router-link></li>
          <li v-if="isLoggedIn">
            <router-link to="/myPage">MyPage</router-link>
            <span @click="goToChat" class="notification-icon">🔔</span>
            <a @click="logout" href="#">logout</a> <!-- 로그아웃 링크 -->
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import './topBar.css';

export default {
  setup() {
    const isLoggedIn = ref(false);
    const router = useRouter();

    // 로컬 스토리지에서 토큰을 확인해 로그인 상태 설정
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        isLoggedIn.value = true;
      } else {
        isLoggedIn.value = false;
      }
    };

    // 컴포넌트가 마운트될 때 로그인 상태 확인
    onMounted(() => {
      checkLoginStatus();
    });

    const goToChat = () => {
      router.push('/chat');
    };

    // 로그인 함수: 로그인 후 isLoggedIn을 즉시 true로 설정
    const login = () => {
      localStorage.setItem('token', 'your-token'); // 실제 로그인 로직에 맞게 변경
      isLoggedIn.value = true; // 로그인 후 상태 업데이트
    };

    // 로그아웃 함수: 로그아웃 후 isLoggedIn을 즉시 false로 설정
    const logout = () => {
      localStorage.removeItem('token'); // 토큰 삭제
      isLoggedIn.value = false; // 로그인 상태 즉시 업데이트
      alert('로그아웃 되었습니다.');
      router.push('/'); // 로그아웃 후 메인 페이지로 리다이렉트
    };

    return {
      isLoggedIn,
      goToChat,
      logout,
      login // 필요시 login 함수 추가
    };
  }
};
</script>