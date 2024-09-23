<template>
  <div id="detailPage" class="container" v-if="items">
    <!-- 상단: 이미지와 제목/가격 섹션 -->
    <h1>{{ items.title }}</h1>
    <div class="upper-section">
      <div class="image-container">
        <img
          v-if="items && items.files && items.files.length > 0"
          :src="getImagePath(items.files[0])"
          alt="이미지 설명"
          class="thumbnail"
        />
        <div v-else class="no-image-placeholder">이미지가 없습니다</div>
      </div>

      <div class="info-container">
        <div class="upperInfo">
          <div class="priceInfo">
            <h3 v-if="items.price !== null">
              가격: ₩{{ items.price.toLocaleString() }}
            </h3>
            <h3 v-else>가격 정보 없음</h3>
          </div>
          <div>
            <button v-if="!isAuthor" @click="report(items.no)">신고</button>
          </div>
        </div>
        <br />

        <!-- 상품 카테고리 및 등록일 또는 수정일 -->
        <b>카테고리: {{ items.categoryName }}</b>
        <p>{{ getDisplayDate() }}</p>
        <p>판매자 : {{ items.userId }}</p>

        <div class="actionButton">
          <!-- 채팅 -->
          <div v-if="!isAuthor" class="chatButton">
            <button @click="createChatRoom">채팅방</button>
          </div>

          <!-- 좋아요 버튼 및 좋아요 수 -->
          <div class="like-section">
            <button @click="toggleFavorite" class="like-button">
              {{
                items.favorite ? "❤️ 좋아요 취소" : "🩶 좋아요"
              }}</button
            >({{ items.favoriteCnt }})
          </div>
        </div>
        <!-- 상단 버튼 (목록보기, 수정, 삭제, 신고) -->
        <div class="item-buttons">
          <span v-if="showEditButtons">
            <button @click="fleaUpdate">수정</button>
            <button @click="fleaDelete">삭제</button>
          </span>
          <button @click="list">목록으로 돌아가기</button>
        </div>
      </div>
    </div>

    <!-- 하단: 상품 설명 및 채팅방 생성 버튼 -->
    <div class="tab">
      <h4>상품 상세 정보</h4>
    </div>
    <div class="lower-section">
      <p>{{ items.contents }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/api/api.js";
import { getUserIdFromToken } from "@/utils/auth"; // 유틸리티 함수 가져오기
import { toast } from "vue3-toastify"; // toast 함수 임포트
import "vue3-toastify/dist/index.css"; // 토스트 스타일 임포트
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

    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      isLoggedIn.value = !!token; // 토큰이 있으면 로그인 상태 true
    };

    const detailOne = async () => {
      if (no) {
        try {
          const response = await apiClient.get(`/fleaMarket/${no}`);
          items.value = response.data;
          // 좋아요 수를 다시 불러오기
          const likeResponse = await apiClient.get(
            `/fleaMarket/favorite/${no}`
          );
          items.value.favoriteCnt = likeResponse.data.likeCount;

          const userId = getUserIdFromToken();
          isAuthor.value = userId === response.data.userId;

          // 로컬 스토리지에서 좋아요 상태를 확인하고 업데이트
          const likedItems =
            JSON.parse(localStorage.getItem("likedItems")) || [];
          items.value.favorite = likedItems.includes(no);
        } catch (err) {
          console.log("fleaDetail Axios error:", err);
          toast.error("상품 정보를 불러오는 데 실패했습니다.", {
            position: "top-center",
          });
        }
      } else {
        console.log("URL에 번호 없음");
        toast.error("유효하지 않은 URL입니다.", {
          position: "top-center",
        });
      }
    };

    const getImagePath = (file) => {
      return file ? `http://localhost:8080${file}` : "";
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
        toast.error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.", {
          position: "top-center",
        });
        router.push({
          path: "/login",
          query: { redirect: route.fullPath }, // 현재 경로 저장
        });
        return;
      }
      try {
        const response = await apiClient.patch("/fleaMarket/favorite", {
          userId: userId,
          fleaMarketNo: no,
        });

        // 좋아요 상태 및 카운트 업데이트
        items.value.favorite = response.data.likedUser; // 백엔드 응답의 likedUser 사용
        items.value.favoriteCnt = response.data.likeCount;

        // 로컬 스토리지에서 좋아요 상태 업데이트
        let likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
        if (items.value.favorite) {
          if (!likedItems.includes(no)) {
            likedItems.push(no);
          }
        } else {
          likedItems = likedItems.filter((itemNo) => itemNo !== no);
        }
        localStorage.setItem("likedItems", JSON.stringify(likedItems));

        toast.success("좋아요 상태가 변경되었습니다.", {
          position: "top-center",
        });
      } catch (err) {
        console.log("toggleFavorite Axios error: ", err);
        toast.error("좋아요 상태 변경에 실패했습니다.", {
          position: "top-center",
        });
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
          toast.success("삭제되었습니다.", {
            position: "top-center",
          });
          router.push("/fleaMarketMain");
        } catch (err) {
          toast.error("삭제가 실패했습니다.", {
            position: "top-center",
          });
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
        toast.error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.", {
          position: "top-center",
        });
        router.push({
          path: "/login",
          query: { redirect: route.fullPath }, // 현재 경로 저장
        });
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
            params: {
              chatRoomId,
              senderId: userId,
              receiverId: sellerIdFromResponse,
            },
          });
          toast.success("채팅방이 생성되었습니다.", {
            position: "top-center",
          });
        } else {
          console.error("채팅방 ID를 가져오지 못했습니다.");
          toast.error("채팅방 생성에 실패했습니다.", {
            position: "top-center",
          });
        }
      } catch (error) {
        console.error("채팅방 생성 실패:", error);
        toast.error("채팅방 생성에 실패했습니다.", {
          position: "top-center",
        });
      }
    };

    const report = async (no) => {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.", {
          position: "top-center",
        });
        router.push({
          path: "/login",
          query: { redirect: route.fullPath }, // 현재 경로 저장
        });
        return;
      }
      try {
        router.push(`/fleaMarketReport/${no}`);
      } catch (err) {
        console.log("report Axios error: ", err);
        toast.error("신고에 실패했습니다.", {
          position: "top-center",
        });
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
