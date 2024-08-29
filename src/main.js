import { createApp } from 'vue';
import mainPage from './mainPage.vue';  // MainPage를 루트 컴포넌트로 사용
import router from './router';  // router.js에서 라우터 임포트

const app = createApp(mainPage);

app.use(router);  // Vue Router 사용 설정
app.mount('#app');