<template>
  <div id = "chatRoom">
    <!-- 게시판 정보 표시 -->
    <div v-if="board">
      <h2>{{ board.title }}</h2>
      <p>가격: {{ board.price }}</p>
      <p>{{ board.contents }}</p>
    </div>

    <!-- 메시지 목록 표시 -->
    <ul>
      <li v-for="message in messages" :key="message.no">
        <strong>{{ message.senderId || message.sellerId }}:</strong> {{ message.messageContents }}
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
    // WebSocket 연결 및 중복 방지
    connect() {
      if (this.stompClient) {
        return;
      }

      const socket = new SockJS("/ws");
      this.stompClient = Stomp.over(socket);

      this.stompClient.connect({}, () => {
        this.stompClient.subscribe(`/topic/chatRoom/${this.chatRoomId}`, (message) => {
          const parsedMessage = JSON.parse(message.body);

          // 중복 메시지 체크 및 추가
          if (!this.messages.some(m => m.no === parsedMessage.no)) {
            this.messages.push(parsedMessage);
          }
        });
      }, (error) => {
        console.error("WebSocket 연결 실패:", error);
      });
    },

    // 메시지 전송
    async sendMessage() {
      if (this.newMessage.trim() !== "") {
        const token = localStorage.getItem('token');
        const message = {
          messageContents: this.newMessage,
          senderId: this.senderId,
          receiverId: this.receiverId,
          chatRoomNo: this.chatRoomId,
        };

        try {
          // WebSocket으로 메시지 전송
          this.stompClient.send(`/app/chat.send/${this.chatRoomId}`, {}, JSON.stringify(message));
          console.log("메시지 전송:", message);

          // HTTP 요청으로 서버에 메시지 저장 (WebSocket 메시지 수신 후 화면에 출력되므로 push 생략)
          apiClient.post(`/message/send`, message,
            {
              headers: {
                'Authorization': `Bearer ${token}`, // JWT 토큰을 헤더에 추가
              }
            }
          );
        } catch (error) {
          console.error("메시지 저장 실패:", error);
        }
        this.newMessage = "";
      }
    },

    // 메시지 가져오기
    async fetchMessages() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("토큰이 없습니다.");
            return;
        }
        try {
            const response = apiClient.get(`/message/${this.chatRoomId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`  // JWT 토큰을 헤더에 추가
                }
            });
            console.log("응답 데이터:", response.data);

            // 응답 데이터가 제대로 왔는지 확인
            if (!response.data || !response.data.messages) {
                console.error("응답 데이터에 messages가 없습니다.");
                return;
            }
            
            // 서버 응답에서 messages 배열 추출
            const messagesData = response.data.messages;
            
            if (Array.isArray(messagesData)) {
                this.messages = messagesData;
                console.log("메시지 목록 불러오기 성공:", this.messages);
            } else {
                console.error("메시지 데이터가 배열이 아닙니다:", response.data);
            }
        } catch (error) {
            console.error("메시지 불러오기 실패:", error);
        }
    },

    // 날짜 포맷
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
  // 컴포넌트가 마운트되면 WebSocket 연결 및 메시지, 게시판 정보 가져오기
  mounted() {
    this.connect();
    this.fetchMessages();
  },
};
</script>
