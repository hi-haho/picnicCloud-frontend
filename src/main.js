import { createApp } from 'vue';
import App from './App.vue';  // App.vue를 루트 컴포넌트로 사용
import router from './router';  // router.js에서 라우터 임포트
import store from './store';


const app = createApp(App);

app.use(router);  // Vue Router 사용 설정
app.use(store); //vuex스토어 추가
app.mount('#app');