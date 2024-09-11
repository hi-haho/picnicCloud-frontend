<template>
  <header>
    <div id="upper-nav">
      <div id="logo">
        <router-link to="/">
          <img src="../image/logo.svg" alt="picniCloud" />
        </router-link>
      </div>
      <nav>
        <ul>
          <li v-if="!isLoggedIn" >
            <router-link to="/login">로그인</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/myPage">마이페이지</router-link>
            <div class="logout-and-notification">
            <a @click="logout" href="#">로그아웃</a>
            <!-- 알림 아이콘 클릭 시 모달 창 열기 -->
            <span @click="toggleChatModal" class="notification-icon">🔔</span>
            </div>
            <!-- 모달 창 (알림 아이콘 아래) -->
            <div v-if="isChatModalVisible" class="chat-modal">
              <h2>채팅 목록</h2>
              <div
                v-for="chatRoom in chatRooms"
                :key="chatRoom.no"
                class="chat-room-item"
                @click="enterChatRoom(chatRoom.chatRoomNo)"
              >
                <span>{{ chatRoom.senderId }}: {{ chatRoom.lastMessage }}</span>
                <br />
                <small>{{
                  formatLastMessageTime(chatRoom.lastMessageTime)
                }}</small>
                <!-- 나가기 버튼 -->
                <button
                  class="close-button"
                  @click.stop="leaveChatRoom(chatRoom.chatRoomNo)"
                >
                  &times;
                </button>
              </div>
              <div v-if="chatRooms.length === 0">채팅방이 없습니다</div>
              <button @click="toggleChatModal">닫기</button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
    <nav class="bottom-nav">
      <ul>
        <li>
          <router-link to="/place">
            <img src="../image/navIcon/iconPlace.png" alt="테마별 장소" /><br />
            <span class="nav-text">테마별 장소</span>
          </router-link>
        </li>
        <li>
          <router-link to="/fleaMarketMain">
            <img src="../image/navIcon/iconMarket.png" alt="피클마켓" /><br />
            <span class="nav-text">피클마켓</span>
          </router-link>
        </li>
        <li>
          <router-link to="/map">
            <img src="../image/navIcon/iconMap.png" alt="키즈존" /><br />
            <span class="nav-text">키즈존</span>
          </router-link>
        </li>
        <li>
          <router-link to="/bookMain">
            <img src="../image/navIcon/iconBook.png" alt="어린이도서" /><br />
            <span class="nav-text">어린이도서</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import apiClient from "@/api/api.js";
import jwt_decode from "jwt-decode";
import "./topBar.css";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const chatRooms = ref([]);
    const isChatModalVisible = ref(false);

    const isLoggedIn = computed(() => store.getters.isLoggedIn);

    const toggleChatModal = () => {
      if (!isLoggedIn.value) {
        alert("로그인이 필요합니다.");
        router.push("/login"); // 로그인 페이지로 이동
      } else {
        isChatModalVisible.value = !isChatModalVisible.value;
        if (isChatModalVisible.value) {
          getChatRoomList(); // 모달이 열릴 때 채팅 목록을 가져옴
        }
      }
    };

    const getChatRoomList = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("토큰이 없습니다.");
        return;
      }

      const decodedToken = jwt_decode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        console.error("토큰이 만료되었습니다.");
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      try {
        const response = await apiClient.get(`/api/chatList`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        chatRooms.value = response.data;
        console.log("채팅 목록 조회 성공:", response.data);
      } catch (error) {
        console.error("채팅 목록 조회 실패", error);
      }
    };

    const enterChatRoom = (chatRoomNo) => {
      router.push(`/listToChatRoom/${chatRoomNo}`);
      toggleChatModal();
    };

    const formatLastMessageTime = (lastMessageTime) => {
      const now = new Date();
      const messageTime = new Date(lastMessageTime);
      const diffInSeconds = Math.floor((now - messageTime) / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);

      if (diffInSeconds < 60) {
        return `${diffInSeconds}초 전`;
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
      } else if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
      } else {
        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };
        return messageTime.toLocaleDateString("ko-KR", options);
      }
    };

    const logout = () => {
      store.dispatch("logout");
      alert("로그아웃 되었습니다.");
      router.push("/");
    };

    const leaveChatRoom = async (chatRoomNo) => {
      const confirmLeave = confirm("정말로 채팅방을 나가시겠습니까?");
      if (confirmLeave) {
        try {
          const token = localStorage.getItem("token");
          await apiClient.delete(`/api/leave/${chatRoomNo}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // 나간 후 목록에서 해당 채팅방을 제거
          chatRooms.value = chatRooms.value.filter(
            (room) => room.chatRoomNo !== chatRoomNo
          );
          console.log(`채팅방 ${chatRoomNo} 나가기 성공`);
        } catch (error) {
          console.error("채팅방 나가기에 실패했습니다.", error);
        }
      }
    };

    onMounted(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        store.dispatch("logout");
      }
    });

    return {
      isLoggedIn,
      toggleChatModal,
      logout,
      chatRooms,
      enterChatRoom,
      formatLastMessageTime,
      isChatModalVisible,
      leaveChatRoom,
    };
  },
};
</script>

<style scoped>

</style>
