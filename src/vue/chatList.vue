<template>
  <div id="chatList">
    <ul>
      <li v-for="chatRoom in chatRooms" :key="chatRoom.no">
        <span>{{ chatRoom.senderId }}: {{ chatRoom.lastMessage }}</span>
        <br/>
        <small>{{ formatLastMessageTime(chatRoom.lastMessageTime) }}</small>
        <br/>
        <button @click="enterChatRoom(chatRoom.chatRoomNo)">채팅방으로 들어가기</button>
      </li>
      <li v-if="chatRooms.length === 0">채팅방이 없습니다</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/api.js';
import jwt_decode from 'jwt-decode';

const router = useRouter();
const chatRooms = ref([]);

const getChatRoomList = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('토큰이 없습니다.');
    return;
  }

  // JWT 토큰에서 userId 추출
  const decodedToken = jwt_decode(token);
  const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 계산
  
  if (decodedToken.exp < currentTime) {
    console.error('토큰이 만료되었습니다.');
    localStorage.removeItem('token');
    // 로그인 페이지로 리디렉션
    router.push('/login');
    return;
  }

  try {
    const response = await apiClient.get(`/api/chatList`,{
      headers: {
        Authorization: `Bearer ${token}` // Authorization 헤더에 토큰을 추가
      }
    });
    chatRooms.value = response.data;
    console.log("채팅 목록 조회 성공:", response.data);
  } catch (error) {
    console.error('채팅 목록 조회 실패', error);
    console.error('에러 메시지:', error.response);
  }
};

const enterChatRoom = (chatRoomNo) => {
  // 채팅방으로 이동
  router.push(`/chatRoom/${chatRoomNo}`);
};

const formatLastMessageTime = (lastMessageTime) => {
  const now = new Date();
  const messageTime = new Date(lastMessageTime);
  const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInMinutes < 60) {
    return diffInMinutes > 0
      ? `${diffInMinutes}분 전`
      : '방금 전';
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else {
    return messageTime.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }) + ' ' + messageTime.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

onMounted(() => {
  getChatRoomList();
});
</script>