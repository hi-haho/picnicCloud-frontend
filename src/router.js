import { createRouter, createWebHashHistory } from 'vue-router';
import mainPage from './vue/mainPage.vue'; // MainPage 컴포넌트 임포트
import placeMain from './vue/placeMain.vue'; // placeMain 컴포넌트 임포트
import map from './vue/map.vue'; //map 컴포넌트로 임포트
import placeSearch from './vue/placeSearch.vue';
import fleaMarketMain from './vue/fleaMarketMain.vue';
import fleaMarketDetail from './vue/fleaMarketDetail.vue';
import fleaMarketCreate from './vue/fleaMarketCreate.vue';
import fleaMarketUpdate from './vue/fleaMarketUpdate.vue';
import fleaMarketReport from './vue/fleaMarketReport.vue';
import login from './vue/login.vue';
import signUp from './vue/signUp.vue';
import myPage from './vue/myPage.vue';
import myPosts from './vue/myPosts.vue';
import myLikes from './vue/myLikes.vue';
import bookMain from './vue/bookMain.vue';
import chatRoom from './vue/chatRoom.vue';
import chatList from './vue/chatList.vue';
import placeInfo from './vue/placeInfo.vue';
import apiClient from './api/api';
import store from './store/index';

const routes = [
  { path: '/', component: mainPage }, //mainpage를 루트 컴포넌트로 상ㅇ
  { path: '/place',component: placeMain},// placeMain 컴포넌트와 연결
  { path: '/map',component: map},
  { path: '/placeSearch',component: placeSearch},
  { path: '/fleaMarketMain',component: fleaMarketMain},
  { path: '/fleaMarketReport', component: fleaMarketReport, meta: { requiresAuth: true } },
  { path: '/fleaMarketCreate', component: fleaMarketCreate, meta: { requiresAuth: true } },
  { path: '/fleaMarketUpdate/:no', component: fleaMarketUpdate, meta: { requiresAuth: true } },
  { path: '/fleaMarketDetail/:no', name: 'FleaMarketDetail', component: fleaMarketDetail },
  { path: '/login', component: login },
  { path: '/signUp', component: signUp },
  { path: '/myPage', component: myPage, meta: { requiresAuth: true } },
  { path: '/myPosts', component: myPosts, meta: { requiresAuth: true } },
  { path: '/myLikes', component: myLikes, meta: { requiresAuth: true } },
  { path: '/bookMain', component: bookMain },
  { path: '/chatList', component: chatList, meta: { requiresAuth: true } },
  { path: '/chatRoom/:chatRoomId/:senderId/:receiverId', name: 'chatRoom', component:chatRoom, 
    props: (route) => ({
      chatRoomId: Number(route.params.chatRoomId),
      senderId: route.params.senderId,
      receiverId: route.params.receiverId
    })
  },
  { path: '/listToChatRoom/:chatRoomId', name: 'listToChatRoom', component: chatRoom, 
    props: (route) => ({
      chatRoomId: Number(route.params.chatRoomId)
    })
  },
  { path: '/placeInfo', component: placeInfo, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 전역 가드 (beforeEach)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // JWT 토큰 가져오기
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 이동
      next('/login');
    } else {
      // 토큰이 만료되었는지 확인하는 부분을 추가하고,
      // 만료되었다면 로그아웃 및 로그인 페이지로 리다이렉트
      apiClient.post('/auth/verifyToken', { token }) // 서버에서 토큰 검증
        .then(() => {
          next(); // 토큰이 유효하면 다음 페이지로 이동
        })
        .catch(() => {
          store.dispatch('logout'); // 토큰이 만료되었으면 로그아웃
          next('/login'); // 로그인 페이지로 이동
        });
    }
  } else {
    next(); // 그 외의 경우는 정상적으로 다음 라우트로 진행
  }
});

export default router;

  