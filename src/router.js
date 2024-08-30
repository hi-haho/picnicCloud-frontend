import { createRouter, createWebHashHistory } from 'vue-router';
import mainPage from './vue/mainPage.vue'; // MainPage 컴포넌트 임포트
import placeMain from './vue/placeMain.vue'; // placeMain 컴포넌트 임포트
import map from './vue/map.vue'; //map 컴포넌트로 임포트
import placeSearch from './vue/placeSearch.vue';

const routes = [
  { path: '/', component: mainPage }, //mainpage를 루트 컴포넌트로 상ㅇ
  { path: '/place',component: placeMain},// placeMain 컴포넌트와 연결
  { path: '/map',component: map},
  { path: '/placeSearch',component: placeSearch},
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

  