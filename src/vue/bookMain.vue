<template>
  <div id="bookMain">
    <!-- 첫 번째 슬라이더: 이 달의 추천 도서 -->
    <div class="bookCategory">
      <h3>이 달의 추천 도서</h3>
      <div class="slider-container">
        <button class="slider-button left" @click="scrollLeft(0)">&lt;</button>
        <div class="image-list" ref="imageList1">
          <div
            class="image-item"
            v-for="(image, index) in images"
            :key="index"
          >
            <img :src="require(`@/image/${image.src}`)" :alt="image.alt" />
            <p>{{ image.title }}</p>
          </div>
        </div>
        <button class="slider-button right" @click="scrollRight(0)">&gt;</button>
      </div>
    </div>

    <!-- 두 번째: 책 읽기 첫걸음과 작은 슬라이드 -->
    <div class="bookCategory">
      <h3>책 읽기 첫걸음</h3>
      <div class="flex-container">
        <!-- 이미지 리스트 (기존 정적 배열 나열) -->
        <div class="image-list-static">
          <div class="image-item" v-for="(book, index) in books" :key="index">
            <img :src="require(`@/image/${book.src}`)" :alt="book.title" />
            <p>{{ book.title }}</p>
            <p class="author">{{ book.author }}</p>
          </div>
        </div>

        <!-- 작은 슬라이드 (새로 추가된 부분) -->
        <div class="small-slider">
          <button class="slider-button left" @click="scrollLeft(1)">&lt;</button>
          <div class="small-image-list" ref="imageList2">
            <div
              class="image-item-small"
              v-for="(smallImage, index) in smallImages"
              :key="index"
            >
              <img :src="require(`@/image/${smallImage.src}`)" :alt="smallImage.alt" />
              <p>{{ smallImage.title }}</p>
            </div>
          </div>
          <button class="slider-button right" @click="scrollRight(1)">&gt;</button>
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
        { src: 'hoho.jpg', alt: '이미지 1', title: '책 제목 1' },
        { src: 'wow.jpg', alt: '이미지 2', title: '책 제목 2' },
        { src: 'hoho.jpg', alt: '이미지 1', title: '책 제목 3' },
        { src: 'wow.jpg', alt: '이미지 2', title: '책 제목 4' },
        { src: 'hoho.jpg', alt: '이미지 1', title: '책 제목 5' },
        { src: 'wow.jpg', alt: '이미지 2', title: '책 제목 6' },
        { src: 'hoho.jpg', alt: '이미지 1', title: '책 제목 7' },
        { src: 'wow.jpg', alt: '이미지 2', title: '책 제목 8' },
      ],
      books: [
        { src: 'hoho.jpg', alt: '이미지 1', title: '책 제목 1', author: '작가1' },
        { src: 'wow.jpg', alt: '이미지 2', title: '책 제목 2', author: '작가2' },
        { src: 'hoho.jpg', alt: '이미지 3', title: '책 제목 3', author: '작가3' },
        { src: 'wow.jpg', alt: '이미지 4', title: '책 제목 4', author: '작가4' },
      ],
      smallImages: [
        { src: 'sample.jpg', alt: '작은 이미지 1', title: '추천 책 1' },
        { src: 'sample.jpg', alt: '작은 이미지 2', title: '추천 책 2' },
        { src: 'sample.jpg', alt: '작은 이미지 3', title: '추천 책 3' },
      ],
      currentIndex: [0, 0], // 첫 번째 및 두 번째 슬라이더의 인덱스 유지
    };
  },
  methods: {
    scrollLeft(sliderIndex) {
    this.$nextTick(() => {
      const imageWidth = this.$refs[`imageList${sliderIndex + 1}`]?.offsetWidth / 5;
      if (this.currentIndex[sliderIndex] > 0 && imageWidth) {
        this.currentIndex[sliderIndex] -= 1;
        this.$refs[`imageList${sliderIndex + 1}`].scrollBy({
          left: -imageWidth,
          behavior: 'smooth',
        });
      }
    });
  },
  scrollRight(sliderIndex) {
    this.$nextTick(() => {
      const imageWidth = this.$refs[`imageList${sliderIndex + 1}`]?.offsetWidth / 5;
      const items = this.imagesOrBooks(sliderIndex); // 안전하게 값을 할당
      if (this.currentIndex[sliderIndex] < items.length - 5 && imageWidth) {
        this.currentIndex[sliderIndex] += 1;
        this.$refs[`imageList${sliderIndex + 1}`].scrollBy({
          left: imageWidth,
          behavior: 'smooth',
        });
      }
    });
  },
  imagesOrBooks(sliderIndex) {
    // sliderIndex가 유효하지 않으면 빈 배열을 반환
    if (sliderIndex === 0) {
      return this.images;
    } else if (sliderIndex === 1) {
      return this.smallImages;
    } else {
      return []; // 유효하지 않은 인덱스일 경우 빈 배열 반환
    }
  },
},
}
</script>

<style scoped>
#bookMain {
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  font-family: "Pretendard Variable", Pretendard;
}

.bookCategory {
  margin-bottom: 50px;
}

.bookCategory h3 {
  text-align: left;
  margin-bottom: 20px;
}

.slider-container {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
}

.image-list {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  flex-wrap: nowrap;
}

.image-item {
  flex: 0 0 20%; /* 한 번에 5개의 이미지가 보이도록 설정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

.image-item img {
  width: 100%;
  height: auto;
}

.image-item p {
  text-align: center;
  margin-top: 10px;
}

.author {
  font-size: 14px;
  color: gray;
}
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.image-list-static {
  flex: 0 0 70%; /* 이미지 리스트는 70%의 너비 */
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.image-item {
  flex: 0 0 18%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

.image-item img {
  width: 80%;
  height: auto;
}

.image-item p {
  text-align: center;
  margin-top: 10px;
}

.author {
  font-size: 14px;
  color: gray;
}


.small-slider {
  flex: 0 0 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.small-image-list {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
}

.image-item-small {
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
}

.image-item-small img {
  width: 60%;
  height: auto;
}

.slider-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
}

.slider-button.left {
  left: -10px;
}

.slider-button.right {
  right: -10px;
}
</style>
