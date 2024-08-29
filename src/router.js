import { createRouter, createWebHashHistory } from 'vue-router';
import mainPage from './mainPage.vue'; // MainPage 컴포넌트 임포트
import placeMain from './vue/placeMain.vue'; // placeMain 컴포넌트 임포트

const routes = [
  { path: '/', component: mainPage }, //mainpage를 루트 컴포넌트로 상ㅇ
  { path: '/place',component: placeMain},// placeMain 컴포넌트와 연결
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

  