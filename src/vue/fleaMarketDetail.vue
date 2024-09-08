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
            <button @click="createChatRoom">채팅방</button>
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
import jwt_decode from 'jwt-decode';
import apiClient from '@/api/api.js';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'fleaMarketDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const no = route.params.no; // URL 파라미터로부터 'no'를 가져옴
    const items = ref(null);
    const sellerId = ref('');
    
    const getUserIdFromToken = () => {
      const token = localStorage.getItem('token');  // JWT 토큰을 가져옴
      if (!token) return null;
      const decodedToken = jwt_decode(token);
      // console.log('Decoded Token:', decodedToken); // 디코딩 결과 확인
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        // 토큰이 만료되었을 경우
        localStorage.removeItem('token');
        return null;
      }
      
      return decodedToken.sub;
    };

    const detailOne = async () => {
      if (no) {
        try {
          const response = await apiClient.get(`/fleaMarket/${no}`);
          items.value = response.data;
          sellerId.value = response.data.sellerId;
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

    //채팅 관련
    const createChatRoom = async () => {
      const token = localStorage.getItem('token');  // JWT 토큰을 가져옴
      const userId = getUserIdFromToken();

      if (!token || !userId) {
        alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
        router.push('/login');  // 로그인 페이지로 이동
        return;
      }

      try {
        const response = await apiClient.post('/chat/create', null, {
          params: {
            fleaMarketNo: no,   // 플리마켓 게시글 번호
            buyerId: userId     // 현재 로그인한 구매자 ID
          },
          headers: {
            'Authorization': `Bearer ${token}`  // JWT 토큰을 헤더에 추가
          }
        });
        
        const chatRoomId = response.data.no; // 채팅방 번호
        const sellerIdFromResponse = response.data.sellerId; // 판매자 ID
        if (chatRoomId) {
          // 채팅방 페이지로 이동, 구매자와 판매자의 ID를 전달
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
      router.push({ name: 'FleaMarketDetail', params: { no } });
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
      createChatRoom,
      report
    };
  }
};
</script>
