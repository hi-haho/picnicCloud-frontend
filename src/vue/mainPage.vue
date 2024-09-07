<template>
  <div id="mainPage">
    <section id="contentArea">
      <div id="mainBanner">
        <img :src="currentBanner" alt="이벤트 배너">
      </div>
      <article id="body1">
        <h3>지금이 딱! 활동 추천</h3>
        <div class="images">
          <div class="image">
            <img src="../image/places/Camping.png" alt="캠핑장 추천">
          </div>
          <div class="image">
            <img src="../image/places/PublicKidsCafe.png" alt="공공형 키즈 카페 추천">
          </div>
        </div>
      </article>
      <article id="body2">
        <h3>이달의 전시, 공연 일정</h3>
        <div class="calendar">
          <div class="thismonth" aria-label="이번 달 일정">캘린더 들어갈 자리</div>
          <div class="calendarinfo" aria-label="상세 내용 1">상세 내용 들어갈 자리</div>
          <div class="calendarinfo" aria-label="상세 내용 2">상세 내용 들어갈 자리</div>
        </div>
      </article>
      <article id="body3">
        <h3>올 가을에는 마음을 살찌워 보아요.</h3>
        <div class="recommend">
          <div class="wrap">
            <div class="book" aria-label="추천 도서 1"></div>
            <div class="book" aria-label="추천 도서 2"></div>
          </div>
          <div class="wrap">
            <div class="book" aria-label="추천 도서 3"></div>
            <div class="book" aria-label="추천 도서 4"></div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: 'mainPage',
  data() {
    return {
      banners: [
      require('../image/EventBanner.png'),
      require('../image/banner2.png'),
      ],
      currentIndex: 0, // 현재 배너 인덱스
    };
  },
  computed: {
    currentBanner() {
      return this.banners[this.currentIndex]; // 현재 보여줄 배너 이미지
    },
  },
  mounted() {
    this.startSlideshow();
  },
  methods: {
    startSlideshow() {
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.banners.length;
      }, 3000); // 3초마다 이미지 변경
    },
  },
};
</script>

<style src="../css/mainPage.css"></style>
