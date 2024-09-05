<template>
    <div id="bookMain">
        <h3>영어 공부의 첫 걸음, 영어 책 읽기</h3>
        <br><br>
        <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="book-list">
         <div class="book-item" v-for="book in row" :key="book.id">
            <img :src="book.image" :alt="book.title" />
            <p>{{ book.title }}</p>
         </div>
        </div>

        <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="book-list">
  <div class="book-item" v-for="book in row" :key="book.id">
    <img :src="book.image" :alt="book.title" />
    <p>{{ book.title }}</p>
  </div>
</div>

    </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      rows: [],  // 책 정보를 담을 배열
    };
  },
  methods: {
    
    fetchBooks() {
      axios.get('/api/books')  // 책 정보를 가져오는 API 엔드포인트
        .then(response => {
          const books = response.data;
          this.organizeBooksIntoRows(books);
        })
        .catch(error => {
          console.error('Error fetching books:', error);
        });
    },
    organizeBooksIntoRows(books) {
      // books 데이터를 5개씩 나눠 rows 배열에 저장
      const rows = [];
      for (let i = 0; i < books.length; i += 5) {
        rows.push(books.slice(i, i + 5));
      }
      
      // 여기에 다른 배열을 추가하고 싶다면:
      const additionalBooks = [
        { id: 101, title: 'Extra Book 1', image: 'path-to-extra-image1.jpg' },
        { id: 102, title: 'Extra Book 2', image: 'path-to-extra-image2.jpg' },
        { id: 103, title: 'Extra Book 3', image: 'path-to-extra-image3.jpg' },
        { id: 104, title: 'Extra Book 4', image: 'path-to-extra-image4.jpg' },
        { id: 105, title: 'Extra Book 5', image: 'path-to-extra-image5.jpg' }
      ];

      // 추가 배열을 rows에 추가
      rows.push(additionalBooks);

      // rows 데이터를 상태로 저장
      this.rows = rows;
    }
  },
  created() {
    this.fetchBooks(); // 컴포넌트가 생성될 때 데이터 로드
  }
}

</script>

<style scoped>
.book-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px; /* 각 줄 사이 간격 */
}

.book-item {
  flex: 1 1 calc(20% - 20px); /* 한 줄에 5개의 아이템 배치 */
  max-width: calc(20% - 20px);
  box-sizing: border-box;
  text-align: center;
}

.book-item img {
  width: 100%;
  height: auto;
}

</style>