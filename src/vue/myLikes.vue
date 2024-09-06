<template>
    <div id="myPageMain">
      <div id="buttonArea">
        <router-link to="/myPage">내 정보</router-link>
        <router-link to="/myPosts">내 게시글</router-link>
        <router-link to="/myLikes">내 찜</router-link>
      </div>
      
      <div id="contentsArea">
        <h3>내 찜 목록</h3>
        <div id="tabs">
          <button @click="activeTab = 'places'">장소</button>
          <button @click="activeTab = 'markets'">중고거래</button>
        </div>
  
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
  </template>
  
  <script>
  import apiClient from "@/api/api";
  import "@/css/myPage.css";
  
  export default {
    data() {
      return {
        activeTab: 'places',  // 현재 선택된 탭 (장소 또는 중고거래)
        likedPlaces: [],      // 찜한 장소 리스트
        likedMarkets: []      // 찜한 중고거래 리스트
      };
    },
    methods: {
      fetchLikedPlaces() {
        const userId = 5; // 임시로 userId를 5로 설정. 이 부분도 바꿔주셔야해요!!!!!!!!!!!!!
  
        apiClient
          .get("/mypage/liked-places", {
            params: { userId: userId },
          })
          .then((response) => {
            this.likedPlaces = response.data.content;
          })
          .catch((error) => {
            console.error("Error fetching liked places:", error);
          });
      },
      fetchLikedMarkets() {
        const userId = 'user2'; // 임시로 userId를 5로 설정
  
        apiClient
          .get("/mypage/liked-markets", {
            params: { userId: userId },
          })
          .then((response) => {
            this.likedMarkets = response.data.content;
          })
          .catch((error) => {
            console.error("Error fetching liked markets:", error);
          });
      },
    },
    mounted() {
      this.fetchLikedPlaces();  // 페이지 로드 시 찜한 장소를 기본으로 가져옴
    },
    watch: {
      activeTab(newTab) {
        if (newTab === 'places') {
          this.fetchLikedPlaces();
        } else if (newTab === 'markets') {
          this.fetchLikedMarkets();
        }
      }
    }
  };
  </script>

  