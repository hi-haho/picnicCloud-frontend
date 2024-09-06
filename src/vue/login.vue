<template>
  <div id="login-page">
    <div class="login-container">
      <h1 class="login-title">로그인</h1>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <input 
            type="text" 
            v-model="username" 
            placeholder="아이디" 
            required 
          />
        </div>
        <div class="input-group">
          <input 
            type="password" 
            v-model="password" 
            placeholder="비밀번호" 
            required 
          />
        </div>
        <button type="submit" class="login-button">로그인</button>
      </form>
      <div class="links">
          <router-link to="/signUp">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/api/api'; // apiClient를 가져옵니다.

export default {
  name: "LogIn",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async handleSubmit() {
      try {
        // 로그인 요청 데이터 구성
        const loginData = {
          id: this.username,
          pw: this.password,
        };

        // 백엔드로 POST 요청
        const response = await apiClient.post('/auth/login', loginData); // apiClient 사용

        // 로그인 성공 시 토큰 저장 (예: 로컬 스토리지)
        if (response.status === 200) {
          const token = response.data;
          localStorage.setItem('token', token); // JWT 토큰 저장
          alert('로그인 성공');
          // 로그인 후 리다이렉트 (예: 메인 페이지로)
          this.$router.push('/');
        }
      } catch (error) {
        // 에러 처리
        if (error.response && error.response.status === 403) {
          alert(error.response.data); // 비활성화된 계정 메시지
        } else {
          alert('로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.');
        }
        console.error(error);
      }
    },
  },
};
</script>

<style src="../css/login.css"></style>
