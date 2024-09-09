<template>
  <div id="bookMain">
    <!-- 첫 번째 슬라이더: 이 달의 추천 도서 -->
    <div class="bookCategory">
      <h3>이 달의 추천 도서</h3>
      <div class="slider-container">
        <button class="slider-button left" @click="scrollLeft(0)">&lt;</button>
        <div class="image-list" ref="imageList1">
          <div class="image-item" v-for="(image, index) in images" :key="index">
            <img :src="require(`@/image/${image.src}`)" :alt="image.alt" />
            <p>{{ image.title }}</p>
          </div>
        </div>
        <button class="slider-button right" @click="scrollRight(0)">
          &gt;
        </button>
      </div>
    </div>

    <!-- 두 번째: 책 읽기 첫걸음과 작은 슬라이드 -->
    <div class="bookCategory">
      
      <div class="flex-container">
        <!-- 이미지 리스트 (기존 정적 배열 나열) -->
        <div class="image-list-static">
          <h3>책 읽기 첫걸음</h3>
          <div class="image-item" v-for="(book, index) in books" :key="index">
            <img :src="require(`@/image/${book.src}`)" :alt="book.title" />
            <p>{{ book.title }}</p>
            <p class="author">{{ book.author }}</p>
          </div>
        </div>

        <!-- 작은 슬라이드 (새로 추가된 부분) -->
        <div
          class="small-slider"
          @mouseenter="stopAutoSlide"
          @mouseleave="startAutoSlide"
        >
          <h3>새로운 책</h3>
          <div class="small-image-list" ref="imageList2">
            <div
              class="image-item-small"
              v-for="(smallImage, index) in smallImages"
              :key="index"
            >
              <img
                :src="require(`@/image/${smallImage.src}`)"
                :alt="smallImage.alt"
              />
              <p>{{ smallImage.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      images: [
        { src: "1.jpeg", alt: "이미지 1", title: "책 제목 1" },
        { src: "2.jpeg", alt: "이미지 2", title: "책 제목 2" },
        { src: "3.jpeg", alt: "이미지 1", title: "책 제목 3" },
        { src: "4.jpeg", alt: "이미지 2", title: "책 제목 4" },
        { src: "5.jpeg", alt: "이미지 1", title: "책 제목 5" },
        { src: "6.jpeg", alt: "이미지 2", title: "책 제목 6" },
        { src: "7.jpeg", alt: "이미지 1", title: "책 제목 7" },
        { src: "8.jpeg", alt: "이미지 2", title: "책 제목 8" },
      ],
      books: [
        { src: "9.jpeg", alt: "이미지 1", title: "책 제목 1", author: "작가1" },
        {
          src: "10.jpeg",
          alt: "이미지 2",
          title: "책 제목 2",
          author: "작가2",
        },
        {
          src: "11.jpeg",
          alt: "이미지 3",
          title: "책 제목 3",
          author: "작가3",
        },
        {
          src: "12.jpeg",
          alt: "이미지 4",
          title: "책 제목 4",
          author: "작가4",
        },
      ],
      smallImages: [
        { src: "13.jpeg", alt: "작은 이미지 1", title: "추천 책 1" },
        { src: "14.jpeg", alt: "작은 이미지 2", title: "추천 책 2" },
        { src: "15.jpeg", alt: "작은 이미지 3", title: "추천 책 3" },
      ],
      currentIndex: [0, 0], // 첫 번째 및 두 번째 슬라이더의 인덱스 유지
      autoSlideInterval: null, // 자동 슬라이드를 위한 인터벌 변수
    };
  },
  mounted() {
    this.startAutoSlide();
  },
  beforeUnmount() {
    // 컴포넌트가 파괴되기 전에 자동 슬라이드를 정지
    this.stopAutoSlide();
  },
  methods: {
    // 오른쪽으로 스크롤
    scrollRight(sliderIndex) {
      this.$nextTick(() => {
        const imageListRef = this.$refs[`imageList${sliderIndex + 1}`];
        if (!imageListRef) return;

        const imageWidth =
          sliderIndex === 1
            ? imageListRef.children[0].offsetWidth
            : imageListRef.offsetWidth / 5;
        const items = this.imagesOrBooks(sliderIndex);

        if (
          this.currentIndex[sliderIndex] <
            items.length - (sliderIndex === 1 ? 1 : 5) &&
          imageWidth
        ) {
          this.currentIndex[sliderIndex] += 1;
          imageListRef.scrollBy({
            left: imageWidth,
            behavior: "smooth",
          });
        } else {
          // 끝까지 갔다면 다시 처음으로 돌아가기
          this.currentIndex[sliderIndex] = 0;
          imageListRef.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        }
      });
    },
    // 자동 슬라이드 시작
    startAutoSlide() {
      this.autoSlideInterval = setInterval(() => {
        this.scrollRight(1); // 작은 슬라이더의 인덱스는 1
      }, 3000); // 3초마다 슬라이드
    },
    // 자동 슬라이드 정지
    stopAutoSlide() {
      clearInterval(this.autoSlideInterval);
    },
    // 슬라이드의 이미지 배열 반환
    imagesOrBooks(sliderIndex) {
      if (sliderIndex === 0) {
        return this.images;
      } else if (sliderIndex === 1) {
        return this.smallImages;
      } else {
        return [];
      }
    },
  },
};
</script>

<style src="../css/bookMain.css"></style>