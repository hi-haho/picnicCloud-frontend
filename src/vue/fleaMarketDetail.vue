<template>
  <div id="detail">
    <div v-if="items">
      <!-- 이미지 및 아이템 정보 -->
      <div class="item-container">
        <img :src="getFirstFilePath(items.filePath)" alt="first Image">
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
        <button @click="fleaUpdate">수정</button>
        <button @click="fleaDelete">삭제</button>
        <span>{{ items.favoriteCnt }}</span>
        <button @click="toggleFavorite">
          <img :src="items.favorite ? './image/icon/liked-icon.png' : './image/icon/unliked-icon.png'" alt="Favorite">
        </button>
        <button @click="report(items.no)">신고</button>
        <button @click="list">목록보기</button>
      </div>

      <!-- 하단 상세 정보 -->
      <div class="item-description">
        <h3>상품 상세 정보</h3>
        <p>{{ items.contents }}</p>
      </div>
    </div>

    <div v-else>
      <h2>Loading...</h2>
    </div>
  </div>
</template>

<script>
import apiClient from '@/api/api.js';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'fleaMarketDetail',
  setup() {
    const route = useRoute();
    const no = route.params.no; // URL 파라미터로부터 'no'를 가져옴
    const items = ref(null);
    const userId = 'user1'; // 여기서 userId를 적절히 정의하거나 로그인 정보에서 가져와야 합니다.

    const detailOne = async () => {
      if (no) {
        try {
          const response = await apiClient.get(`/fleaMarket/${no}`);
          items.value = response.data;
        } catch (err) {
          console.log("fleaDetail Axios error:", err);
        }
      } else {
        console.log("URL에 번호 없음");
      }
    };

    const getFirstFilePath = (filePath) => {
      return Array.isArray(filePath) ? filePath[0] : filePath;
    };

    const fleaUpdate = () => {
      window.location.href = `fleaMarketUpdate.html?no=${no}`;
    };

    const fleaDelete = async () => {
      const res = confirm('다시 되돌릴 수 없습니다. 삭제하시겠습니까?');
      if (!res) {
        console.log('취소하였습니다.');
      } else {
        try {
          await apiClient.delete(`/fleaMarket/${no}`);
          alert('삭제되었습니다.');
          window.location.href = '/fleaMarketMain';
        } catch (err) {
          alert('삭제가 실패했습니다.');
          window.location.href = '/fleaMarketMain';
        }
      }
    };

    const list = () => {
      window.location.href = '/fleaMarketMain';
    };

    const toggleFavorite = async () => {
  try {
    // Assuming `userId` is defined elsewhere in your code
    const response = await apiClient.patch('/fleaMarket/favorite', {
      userId: userId,
      fleaMarketNo: no
    });
    items.value.favorite = !items.value.favorite;
    items.value.favoriteCnt = response.data.favoriteCount;
  } catch (err) {
    console.log("toggleFavorite Axios error: ", err);
  }
};

    const report = async (no) => {
      try {
        await apiClient.post('/fleaMarket/report', { no });
        alert('신고가 완료되었습니다.');
      } catch (err) {
        console.log("report Axios error: ", err);
        alert('신고에 실패했습니다.');
      }
    };

    onMounted(() => {
      detailOne();
    });

    return {
      items,
      getFirstFilePath,
      fleaUpdate,
      fleaDelete,
      list,
      toggleFavorite,
      report
    };
  }
};
</script>
