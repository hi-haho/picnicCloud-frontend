<template>
  <div id="detailPage">
    <div v-if="items">
      <!-- 상단: 이미지와 제목/가격 섹션 -->
      <div class="upper-section">
        <div class="image-container">
          <!-- 이미지가 있을 경우에만 보여줌 -->
          <img
            v-if="items.files && items.files.length > 0"
            :src="getImagePath(items.files[0])"
            alt="상품 이미지"
          />
          <!-- 이미지가 없을 경우 대체 텍스트 -->
          <div v-else class="no-image-placeholder">이미지가 없습니다</div>
        </div>

        <div class="info-container">
          <h2>{{ items.title }}</h2>
          <h3 v-if="items.price !== null">₩{{ items.price.toLocaleString() }}</h3>
          <h3 v-else>가격 정보 없음</h3>

          <!-- 좋아요 버튼 및 좋아요 수 -->
          <div class="like-section">
            <button @click="toggleFavorite">
              <span>{{ items.favorite ? '❤️' : '🩶' }}</span>
            </button>
          </div>

          <!-- 채팅 -->
          <div v-if="!isAuthor">
            <button @click="createChatRoom">채팅방</button>
          </div>

          <!-- 상품 카테고리 및 등록일 또는 수정일 -->
          <p>카테고리: {{ items.categoryName }}</p>
          <p>{{ getDisplayDate() }}</p>
        </div>
      </div>

      <!-- 상단 버튼 (목록보기, 수정, 삭제, 신고) -->
      <div class="item-buttons">
        <span v-if="showEditButtons">
          <button @click="fleaUpdate">수정</button>
          <button @click="fleaDelete">삭제</button>
        </span>
        <button v-if="!isAuthor" @click="report(items.no)">신고</button>
        <button @click="list">목록보기</button>
      </div>

      <!-- 하단: 상품 설명 및 채팅방 생성 버튼 -->
      <div class="lower-section">
        <h4>상품 상세 정보</h4>
        <p>{{ items.contents }}</p>
        
      </div>
    </div>

    <div v-else>
      <h2>Loading...</h2>
    </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import apiClient from "@/api/api.js";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import "@/css/fleaDetail.css";

export default {
  name: "fleaMarketDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const no = route.params.no; // URL 파라미터로부터 'no'를 가져옴
    const items = ref(null);
    const isLoggedIn = ref(false);
    const isAuthor = ref(false);

    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token"); // JWT 토큰을 가져옴
      if (!token) return null;
      const decodedToken = jwt_decode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        // 토큰이 만료되었을 경우
        localStorage.removeItem("token");
        return null;
      }

      return decodedToken.sub;
    };

    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      isLoggedIn.value = !!token; // 토큰이 있으면 로그인 상태 true
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

    const getImagePath = (file) => {
      return `http://localhost:8080${file}`;
    };


    // 날짜 형식 변환 함수
    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("ko-KR", options);
    };

    // 등록일 또는 수정일 표시 함수
    const getDisplayDate = () => {
      if (items.value && items.value.updatedate) {
        return `수정일: ${formatDate(items.value.updatedate)}`;
      } else if (items.value && items.value.createdate) {
        return `등록일: ${formatDate(items.value.createdate)}`;
      }
      return "";
    };

    // 좋아요 토글
    const toggleFavorite = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
        router.push("/login"); // 로그인 페이지로 이동
        return;
      }
      try {
        const response = await apiClient.patch("/fleaMarket/favorite", {
          userId: userId,
          fleaMarketNo: no,
        });
        items.value.favorite = !items.value.favorite;
        items.value.favoriteCnt = response.data.favoriteCount;
      } catch (err) {
        console.log("toggleFavorite Axios error: ", err);
      }
    };

    const fleaUpdate = () => {
      router.push(`/fleaMarketUpdate/${no}`);
    };

    const fleaDelete = async () => {
      const res = confirm("다시 되돌릴 수 없습니다. 삭제하시겠습니까?");
      if (!res) {
        console.log("취소하였습니다.");
      } else {
        try {
          await apiClient.delete(`/fleaMarket/${no}`);
          alert("삭제되었습니다.");
          router.push("/fleaMarketMain");
        } catch (err) {
          alert("삭제가 실패했습니다.");
          router.push("/fleaMarketMain");
        }
      }
    };

    const list = () => {
      router.push("/fleaMarketMain");
    };

    // 채팅방 생성
    const createChatRoom = async () => {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();

      if (!token || !userId) {
        alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
        router.push("/login");
        return;
      }

      try {
        const response = await apiClient.post(
          "/chat/create",
          {
            fleaMarketNo: no,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const chatRoomId = response.data.no;
        const sellerIdFromResponse = response.data.sellerId;
        if (chatRoomId) {
          router.push({
            name: "chatRoom",
            params: { chatRoomId, senderId: userId, receiverId: sellerIdFromResponse },
          });
        } else {
          console.error("채팅방 ID를 가져오지 못했습니다.");
        }
      } catch (error) {
        console.error("채팅방 생성 실패:", error);
      }
    };

    const report = async (no) => {
      try {
        await apiClient.post("/fleaMarket/report", { no });
        alert("신고가 완료되었습니다.");
      } catch (err) {
        console.log("report Axios error: ", err);
        alert("신고에 실패했습니다.");
      }
    };

    onMounted(async () => {
      checkLoginStatus();
      await detailOne();
    });

    const showEditButtons = computed(() => isLoggedIn.value && isAuthor.value);

    return {
      items,
      getImagePath,
      getDisplayDate,
      fleaUpdate,
      fleaDelete,
      list,
      toggleFavorite,
      createChatRoom,
      report,
      showEditButtons,
      isAuthor,
      isLoggedIn,
    };
  },
};
</script>
