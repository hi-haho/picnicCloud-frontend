<template>
    <header>
    <div id="upper-nav">
  <div id="logo">
    <router-link to="/">
      <!--<img src="../image/logo_ver1.png">-->
      <!-- <img src="../image/logo_ver2.png">-->
       picnic_cloud

    </router-link>
  </div>
  <nav>
    <ul>
      <li v-if="!isLoggedIn"><router-link to="/login">
        login
      </router-link></li>
      <li v-if="isLoggedIn">
        <router-link to="/mypage">MyPage</router-link>
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
        <li><router-link to="/book">이달의 책</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
//import { computed } from 'vue';
// import { isLoggedIn, login, logout, goToChat} from '../store/auth';
import './topBar.css';

export default {
  setup() {
    return {
      // isLoggedIn: computed(() => isLoggedIn.value),
      // login,
      // logout,
      // goToChat
    };
  }
};
</script>

