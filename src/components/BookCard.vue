<template>
    <div class="book-card">
      <img :src="book.image" :alt="book.title" class="book-cover" />
      <p class="book-title">{{ book.title }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      book: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .book-card {
    width: 150px;
    margin: 10px;
    text-align: center;
  }
  
  .book-cover {
    width: 100%;
    height: auto;
  }
  
  .book-title {
    margin-top: 8px;
    font-size: 14px;
  }
  </style>
  