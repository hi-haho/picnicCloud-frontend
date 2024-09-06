<template>
    <div id="myPageMain">
      <div id="buttonArea">
        <router-link to="/myPage">내 정보</router-link>
        <router-link to="/myPosts">내 게시글</router-link>
        <router-link to="/myLikes">내 찜</router-link>
      </div>
      <div id="contentsArea">
        <h3>내 게시글</h3>
        <div v-if="posts.length > 0">
          <ul>
            <li v-for="post in posts" :key="post.id">
              <h4>{{ post.title }}</h4>
              <p>{{ post.contents }}</p>
              <p>가격: {{ post.price }}원</p>
            </li>
          </ul>
          <!-- 페이지네이션 -->
          <button @click="fetchUserPosts(currentPage - 1)" :disabled="currentPage === 0">이전</button>
          <button @click="fetchUserPosts(currentPage + 1)" :disabled="currentPage === totalPages - 1">다음</button>
        </div>
        <div v-else>
          <p>게시글이 없습니다.</p>
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
        posts: [], // 게시글 데이터
        currentPage: 1, // 현재 페이지 번호
        totalPages: 20,  // 총 페이지 수
        pageSize: 5,    // 한 페이지에 표시할 게시글 수
      };
    },
    methods: {
      fetchUserPosts(page = 0) {
        const userId = 'user2'; // 임시로 userId를 5로 설정. 이 부분도 바꿔주셔야해요!!!!!!!!!!!!!
  
        apiClient
          .get("/mypage/posts-market", {
            params: {
              userId: userId,
              page: page,
              size: this.pageSize, // 페이지 크기
            },
          })
          .then((response) => {
            this.posts = response.data.content; // 게시글 데이터
            this.currentPage = response.data.number; // 현재 페이지 번호
            this.totalPages = response.data.totalPages; // 총 페이지 수
          })
          .catch((error) => {
            console.error("Error fetching posts:", error);
          });
      },
    },
    mounted() {
      this.fetchUserPosts(); // 페이지 로드 시 첫 페이지의 게시글을 가져옴
    },
  };
  </script>
  