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
        <!-- 페이징 버튼 추가 -->
    <div v-if="totalPages > 1" class="pagination">
      <a
        href="javascript:void(0)"
        @click="changePage(currentPage - 1)"
        :class="{ disabled: currentPage === 0 }"
        >&lt;</a
      >
      <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
      <a
        href="javascript:void(0)"
        @click="changePage(currentPage + 1)"
        :class="{ disabled: currentPage === totalPages - 1 }"
        >&gt;</a
      >
    </div>
      </div>
      <div v-else>
        <p>게시글이 없습니다.</p>
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
      posts: [], // 게시글 데이터
      currentPage: 0, // 현재 페이지 번호
      totalPages: 1,  // 총 페이지 수
      pageSize: 5,    // 한 페이지에 표시할 게시글 수
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn"]), // 로그인 상태 및 유저 ID 가져오기
  },
  methods: {
    async fetchUserPosts(page = 0) {
      if (!this.isLoggedIn) {
        console.error("사용자가 로그인되어 있지 않습니다.");
        return;
      }
      try {
        const response = await apiClient.get("/mypage/posts-market", {
          params: {
            userId: this.loggedIn, // Vuex에서 가져온 유저 ID
            page: page,
            size: this.pageSize,
          },
        });
        this.posts = response.data.content; // 게시글 데이터
        this.totalPages = response.data.totalPages; // 총 페이지 수
        this.currentPage = page; // 현재 페이지 업데이트
      } catch (error) {
        console.error("게시글을 불러오는 데 실패했습니다:", error);
      }
    },
  },
  created() {
    this.fetchUserPosts(); // 컴포넌트가 생성될 때 게시글을 불러옵니다.
  },
};
</script>
