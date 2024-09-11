<template>
  <div id="chatRoom">
    <!-- 게시판 정보 표시 -->
    <div v-if="board">
      <h2>{{ board.title }}</h2>
      <p>가격: {{ board.price }}</p>
      <p>{{ board.contents }}</p>
    </div>

    <!-- 메시지 목록 표시 -->
    <ul>
      <li v-for="message in messages" :key="message.no">
        <strong>{{ message.senderId }}:</strong> {{ message.messageContents }}
        <br />
        <small>{{ formatDate(message.createDate) }}</small>
      </li>
    </ul>

    <!-- 메시지 입력 필드 -->
    <input v-model="newMessage" placeholder="메시지 입력" @keydown.enter="sendMessage" />
    <button @click="sendMessage">전송</button>
  </div>
</template>

<script>
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import apiClient from '@/api/api.js';
import jwt_decode from 'jwt-decode';

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
      board: null,
      stompClient: null,
    };
  },
  methods: {
    connect() {
      if (this.stompClient) {
        console.warn("STOMP 클라이언트가 이미 설정되어 있습니다.");
        return;
      }

      const socket = new SockJS("http://localhost:8080/ws");
      this.stompClient = Stomp.over(socket);

      const token = localStorage.getItem('token');
      this.stompClient.connect(
        { Authorization: `Bearer ${token}` },
        () => {
          this.stompClient.subscribe(`/topic/chatRoom/${this.chatRoomId}`, (message) => {
            const parsedMessage = JSON.parse(message.body);
            if (!this.messages.some((m) => m.no === parsedMessage.no)) {
              this.messages.push(parsedMessage);
            }
          });
        }, (error) => {
          console.error("WebSocket 연결 실패:", error);
      });
    },

    async axiosMessages() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
        this.$router.push('/login');
        return;
      }

      try {
        const response = await apiClient.get(`/message/${this.chatRoomId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.data || !Array.isArray(response.data.messages)) {
          console.error("응답 데이터가 유효하지 않습니다:", response.data);
          return;
        }

        this.messages = response.data.messages;
        console.log("메시지 목록 불러오기 성공:", this.messages);
      } catch (error) {
        console.error("메시지 불러오기 실패:", error);
      }
    },

    async sendMessage() {
      if (this.newMessage.trim() === "") return;

      const token = localStorage.getItem('token');
      const decodedToken = jwt_decode(token);
      const senderId = decodedToken.sub; // JWT에서 senderId 추출
      
      const message = {
        messageContents: this.newMessage,
        senderId: senderId,
        receiverId: this.receiverId,
        chatRoomNo: this.chatRoomId,
      };

      try {
        this.stompClient.send(`/app/chat.send/${this.chatRoomId}`, {}, JSON.stringify(message));
        await apiClient.post(`/message/send`, message, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        this.newMessage = "";
      } catch (error) {
        console.error("메시지 저장 실패:", error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "잘못된 날짜";
      }
      const now = new Date();
      const diff = Math.floor((now - date) / (1000 * 60 * 60));

      if (diff < 24) {
        return `${diff}시간 전`;
      } else {
        const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
        return date.toLocaleDateString("ko-KR", options);
      }
    },
  },
  mounted() {
    this.connect();
    this.axiosMessages();
  },
};
</script>
