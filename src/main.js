import { createApp } from 'vue';
import App from './App.vue';  // App.vue를 루트 컴포넌트로 사용
import router from './router';  // router.js에서 라우터 임포트
import store from './store/index.js';
import Vue3Toastify from 'vue3-toastify'; // Vue3Toastify를 추가
import 'vue3-toastify/dist/index.css'; // CSS 파일 임포트

const app = createApp(App);

app.use(router);  // Vue Router 사용 설정
app.use(store); //vuex스토어 추가
app.use(Vue3Toastify, {
    autoClose: 3000, // 3초 후 자동 닫힘
    position: "top-center",
  });

app.mount('#app');
