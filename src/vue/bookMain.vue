<template>
  <div id="bookMain">
    <div class="bookCategory">
      <h3>우리 아이 영어 공부의 시작</h3>
      <div class="image-item" v-for="(image, index) in images" :key="index">
        <img :src="require(`@/image/${image.src}`)" :alt="image.alt" />
        <p>{{ image.title }}</p>
      </div>
    </div>
    <div class="bookCategory">
      <h3>책과 친해지기. 동화</h3>
      <div class="image-item" v-for="(image, index) in images" :key="index">
        <img :src="require(`@/image/${image.src}`)" :alt="image.alt" />
        <p>{{ image.title }}</p>
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
        // 다른 이미지 데이터 추가
      ]
    };
  }
};
</script>

<style scoped>
#bookMain {
  display: flex;
  flex-direction: column; /* 카테고리들을 수직으로 정렬 */
  padding: 20px;
}

.bookCategory {
  margin-bottom: 40px; /* 카테고리 간의 여백 */
}

.bookCategory h3 {
  text-align: center;
  margin-bottom: 20px; /* 제목과 이미지 사이의 여백 */
}

.image-item {
  display: flex;
  flex-direction: column; /* 이미지와 제목을 수직으로 배치 */
  align-items: center; /* 가운데 정렬 */
  margin-bottom: 20px;
}

.image-item img {
  width: 10%;
  height: auto;
}

.image-item p {
  text-align: center;
  margin-top: 10px;
}
</style>
