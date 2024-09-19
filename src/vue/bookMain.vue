<template>
  <div id="bookMain">
    <!-- 첫 번째 슬라이더: 이 달의 추천 도서 -->
    <div class="bookCategory">
      <h3>영어와 친해지기</h3>
      <div class="slider-container">
        <button class="slider-button left" @click="scrollLeft(0)">&lt;</button>
        <div class="image-list" ref="imageList1">
          <div class="image-item" v-for="(image, index) in images" :key="index" @click="goToBookDetail(image.no)">
            <img :src="require(`@/image/${image.src}`)" :alt="image.alt" />
            <p>{{ image.bookName }}</p>
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
          <h3>이 달의 추천 도서</h3>
          <div class="image-item" v-for="(book, index) in books" :key="index" @click="goToBookDetail(book.no)">
            <img :src="require(`@/image/${book.src}`)" :alt="book.bookName" />
            <p>{{ book.bookName }}</p>
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
              @click="goToBookDetail(smallImage.no)"
            >
              <img
                :src="require(`@/image/${smallImage.src}`)"
                :alt="smallImage.alt"
              />
              <p>{{ smallImage.bookName }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router"; // Vue Router를 사용
import "../css/bookMain.css";

export default {
  data() {
    return {
      images: [
        { src: "1.jpg", alt: "이미지 1", bookName: "Brothers Are for Making Mud Pies", no: 1 },
        { src: "16.jpg", alt: "이미지 2", bookName: "Miss Spider's Sunny Patch Friends", no: 2 },
        { src: "3.jpg", alt: "이미지 3", bookName: "(The) Night Before St. Patrick's Day", no: 3 },
        { src: "4.jpg", alt: "이미지 4", bookName: "Nothing At All", no: 4 },
        { src: "5.jpg", alt: "이미지 5", bookName: "All About My Day", no: 5 },
        { src: "6.jpg", alt: "이미지 6", bookName: "Joe lion's big boots", no: 6 },
        { src: "7.jpg", alt: "이미지 7", bookName: "Dear peter Rabbit", no: 7 },
        { src: "9.jpg", alt: "이미지 9", bookName: "Pond scum", no: 9 },
      ],
      books: [
        { src: "17.jpg", alt: "이미지 1", bookName: "The girl with the broken wing", author: "Heather dyer", no: 17 },
        {src: "10.jpg", alt: "이미지 2", bookName: "Face facts, sky. 3", author: "Kate Andrews", no: 10},
        {src: "11.jpg", alt: "이미지 3", bookName: "Madison finn : Boy, oh Boy!. 2", author: "Laura Dower",  no: 11},
        {src: "12.jpg", alt: "이미지 4", bookName: "Golden & grey : The nightmares that  ghosts have", author: "Louise Arnold", no: 12},
      ],
      smallImages: [
        { src: "13.jpg", alt: "작은 이미지 1", bookName: "Madison finn : On the case. 17", no: 13 },
        { src: "14.jpg", alt: "작은 이미지 2", bookName: "Abadazad : the road to inconceivable. 3", no: 14 },
        { src: "15.jpg", alt: "작은 이미지 3", bookName: "Sorcerer of the Waves. 3", no: 15 },
      ],
      currentIndex: [0, 0], // 첫 번째 및 두 번째 슬라이더의 인덱스 유지
      autoSlideInterval: null, // 자동 슬라이드를 위한 인터벌 변수
    };
  },
  setup() {
    const router = useRouter();

    const goToBookDetail = (bookNo) => {
      router.push(`/book-info/${bookNo}`);
    };

    return { goToBookDetail };
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
        if (!imageListRef) {
          console.error("imageListRef가 존재하지 않습니다.");
          return;
        }

        const imageWidth =
          imageListRef.children[0]?.offsetWidth ||
          imageListRef.offsetWidth / 5;
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