<template>
    <div id="resetBox">
      <div class="reset-container">
        <h2 class="reset-id-pw-title">아이디 찾기</h2>
        <h2 class="reset-id-pw-title">/ 비밀번호 재설정하기</h2>
        <br>
        <div class="input-group">
          <h3 class="email-title">이메일</h3>
        <input 
        type="email" 
        v-model="email" 
        placeholder="이메일을 입력하세요" 
        required 
        />
      </div>
      
      <div class="button-group">
        <button type="button" class="reset-button" @click="findId">아이디 찾기</button>
        <button type="button" class="reset-button" @click="resetPw">비밀번호 재설정</button>
      </div>
    </div>
  </div>
  </template>
  
  <script>
import apiClient from '@/api/api';
import { toast } from 'vue3-toastify'; 
import '../css/resetIdPassword.css';

export default {
  data() {
    return {
      email: "", // 사용자가 입력한 이메일을 저장하는 변수
    };
  },
  methods: {
    // 아이디 찾기 버튼 클릭 시 호출되는 함수
    async findId() {
      if (this.email) {
        try {
          // 아이디 찾기 엔드포인트에 POST 요청을 보냅니다.
          const response = await apiClient.post('/auth/find-id', {
            email: this.email,
            
          });
          console.log(response.data.userId);
          
          if (response.data.userId) {
            toast.success(`아이디는 ${response.data.userId} 입니다.`);
          } else {
            toast.error('아이디를 찾을 수 없습니다.');
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            toast.error('해당 이메일의 아이디를 찾을 수 없습니다.');
          } else {
            toast.error('서버 오류가 발생했습니다. 다시 시도해 주세요.');
          }
        }
      } else {
        toast.error('이메일을 입력해주세요.');
      }
    },

    // 비밀번호 재설정 버튼 클릭 시 호출되는 함수
    async resetPw() {
      if (this.email) {
        try {
          // 비밀번호 재설정 엔드포인트에 POST 요청을 보냅니다.
          const response = await apiClient.post('/auth/reset-password', {
            email: this.email,
          });
          toast.success(response.data); // 서버에서 반환된 메시지를 알림으로 표시
        } catch (error) {
          if (error.response && error.response.status === 404) {
            toast.error('해당 이메일의 계정이 존재하지 않습니다.');
            alert('해당 이메일의 계정이 존재하지 않습니다.'); //
          } else {
            toast.error('서버 오류가 발생했습니다. 다시 시도해 주세요.');
          }
        }
      } else {
        toast.error('이메일을 입력해주세요.');
      }
    },
  },
};
</script>
