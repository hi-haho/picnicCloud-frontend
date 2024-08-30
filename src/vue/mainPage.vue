<template>
    <div id="mainPage">
      <div id="mainBanner">
        <img src="../image/Event Banner.png" alt="이벤트 배너">
      </div>
      <section id="contentArea">
        <article id="body1">
          <h3>지금이 딱!  활동 추천</h3> 
          <div class="images">
            <div class="image" aria-label="활동 이미지 1">
              <img src="../image/places/Camping.png" alt="캠핑장 추천">
            </div>
            <div class="image" aria-label="활동 이미지 2">
              <img src="../image/places/PublicKidscafe.png" alt="공공형 키즈 카페 추천">
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
            <div class="book" aria-label="추천 도서 1"></div>
            <div class="book" aria-label="추천 도서 2"></div>
            <div class="book" aria-label="추천 도서 3"></div>
            <div class="book" aria-label="추천 도서 4"></div>
          </div>
        </article>
      </section>
    </div>
  </template>
  
  <script>
  import '../css/mainPage.css';

  export default {
    name: 'mainPage',
  };
  </script>