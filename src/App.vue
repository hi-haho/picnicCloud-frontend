<template>
  <div id="app">
    <header id="topBar">
      <TopBar />
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer id="footerBox">
      <FooterBox />
    </footer>
  </div>
</template>

<script>
import FooterBox from "./components/footerBox.vue";
import TopBar from "./components/topBar.vue";
import { useStore } from 'vuex';

export default {
  components: {
    TopBar,
    FooterBox,
  },
  setup() {
    const store = useStore();
    store.dispatch('checkLoginStatus'); // 페이지 로드 시 로그인 상태 확인
  },
};
</script>
