<template>
  <div id="detail">
    <div v-if="items">
      <!-- 이미지 및 아이템 정보 -->
      <div class="item-container">
        <img :src="getFirstFilePath(items.mfilePath)" alt="first Image">
        <div class="item-info">
          <span class="item-title">{{ items.title }}</span>
          <span class="item-price">{{ items.price }}</span>
          <span class="item-category">{{ items.categoryName }}</span>
          <div class="item-buttons">
            <button>채팅방</button>
          </div>
        </div>
      </div>

      <!-- 상단 버튼 (목록보기, 수정, 삭제) -->
      <div>
        <!-- 작성자만 보이도록 -->
        <button @click="fleaUpdate">수정</button>
        <button @click="fleaDelete">삭제</button>
        <!-- -------------- -->
        <span>{{ items.favoriteCnt }}</span>
        <button @click="toggleFavorite(items)">
          <img :src="items.favorite ? './images/icon/liked-icon.png' : './images/icon/unliked-icon.png'" alt="Favorite">
        </button>
        <button @click="report(items.no)">신고</button>
        <button @click="list">목록보기</button>
      </div>

      <!-- 하단 상세 정보 -->
      <div class="item-description">
        <h3>상품 상세 정보</h3>
        <p>{{ items.mcont }}</p>
      </div>
    </div>

    <div v-else>
      <h2>Loading...</h2>
    </div>
  </div>
</template>

<script>
import apiClient from '@/api/api.js';

export default {
  name: 'fleaMarketDetail',
  props: {
    no: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      items: null, // 초기 값은 null로 설정
    };
  },
  mounted() {
    this.detailOne();
  },
  methods: {
    async detailOne() {
//       const url = new URLSearchParams(window.location.search);
//       this.no = url.get('no');
// console.log("URL Parameter no:", this.no);
      if (this.no) {
        try {
           const response = await apiClient.get(`/fleaMarket/${this.no}`);
          this.items = response.data;
        } catch (err) {
          console.log("fleaDetail Axios error:", err);
        }
      } else {
        console.log("URL에 번호 없음");
      }
    },
    getFirstFilePath(mfilePath) {
      return Array.isArray(mfilePath) ? mfilePath[0] : mfilePath;
    },
    fleaUpdate() {
      window.location.href = `fleamarketUpdate.html?no=${this.no}`;
    },
    async fleaDelete() {
      const res = confirm('다시 되돌릴 수 없습니다. 삭제하시겠습니까?');
      if (!res) {
        console.log('취소하였습니다.');
      } else {
        try {
          await apiClient.delete(`/fleaMarket/${this.no}`);
          alert('삭제되었습니다.');
          window.location.href = '/fleamarket.html';
        } catch (err) {
          alert('삭제가 실패했습니다.');
          window.location.href = '/fleamarket.html';
        }
      }
    },
    list() {
      window.location.href = 'fleamarket.html';
    },
    toggleFavorite() {
       apiClient.patch(`/fleaMarket/favorite/${this.no}`)
				.then(response => {
					// 서버 응답을 처리하여 UI 업데이트
					this.items.favorite = !this.items.favorite;
					this.items.favoriteCnt = response.data.favoriteCount;
				})
				.catch(err => {
					console.log("toggleFavorite Axios error: ", err);
				});
        
    },
    report(no) {
    try {
        // 신고를 서버로 전송
        apiClient.post('/fleaMarket/report', { no });
        alert('신고가 완료되었습니다.');
      } catch (err) {
        console.log("report Axios error: ", err);
        alert('신고에 실패했습니다.');
      }
    }
  }
};
</script>