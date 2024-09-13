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
            <router-link :to="{path: '/placeSearch', query: { placeType: '캠핑' }}">
              <img src="../image/places/Camping.png" alt="캠핑장 추천">
            </router-link>
          </div>
          <div class="image">
            <router-link :to="{path: '/placeSearch', query: { placeType: '공공형 키즈카페' }}">
              <img src="../image/places/PublicKidsCafe.png" alt="공공형 키즈 카페 추천">
            </router-link>
          </div>
        </div>
      </article>
      <article id="body2">
        <h3>세종문화회관 이달의 전시 • 공연</h3>
        <div class="calendar">
          <div class="thismonth" aria-label="이번 달 일정">
            <fullCalendar />
          </div>
          <div class="calendarinfo" aria-label="상세 내용 1">
            <p><strong>뮤지컬 보컬 스테이션</strong></p>
            <br>
            <img src="../image/edueventPic/eduevent4.jpg" alt="뮤지컬 보컬 스테이션">
            <br><br>
            <p><strong>기간 : </strong> 2024.09.23(월) ~ 2024.11.25(월) </p>
            <p><strong>시간 : </strong> 11:30 ~ 13:00 (90 분) </p>
            <p><strong>요일 : </strong> 매주 월요일 </p>
            <p><strong>장소 : </strong> 서클홀</p>
            <p><strong>수강료 : </strong> 350,000원</p>
            <a href="https://www.sejongpac.or.kr/portal/academy/academyProgram/view.do?courseCd=CS102103242190000060&menuNo=200560&searchYear=2024&listType=1&pageIndex=1" target="_blank"><p>[더보기]</p></a>
          </div>
          <div class="calendarinfo" aria-label="상세 내용 2">           
            <p><strong>히든보이스</strong></p>
            <br>
            <img src="../image/edueventPic/eduevent5.jpg" alt="히든보이스">
            <br><br>
            <p><strong>기간 : </strong> 2024.09.24(화) ~ 2024.12.10(화)</p>
            <p><strong>시간 : </strong> 12:05 ~ 13:00 (55 분)</p>
            <p><strong>요일 : </strong> 매주 화요일</p>
            <p><strong>장소 : </strong> 서클홀</p>
            <p><strong>수강료 : </strong> 300,000원</p>
            <a href="https://www.sejongpac.or.kr/portal/academy/academyProgram/view.do?courseCd=CS102103242190000054&menuNo=200560&searchYear=2024&listType=1&pageIndex=1" target="_blank"><p>[더보기]</p></a>
          </div>
        </div>
      </article>
      <article id="body3">
        <h3>이달의 신간 영어동화</h3>
        <div class="recommend">
          <div class="wrap">
            <div class="book book1" aria-label="추천 도서 1" ></div>
            <div class="book book2" aria-label="추천 도서 2"></div>
          </div>
          <div class="wrap">
            <div class="book book3" aria-label="추천 도서 3"></div>
            <div class="book book4" aria-label="추천 도서 4"></div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
import fullCalendar from '@/components/fullCalendar.vue'; // 올바른 경로로 수정

export default {
  name: 'mainPage',
  components: {
    fullCalendar // 등록된 컴포넌트 이름과 일치하도록 수정
  },
  data() {
    return {
      banners: [
        require('../image/EventBanner.png'),
        require('../image/banner2.png'),
      ],
      currentIndex: 0, // 현재 배너 인덱스
      selectedEvent: '' // 선택된 이벤트 날짜를 저장할 데이터
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
    handleDateClick(dateStr) {
      console.log('클릭된 날짜:', dateStr);
      this.selectedEvent = dateStr; // 클릭된 날짜를 selectedEvent에 저장
    }
  },
}
</script>

<style src="../css/mainPage.css"></style>