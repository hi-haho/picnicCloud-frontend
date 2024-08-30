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
import FooterBox from './components/footerBox.vue';
import TopBar from './components/topBar.vue';

export default {
  components: {
    TopBar,
    FooterBox,
  },
};
</script>
