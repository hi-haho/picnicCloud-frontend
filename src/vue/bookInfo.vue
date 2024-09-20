<template>
  <div id="book-detail" class="container" v-if="book && Object.keys(book).length > 0">
    <div class="book-header">
      <img
        :src="getBookImageUrl(book.no)"
        alt="책 이미지"
        class="book-image"
      />
      <div class="book-info">
        <h2>{{ book.bookName }}</h2>
        <p>저자: {{ book.author }}</p>
        <p>출판사: {{ book.publisher }}</p>
        <p>출판일: {{ book.publicationYear }}</p>
        <p>카테고리: {{ book.categoryName }}</p>
        <button @click="goBack">목록으로 돌아가기</button>
      </div>
    </div>

    <div class="book-details">
      <div class="tab">
      책 설명
    </div>
      <div class="details-content">
      <p>{{ book.description ? book.description : "정보가 없습니다." }}</p>
    </div>
  </div>
</div>
  <div v-else>
    <p>책 정보를 불러오는 중입니다...</p>
  </div>
</template>

<script>
import apiClient from "@/api/api.js"; // apiClient 사용
import '../css/bookInfo.css';

export default {
  data() {
    return {
      book: null, // 초기값을 null로 설정하여 로딩 중인지 표시
    };
  },
  created() {
    this.fetchBookData();
  },
  methods: {
    // 책 데이터 가져오기
    async fetchBookData() {
      const no = this.$route.params.no; // URL 파라미터에서 책 번호를 가져옴
      const query = `/book/${no}`; // 경로를 query 변수로 설정
      await apiClient
        .get(query)
        .then((response) => {
          this.book = response.data; // 책 정보를 받아옴
        })
        .catch((error) => {
          console.error("책 정보를 불러오는 중 오류가 발생했습니다:", error);
          this.book = {}; // 오류 발생 시 빈 객체 설정
        });
    },
    // 책 이미지 경로 설정
    getBookImageUrl(bookNo) {
      // 책 번호에 맞는 이미지 경로를 동적으로 설정
      return require(`@/image/${bookNo}.jpg`); // 책 번호에 맞는 이미지 경로 반환
    },
    goBack() {
      this.$router.push("/bookMain"); // 목록으로 돌아가기
    },
  },
};
</script>
