<template>
    <div v-if="book">
        <div class="bookImg">
            <img :src="require(`@/image/${book.src}`)" :alt="book.title" />
        </div>
        <div class="bookInfo">
            <p><strong>제목:</strong> {{ book.bookName }}</p>
            <p><strong>작가:</strong> {{ book.author }}</p>
            <p><strong>출판사:</strong> {{ book.publisher }}</p>
        </div>
        <div class="moreInfo">
            출판일: {{ book.publicationYear }}
            <button>더보기</button>
        </div>
  </div>
  <div v-else>
    <p>도서 정보를 불러오는 중입니다...</p>
  </div>
</template>