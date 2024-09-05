import { createRouter, createWebHashHistory } from 'vue-router';
import mainPage from './vue/mainPage.vue'; // MainPage 컴포넌트 임포트
import placeMain from './vue/placeMain.vue'; // placeMain 컴포넌트 임포트
import map from './vue/map.vue'; //map 컴포넌트로 임포트
import placeSearch from './vue/placeSearch.vue';
import fleaMarketMain from './vue/fleaMarketMain.vue';
import fleaMarketReport from './vue/fleaMarketReport.vue';
import fleaMarketCreate from './vue/fleaMarketCreate.vue';
import login from './vue/login.vue';
import signUp from './vue/signUp.vue';
import fleaMarketDetail from './vue/fleaMarketDetail.vue';
import myPage from './vue/myPage.vue';
import bookMain from './vue/bookMain.vue';

const routes = [
  { path: '/', component: mainPage }, //mainpage를 루트 컴포넌트로 상ㅇ
  { path: '/place',component: placeMain},// placeMain 컴포넌트와 연결
  { path: '/map',component: map},
  { path: '/placeSearch',component: placeSearch},
  { path: '/fleaMarketMain',component: fleaMarketMain},
  { path: '/fleaMarketReport',component: fleaMarketReport},
  { path: '/fleaMarketCreate',component: fleaMarketCreate},
  { path: '/login',component: login},
  { path: '/signUp',component: signUp},
  { path: '/fleaMarketDetail/:no', name: 'FleaMarketDetail',component: fleaMarketDetail},
  { path: '/myPage',component: myPage},
  { path: '/bookMain',component: bookMain},
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

  