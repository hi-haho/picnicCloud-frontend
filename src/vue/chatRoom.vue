<template>
  <div id="chatRoom">
    <!-- 알림 배너 -->
    <div v-if="showSiteNotification" class="site-notification">
      {{ siteNotificationMessage }}
    </div>

    <!-- 게시판 정보 표시 -->
    <div class="board-container" v-if="board">
      <h2>{{ board.title }}</h2>
      <p>가격: {{ board.price }}</p>
      <p>{{ board.contents }}</p>
    </div>

    <!-- 채팅 내역 표시 -->
    <div class="chat-container" ref="chatContainer">
      <ul class="message-list">
        <li v-for="message in messages" :key="message.no">
          <strong>{{ message.senderId }}:</strong> {{ message.messageContents }}
          <br />
          <small>{{ formatDate(message.createDate) }}</small>
        </li>
      </ul>
    </div>

    <!-- 메시지 입력 필드 -->
    <div class="input-container">
      <input
        v-model="newMessage"
        placeholder="메시지 입력"
        @keydown.enter="sendMessage"
      />
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<script>
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import apiClient from "@/api/api.js";
import jwt_decode from "jwt-decode";
import { toast } from 'vue3-toastify'; // toast 함수 임포트
import 'vue3-toastify/dist/index.css'; // 토스트 스타일 임포트
import "../css/chatRoom.css";

export default {
  props: {
    chatRoomId: {
      type: Number,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      messages: [],
      newMessage: "",
      board: {},
      stompClient: null,
      showSiteNotification: false, // 알림 표시 여부
      siteNotificationMessage: "", // 알림 메시지 내용
    };
  },
  watch: {
    // chatRoomId가 변경될 때 WebSocket 연결을 재설정하고 메시지를 다시 불러옴
    chatRoomId(newId, oldId) {
      if (newId !== oldId) {
        this.disconnectWebSocket(); // 기존 WebSocket 연결 종료
        this.connect(); // 새로운 WebSocket 연결
        this.axiosMessages(); // 새로운 채팅방의 메시지 불러오기
      }
    },
  },
  methods: {
    disconnectWebSocket() {
      if (this.stompClient) {
        this.stompClient.disconnect(() => {
          console.log("WebSocket 연결 종료");
        });
        this.stompClient = null;
      }
    },
    // 알림 권한 요청 함수
    requestNotificationPermission() {
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("알림 권한이 허용되었습니다.");
          } else {
            console.log("알림 권한이 거부되었습니다.");
          }
        });
      }
    },

    // 알림 표시 함수
    showNotification(title, body) {
      if (Notification.permission === "granted") {
        const options = {
          body: body,
          icon: require("@/image/logo2-1.png"), // 알림 아이콘 경로 설정
        };
        new Notification(title, options);
      }
    },

    // WebSocket 연결 함수
    connect() {
      if (this.stompClient) {
        console.warn("STOMP 클라이언트가 이미 설정되어 있습니다.");
        return;
      }

      const socket = new SockJS("http://localhost:8080/ws");
      this.stompClient = Stomp.over(socket);

      const token = localStorage.getItem("token");
      const decodedToken = jwt_decode(token);
      const currentUserId = decodedToken.sub; // 현재 로그인한 사용자 ID

      this.stompClient.connect(
        { Authorization: `Bearer ${token}` },
        () => {
          console.log("WebSocket 연결 성공");

          // 메시지 구독 (다른 사용자가 보낸 메시지에만 알림 표시)
          this.stompClient.subscribe(
            `/topic/chatRoom/${this.chatRoomId}`,
            (message) => {
              const parsedMessage = JSON.parse(message.body);

              // 현재 사용자가 보낸 메시지가 아닌 경우에만 알림 표시
              if (parsedMessage.senderId !== currentUserId) {
                this.showNotification(
                  "새 메시지 도착",
                  `${parsedMessage.senderId}: ${parsedMessage.messageContents}`
                );
              }

              if (!this.messages.some((m) => m.no === parsedMessage.no)) {
                this.messages.push(parsedMessage);
                this.scrollToBottom();
              }
            }
          );
        },
        (error) => {
          console.error("WebSocket 연결 실패:", error);
        }
      );
    },
    beforeDestroy() {
      // 컴포넌트가 사라지기 전에 구독을 해제하고 연결을 끊습니다.
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      if (this.stompClient) {
        this.stompClient.disconnect(() => {
          console.log("WebSocket 연결 종료");
        });
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const chatContainer = this.$refs.chatContainer;
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      });
    },

    async axiosMessages() {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
        this.$router.push("/login");
        return;
      }

      try {
        const response = await apiClient.get(`/message/${this.chatRoomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("전체 응답 데이터:", response.data); // 전체 응답 확인

        if (response.data) {
          this.messages = response.data.messages; // 메시지 목록 저장

          // board 데이터가 따로 없는 경우 응답 데이터를 직접 할당
          this.board = {
            title: response.data.title,
            price: response.data.price,
            contents: response.data.contents || "내용 없음", // 필요한 경우 기본값 설정
          };
          console.log("저장된 board 데이터:", this.board); // 저장된 board 데이터 확인
          this.scrollToBottom();
        } else {
          console.error("응답 데이터가 유효하지 않습니다:", response.data);
        }
      } catch (error) {
        console.error("메시지 및 게시판 정보 불러오기 실패:", error);
      }
    },
    
    // 메시지 전송 함수
    async sendMessage() {
      if (this.newMessage.trim() === "") return;

      const token = localStorage.getItem("token");
      const decodedToken = jwt_decode(token);
      const senderId = decodedToken.sub;

      const message = {
        messageContents: this.newMessage,
        senderId: senderId,
        receiverId: this.receiverId,
        chatRoomNo: this.chatRoomId,
        createDate: new Date().toISOString(),
      };

      try {
        // WebSocket으로 메시지 전송
        this.stompClient.send(
          `/app/chat.send/${this.chatRoomId}`,
          {},
          JSON.stringify(message)
        );

        // 서버에 메시지 저장
        await apiClient.post(`/message/send`, message, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // 입력 필드 초기화
        this.newMessage = "";
      } catch (error) {
        console.error("메시지 전송 실패:", error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "잘못된 날짜";
      }
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));

      if (diffInMinutes < 1) {
        return "방금 전";
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours}시간 전`;
      } else {
        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };
        return date.toLocaleDateString("ko-KR", options);
      }
    },
  },
  mounted() {
    this.requestNotificationPermission();
    this.connect();
    this.axiosMessages();
    this.scrollToBottom();
  },
};
</script>
