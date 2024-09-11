<template>
  <div id="myPageMain">
    <div id="buttonArea">
      <router-link to="/myPage">내 정보</router-link>
      <router-link to="/myPosts">내 게시글</router-link>
      <router-link to="/myLikes">내 찜</router-link>
    </div>

    <div id="tabs">
        <button @click="activeTab = 'places'">장소</button>
        <button @click="activeTab = 'markets'">중고거래</button>
      </div>

    <div id="contentsArea">
      <div class="body">
        <h3>내 찜 목록</h3>
        <div v-if="activeTab === 'places'">
          <h4>찜한 장소</h4>
          <ul v-if="likedPlaces.length > 0">
            <li v-for="place in likedPlaces" :key="place.id">
              {{ place.name }} - {{ place.address }}
            </li>
          </ul>
          <p v-else>찜한 장소가 없습니다.</p>
        </div>

        <div v-if="activeTab === 'markets'">
          <h4>찜한 중고거래</h4>
          <ul v-if="likedMarkets.length > 0">
            <li v-for="market in likedMarkets" :key="market.id">
              {{ market.title }} - {{ market.price }}원
            </li>
          </ul>
          <p v-else>찜한 중고거래가 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>




<script>
import { mapGetters } from "vuex";
import apiClient from "@/api/api";
import "@/css/myPage.css";

export default {
  data() {
    return {
      activeTab: "places", // 현재 선택된 탭 (장소 또는 중고거래)
      likedPlaces: [], // 찜한 장소 리스트
      likedMarkets: [], // 찜한 중고거래 리스트
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn"]), // 로그인 상태 확인
  },
  watch: {
    isLoggedIn: {
      immediate: true,
      handler(isLoggedIn) {
        if (isLoggedIn) {
          this.fetchLikedPlaces();
          this.fetchLikedMarkets();
        }
      }
    }
  },
  methods: {
    async fetchLikedPlaces() {
      try {
        const response = await apiClient.get('/mypage/liked-places');
        this.likedPlaces = response.data.content; // 페이지 내용 가져오기
      } catch (error) {
        console.error('찜한 장소를 가져오는 데 오류가 발생했습니다:', error);
      }
    },
    async fetchLikedMarkets() {
      try {
        const response = await apiClient.get('/mypage/liked-markets');
        this.likedMarkets = response.data.content; // 페이지 내용 가져오기
      } catch (error) {
        console.error('찜한 중고거래를 가져오는 데 오류가 발생했습니다:', error);
      }
    }
  }
};
</script>

