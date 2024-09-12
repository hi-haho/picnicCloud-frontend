<template>
    <div class="book-detail">
      <div class="book-header">
        <img :src="book.thumbnail ? book.thumbnail : '경로/기본이미지.png'" alt="책 이미지" class="book-image" />
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
        <p>책 설명: {{ book.description ? book.description : '정보가 없습니다.' }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import apiClient from "@/api/api.js"; // apiClient 사용
  
  export default {
    data() {
      return {
        book: {}, // 책 정보 저장
      };
    },
    created() {
      this.fetchBookData();
    },
    methods: {
      fetchBookData() {
        const bookNo = this.$route.params.no; // URL 파라미터에서 책 번호를 가져옴
        apiClient.get(`/api/books/${bookNo}`) // apiClient 사용
          .then(response => {
            this.book = response.data; // 책 정보를 받아옴
          })
          .catch(error => {
            console.error('책 정보를 불러오는 중 오류가 발생했습니다:', error);
          });
      },
      goBack() {
        this.$router.push('/book-list'); // 목록으로 돌아가기
      },
    },
  };
  </script>
  
  <style scoped>
  .book-detail {
    border: 1px solid #e0e0e0;
    padding: 20px;
    background-color: white;
  }
  
  .book-header {
    display: flex;
  }
  
  .book-image {
    width: 300px;
    height: auto;
    margin-right: 20px;
  }
  
  .book-info {
    display: flex;
    flex-direction: column;
  }
  
  .book-details {
    margin-top: 20px;
  }
  
  button {
    margin-top: 10px;
  }
  </style>
  