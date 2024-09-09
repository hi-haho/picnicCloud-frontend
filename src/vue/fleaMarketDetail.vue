<template>
  <div id="detail">
    <div v-if="items">
      <!-- 이미지 및 아이템 정보 -->
      <div class="item-container">
        <img :src="getFirstFilePath(items.filePath)" alt="first Image">
        <div class="item-info">
          <span>{{ showEditButtons }}</span>
          <span class="item-title">{{ items.title }}</span>
          <span class="item-price">{{ items.price }}</span>
          <span class="item-category">{{ items.categoryName }}</span>
          <div class="item-buttons">
            <button v-if="!isAuthor" @click="createChatRoom">채팅방</button>
          </div>
        </div>
      </div>

      <!-- 상단 버튼 (목록보기, 수정, 삭제) -->
      <div>
        <span v-if="showEditButtons">
          <button @click="fleaUpdate">수정</button>
          <button @click="fleaDelete">삭제</button>
          <button v-if="!isAuthor" @click="report(items.no)">신고</button>
        </span>
        <span>{{ items.favoriteCnt }}</span>
        <button @click="toggleFavorite">
          <img :src="items.favorite ? './image/icon/liked-icon.png' : './image/icon/unliked-icon.png'" alt="Favorite">
        </button>
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
import jwt_decode from 'jwt-decode';
import apiClient from '@/api/api.js';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'fleaMarketDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const no = route.params.no; // URL 파라미터로부터 'no'를 가져옴
    const items = ref(null);
    const isLoggedIn = ref(false);
    const isAuthor = ref(false);
    
    const getUserIdFromToken = () => {
      const token = localStorage.getItem('token');  // JWT 토큰을 가져옴
      if (!token) return null;
      const decodedToken = jwt_decode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        // 토큰이 만료되었을 경우
        localStorage.removeItem('token');
        return null;
      }
      
      return decodedToken.sub;
    };

    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      isLoggedIn.value = !!token;  // 토큰이 있으면 로그인 상태 true
    };

    const detailOne = async () => {
      if (no) {
        try {
          const response = await apiClient.get(`/fleaMarket/${no}`);
          items.value = response.data;
          const userId = getUserIdFromToken();
          isAuthor.value = userId === response.data.userId;
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

    // 채팅 관련
    const createChatRoom = async () => {
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken();

      if (!token || !userId) {
          alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
          router.push('/login');
          return;
      }

      try {
          const response = await apiClient.post('/chat/create', {
              fleaMarketNo: no,
              buyerId: userId
          }, {
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          });

          const chatRoomId = response.data.no;
          const sellerIdFromResponse = response.data.userId;
          if (chatRoomId) {
            router.push({
                name: 'chatRoom',
                params: { chatRoomId, senderId: userId, receiverId: sellerIdFromResponse }
            });
          } else {
              console.error('채팅방 ID를 가져오지 못했습니다.');
          }
        } catch (error) {
            console.error('채팅방 생성 실패:', error);
        }
    };

    const fleaUpdate = () => {
      router.push(`/fleaMarketUpdate/${no}`);
    };

    const fleaDelete = async () => {
      const res = confirm('다시 되돌릴 수 없습니다. 삭제하시겠습니까?');
      if (!res) {
        console.log('취소하였습니다.');
      } else {
        try {
          await apiClient.delete(`/fleaMarket/${no}`);
          alert('삭제되었습니다.');
          router.push('/fleaMarketMain');
        } catch (err) {
          alert('삭제가 실패했습니다.');
          router.push('/fleaMarketMain');
        }
      }
    };

    const list = () => {
      router.push('/fleaMarketMain');
    };

    const toggleFavorite = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
        router.push('/login');  // 로그인 페이지로 이동
        return;
      }
      try {
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

    onMounted(async() => {
      checkLoginStatus();
      await detailOne();
    });

    const showEditButtons = computed(() => isLoggedIn.value && isAuthor.value);

    return {
      items,
      getFirstFilePath,
      fleaUpdate,
      fleaDelete,
      list,
      toggleFavorite,
      createChatRoom,
      report,
      showEditButtons,
      isAuthor,
      isLoggedIn
    };
  }
};
</script>
